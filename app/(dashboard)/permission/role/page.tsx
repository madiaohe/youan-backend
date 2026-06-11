"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { mockRoles, menuPermissions, type Role, type MenuPermission } from "@/lib/mocks/data";
import { Plus, Pencil, Trash2, Settings } from "lucide-react";

export default function RoleListPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });

  // 权限选择状态
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      name: "",
      description: "",
      status: true,
    });
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
      permissionCount: 0,
      createdAt: new Date().toLocaleString("zh-CN"),
      status: formData.status ? "启用" : "禁用",
      permissions: [],
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

  // 权限选择 - 检查是否选中
  const isPermissionSelected = (id: string) => selectedPermissions.includes(id);

  // 权限选择 - 切换
  const togglePermission = (id: string, hasChildren: boolean) => {
    if (hasChildren) {
      // 父级菜单：切换所有子级
      const menu = menuPermissions.find((m) => m.id === id);
      if (menu?.children) {
        const childIds = menu.children.map((c) => c.id);
        const allSelected = childIds.every((cid) => selectedPermissions.includes(cid));

        if (allSelected) {
          // 取消选中所有子级和父级
          setSelectedPermissions(
            selectedPermissions.filter((p) => p !== id && !childIds.includes(p))
          );
        } else {
          // 选中所有子级和父级
          setSelectedPermissions([
            ...new Set([...selectedPermissions, id, ...childIds]),
          ]);
        }
      }
    } else {
      // 子级菜单
      if (selectedPermissions.includes(id)) {
        setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
      } else {
        setSelectedPermissions([...selectedPermissions, id]);
      }
    }

    // 更新父级状态
    updateParentState();
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

  // 保存权限
  const handleSavePermissions = () => {
    if (!editingRole) return;

    // 计算权限数量（只计算子级）
    const childCount = menuPermissions.reduce((count, menu) => {
      if (menu.children) {
        return (
          count +
          menu.children.filter((c) => selectedPermissions.includes(c.id)).length
        );
      }
      return count;
    }, 0);

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
              onCheckedChange={() => togglePermission(item.id, !!hasChildren)}
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">角色管理</h1>
          <p className="text-muted-foreground">管理系统角色及权限分配</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增角色
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>角色名称</TableHead>
              <TableHead>角色描述</TableHead>
              <TableHead>权限数量</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Badge variant="outline">{role.permissionCount} 个</Badge>
                </TableCell>
                <TableCell>{role.createdAt}</TableCell>
                <TableCell>
                  <Badge
                    variant={role.status === "启用" ? "default" : "secondary"}
                  >
                    {role.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openPermissionDialog(role)}
                      title="配置权限"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增角色</DialogTitle>
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
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="add-status">状态</Label>
              <Switch
                id="add-status"
                checked={formData.status}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked })
                }
              />
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
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-status">状态</Label>
              <Switch
                id="edit-status"
                checked={formData.status}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, status: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 权限配置弹窗 */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑角色权限 - {editingRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-4 block">菜单权限</Label>
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
