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
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";

export default function AdminListPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBatchRoleDialogOpen, setIsBatchRoleDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  // 全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(admins.map((a) => a.id));
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">管理员列表</h1>
          <p className="text-muted-foreground">管理系统管理员账号</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
        <Button
          variant="outline"
          onClick={handleBatchDelete}
          disabled={selectedIds.length === 0}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          批量删除
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsBatchRoleDialogOpen(true)}
          disabled={selectedIds.length === 0}
        >
          <Users className="mr-2 h-4 w-4" />
          批量分配角色
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === admins.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(admin.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(admin.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{admin.username}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.role}</TableCell>
                <TableCell>
                  <Badge
                    variant={admin.status === "启用" ? "default" : "secondary"}
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell>{admin.createdAt}</TableCell>
                <TableCell>{admin.lastLogin || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(admin)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(admin.id)}
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
            <DialogTitle>新增管理员</DialogTitle>
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
            <div className="space-y-2">
              <Label htmlFor="add-role">角色</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
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
            <DialogTitle>编辑管理员</DialogTitle>
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
            <div className="space-y-2">
              <Label htmlFor="edit-role">角色</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
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
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              已选择 {selectedIds.length} 个管理员
            </p>
            <div className="space-y-2">
              <Label htmlFor="batch-role">选择角色</Label>
              <Select value={batchRole} onValueChange={setBatchRole}>
                <SelectTrigger>
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
            <Button
              variant="outline"
              onClick={() => setIsBatchRoleDialogOpen(false)}
            >
              取消
            </Button>
            <Button onClick={handleBatchAssignRole}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
