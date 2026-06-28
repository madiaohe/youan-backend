"use client";

import { useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { mockRoles, menuPermissions, type Role, type MenuPermission } from "@/lib/mocks/data";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  RotateCcw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
} from "lucide-react";

// 拖拽手柄组件
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVertical className="size-3" />
      <span className="sr-only">拖拽排序</span>
    </Button>
  );
}

// 可拖拽行组件
function DraggableRow({
  role,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onPermission,
}: {
  role: Role;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onPermission: () => void;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id: role.id });

  return (
    <TableRow
      data-state={isSelected && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <TableCell className="w-8 py-3">
        <DragHandle id={role.id} />
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label="选择行"
          />
          <span className="font-medium">{role.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-3">{role.description}</TableCell>
      <TableCell className="py-3">
        <Badge variant="outline">{role.permissionCount} 个</Badge>
      </TableCell>
      <TableCell className="py-3">{role.createdAt}</TableCell>
      <TableCell className="py-3">
        <Badge variant={role.status === "启用" ? "default" : "secondary"}>
          {role.status}
        </Badge>
      </TableCell>
      <TableCell className="w-12 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">操作</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPermission}>
              <Plus className="mr-2 h-4 w-4" />
              配置权限
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function RoleListPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });

  // 权限选择状态
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // 筛选角色
  const filteredRoles = roles.filter((role) => {
    if (filterKeyword && !role.name.includes(filterKeyword) && !role.description.includes(filterKeyword)) {
      return false;
    }
    if (filterStatus !== "all" && role.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredRoles.length / pageSize);
  const paginatedRoles = filteredRoles.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterStatus("all");
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedRoles.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 单选
  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = roles.findIndex((r) => r.id === active.id);
      const newIndex = roles.findIndex((r) => r.id === over.id);
      setRoles(arrayMove(roles, oldIndex, newIndex));
    }
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      name: "",
      description: "",
      status: true,
    });
    setSelectedPermissions([]);
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      status: role.status === "启用",
    });
    setIsEditDialogOpen(true);
  };

  // 打开权限配置弹窗
  const openPermissionDialog = (role: Role) => {
    setEditingRole(role);
    setSelectedPermissions(role.permissions);
    setIsPermissionDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 权限选择 - 检查是否选中
  const isPermissionSelected = (id: string) => selectedPermissions.includes(id);

  // 权限选择 - 切换
  const togglePermission = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      const menu = menuPermissions.find((m) => m.id === id);
      if (menu?.children) {
        const childIds = menu.children.map((c) => c.id);
        const allSelected = childIds.every((cid) => selectedPermissions.includes(cid));

        if (allSelected) {
          setSelectedPermissions(
            selectedPermissions.filter((p) => p !== id && !childIds.includes(p))
          );
        } else {
          setSelectedPermissions([
            ...new Set([...selectedPermissions, id, ...childIds]),
          ]);
        }
      }
    } else {
      if (selectedPermissions.includes(id)) {
        setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
      } else {
        setSelectedPermissions([...selectedPermissions, id]);
      }
    }
  };

  // 更新父级选中状态
  const updateParentState = () => {
    menuPermissions.forEach((menu) => {
      if (menu.children) {
        const childIds = menu.children.map((c) => c.id);
        const allSelected = childIds.every((cid) =>
          selectedPermissions.includes(cid)
        );

        if (allSelected && !selectedPermissions.includes(menu.id)) {
          setSelectedPermissions((prev) => [...prev, menu.id]);
        } else if (!allSelected && selectedPermissions.includes(menu.id)) {
          setSelectedPermissions((prev) => prev.filter((p) => p !== menu.id));
        }
      }
    });
  };

  // 计算权限数量
  const calculatePermissionCount = () => {
    return menuPermissions.reduce((count, menu) => {
      if (menu.children) {
        return (
          count +
          menu.children.filter((c) => selectedPermissions.includes(c.id)).length
        );
      }
      return count;
    }, 0);
  };

  // 新增角色
  const handleAdd = () => {
    if (!formData.name) {
      toast.error("请输入角色名称");
      return;
    }

    const newRole: Role = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      permissionCount: calculatePermissionCount(),
      createdAt: new Date().toLocaleString("zh-CN"),
      status: formData.status ? "启用" : "禁用",
      permissions: selectedPermissions,
    };

    setRoles([...roles, newRole]);
    setIsAddDialogOpen(false);
    toast.success("新增成功");
  };

  // 编辑角色
  const handleEdit = () => {
    if (!editingRole) return;

    setRoles(
      roles.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              name: formData.name,
              description: formData.description,
              status: formData.status ? "启用" : "禁用",
            }
          : r
      )
    );
    setIsEditDialogOpen(false);
    toast.success("修改成功");
  };

  // 删除角色
  const handleDelete = () => {
    if (deletingId) {
      setRoles(roles.filter((r) => r.id !== deletingId));
      setIsDeleteDialogOpen(false);
      toast.success("删除成功");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除的角色");
      return;
    }

    setRoles(roles.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    toast.success(`成功删除 ${selectedIds.length} 条记录`);
  };

  // 保存权限
  const handleSavePermissions = () => {
    if (!editingRole) return;

    const childCount = calculatePermissionCount();

    setRoles(
      roles.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              permissions: selectedPermissions,
              permissionCount: childCount,
            }
          : r
      )
    );
    setIsPermissionDialogOpen(false);
    toast.success("权限配置已保存");
  };

  // 渲染权限树
  const renderPermissionTree = (items: MenuPermission[], level: number = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isParentChecked = isPermissionSelected(item.id);

      return (
        <div key={item.id}>
          <div
            className={`flex items-center space-x-2 py-2 ${
              level > 0 ? "pl-6" : ""
            }`}
          >
            <Checkbox
              id={item.id}
              checked={isParentChecked}
              onCheckedChange={() => {
                togglePermission(item.id, !!hasChildren);
                updateParentState();
              }}
            />
            <Label htmlFor={item.id} className="cursor-pointer font-normal">
              {item.name}
            </Label>
          </div>
          {hasChildren && (
            <div className="border-l ml-3">
              {renderPermissionTree(item.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="角色名称/描述"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-40"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="启用">启用</SelectItem>
              <SelectItem value="禁用">禁用</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilter}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          )}
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增角色
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8 h-12"></TableHead>
                <TableHead className="h-12">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        paginatedRoles.length > 0 &&
                        selectedIds.length === paginatedRoles.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    角色名称
                  </div>
                </TableHead>
                <TableHead className="h-12">角色描述</TableHead>
                <TableHead className="h-12">权限数量</TableHead>
                <TableHead className="h-12">创建时间</TableHead>
                <TableHead className="h-12">状态</TableHead>
                <TableHead className="w-12 h-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.length > 0 ? (
                <SortableContext
                  items={paginatedRoles.map((r) => r.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {paginatedRoles.map((role) => (
                    <DraggableRow
                      key={role.id}
                      role={role}
                      isSelected={selectedIds.includes(role.id)}
                      onSelect={(checked) => handleSelect(role.id, checked)}
                      onEdit={() => openEditDialog(role)}
                      onDelete={() => openDeleteDialog(role.id)}
                      onPermission={() => openPermissionDialog(role)}
                    />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {selectedIds.length > 0 && (
            <span>已选择 {selectedIds.length} 项，</span>
          )}
          共 {filteredRoles.length} 条记录
        </div>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm">
              每页行数
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageIndex(0);
              }}
            >
              <SelectTrigger size="sm" className="w-16" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            第 {pageIndex + 1} / {pageCount || 1} 页
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">首页</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">上一页</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">下一页</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">末页</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新增角色</DialogTitle>
            <DialogDescription>
              创建新的角色并分配操作权限
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">角色名称</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="请输入角色名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">角色描述</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="请输入角色描述"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>菜单权限</Label>
              <ScrollArea className="h-48 rounded-md border p-4">
                {renderPermissionTree(menuPermissions)}
              </ScrollArea>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="add-status">状态</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="add-status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                />
                <span className="text-sm">
                  {formData.status ? "启用" : "禁用"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAdd}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
            <DialogDescription>
              修改角色基本信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">角色名称</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">角色描述</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-status">状态</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="edit-status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked })
                  }
                />
                <span className="text-sm">
                  {formData.status ? "启用" : "禁用"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 权限配置弹窗 */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>配置权限 - {editingRole?.name}</DialogTitle>
            <DialogDescription>
              为该角色分配菜单操作权限
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="h-80 rounded-md border p-4">
              {renderPermissionTree(menuPermissions)}
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPermissionDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={handleSavePermissions}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该角色吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
