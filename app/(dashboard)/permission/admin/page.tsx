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
import { toast } from "sonner";
import { mockAdmins, mockRoles, type Admin } from "@/lib/mocks/data";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
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
  admin,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  admin: Admin;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id: admin.id });

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
        <DragHandle id={admin.id} />
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label="选择行"
          />
          <span className="font-medium">{admin.username}</span>
        </div>
      </TableCell>
      <TableCell className="py-3">{admin.name}</TableCell>
      <TableCell className="py-3">
        <Badge variant="outline">{admin.role}</Badge>
      </TableCell>
      <TableCell className="py-3">{admin.createdAt}</TableCell>
      <TableCell className="py-3">{admin.lastLogin || "-"}</TableCell>
      <TableCell className="py-3">
        <Badge variant={admin.status === "启用" ? "default" : "secondary"}>
          {admin.status}
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

export default function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBatchRoleDialogOpen, setIsBatchRoleDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 新增/编辑表单状态
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    role: "",
    status: true,
  });

  // 批量分配角色
  const [batchRole, setBatchRole] = useState("");

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // 筛选管理员
  const filteredAdmins = admins.filter((admin) => {
    if (filterKeyword && !admin.username.includes(filterKeyword) && !admin.name.includes(filterKeyword)) {
      return false;
    }
    if (filterRole !== "all" && admin.role !== filterRole) {
      return false;
    }
    if (filterStatus !== "all" && admin.status !== filterStatus) {
      return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredAdmins.length / pageSize);
  const paginatedAdmins = filteredAdmins.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterRole("all");
    setFilterStatus("all");
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedAdmins.map((a) => a.id));
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
      const oldIndex = admins.findIndex((a) => a.id === active.id);
      const newIndex = admins.findIndex((a) => a.id === over.id);
      setAdmins(arrayMove(admins, oldIndex, newIndex));
    }
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      username: "",
      name: "",
      password: "",
      role: "",
      status: true,
    });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      name: admin.name,
      password: "",
      role: admin.role,
      status: admin.status === "启用",
    });
    setIsEditDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 新增管理员
  const handleAdd = () => {
    if (!formData.username || !formData.name || !formData.role) {
      toast.error("请填写完整信息");
      return;
    }

    const newAdmin: Admin = {
      id: Date.now().toString(),
      username: formData.username,
      name: formData.name,
      role: formData.role,
      status: formData.status ? "启用" : "禁用",
      createdAt: new Date().toLocaleString("zh-CN"),
      lastLogin: null,
    };

    setAdmins([...admins, newAdmin]);
    setIsAddDialogOpen(false);
    toast.success("新增成功");
  };

  // 编辑管理员
  const handleEdit = () => {
    if (!editingAdmin) return;

    setAdmins(
      admins.map((a) =>
        a.id === editingAdmin.id
          ? {
              ...a,
              name: formData.name,
              role: formData.role,
              status: formData.status ? "启用" : "禁用",
            }
          : a
      )
    );
    setIsEditDialogOpen(false);
    toast.success("修改成功");
  };

  // 删除管理员
  const handleDelete = () => {
    if (deletingId) {
      setAdmins(admins.filter((a) => a.id !== deletingId));
      setIsDeleteDialogOpen(false);
      toast.success("删除成功");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除的管理员");
      return;
    }

    setAdmins(admins.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    toast.success(`成功删除 ${selectedIds.length} 条记录`);
  };

  // 批量分配角色
  const handleBatchAssignRole = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要分配角色的管理员");
      return;
    }
    if (!batchRole) {
      toast.error("请选择角色");
      return;
    }

    setAdmins(
      admins.map((a) =>
        selectedIds.includes(a.id) ? { ...a, role: batchRole } : a
      )
    );
    setSelectedIds([]);
    setBatchRole("");
    setIsBatchRoleDialogOpen(false);
    toast.success(`成功为 ${selectedIds.length} 人分配角色`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="用户名/姓名"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-40"
          />
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {mockRoles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <>
              <Button variant="outline" size="sm" onClick={handleBatchDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBatchRoleDialogOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                分配角色
              </Button>
            </>
          )}
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增管理员
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
                        paginatedAdmins.length > 0 &&
                        selectedIds.length === paginatedAdmins.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    用户名
                  </div>
                </TableHead>
                <TableHead className="h-12">姓名</TableHead>
                <TableHead className="h-12">角色</TableHead>
                <TableHead className="h-12">创建时间</TableHead>
                <TableHead className="h-12">最后登录</TableHead>
                <TableHead className="h-12">状态</TableHead>
                <TableHead className="w-12 h-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAdmins.length > 0 ? (
                <SortableContext
                  items={paginatedAdmins.map((a) => a.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {paginatedAdmins.map((admin) => (
                    <DraggableRow
                      key={admin.id}
                      admin={admin}
                      isSelected={selectedIds.includes(admin.id)}
                      onSelect={(checked) => handleSelect(admin.id, checked)}
                      onEdit={() => openEditDialog(admin)}
                      onDelete={() => openDeleteDialog(admin.id)}
                    />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
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
          共 {filteredAdmins.length} 条记录
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增管理员</DialogTitle>
            <DialogDescription>
              创建新的管理员账号并分配角色权限
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-username">用户名</Label>
              <Input
                id="add-username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="请输入用户名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-name">姓名</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="请输入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">密码</Label>
              <Input
                id="add-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="请输入密码"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-role">角色</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="add-role">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <div className="flex h-9 items-center">
                  <Switch
                    checked={formData.status}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status: checked })
                    }
                  />
                  <span className="ml-2 text-sm">
                    {formData.status ? "启用" : "禁用"}
                  </span>
                </div>
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
            <DialogTitle>编辑管理员</DialogTitle>
            <DialogDescription>
              修改管理员账号信息和权限设置
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input value={formData.username} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">姓名</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">角色</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <div className="flex h-9 items-center">
                  <Switch
                    checked={formData.status}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status: checked })
                    }
                  />
                  <span className="ml-2 text-sm">
                    {formData.status ? "启用" : "禁用"}
                  </span>
                </div>
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

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该管理员吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 批量分配角色弹窗 */}
      <Dialog open={isBatchRoleDialogOpen} onOpenChange={setIsBatchRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量分配角色</DialogTitle>
            <DialogDescription>
              为已选择的 {selectedIds.length} 个管理员分配角色
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="batch-role">选择角色</Label>
              <Select value={batchRole} onValueChange={setBatchRole}>
                <SelectTrigger id="batch-role">
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBatchRoleDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleBatchAssignRole}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
