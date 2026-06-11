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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import { mockAdmins, mockRoles, type Admin } from "@/lib/mocks/data";
import { Plus, Pencil, Trash2, KeyRound, RotateCcw } from "lucide-react";

export default function AdminAccountPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resettingId, setResettingId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    role: "",
    status: true,
  });

  // 筛选管理员
  const filteredAdmins = admins.filter((admin) => {
    if (filterKeyword && !admin.username.includes(filterKeyword) && !admin.name.includes(filterKeyword))
      return false;
    if (filterRole !== "all" && admin.role !== filterRole) return false;
    if (filterStatus !== "all" && admin.status !== filterStatus) return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({ username: "", name: "", role: "", status: true });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      username: admin.username,
      name: admin.name,
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

  // 打开重置密码弹窗
  const openResetDialog = (id: string) => {
    setResettingId(id);
    setIsResetDialogOpen(true);
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
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      lastLogin: null,
    };

    setAdmins([...admins, newAdmin]);
    setIsAddDialogOpen(false);
    toast.success("管理员添加成功，默认密码：123456");
  };

  // 编辑管理员
  const handleEdit = () => {
    if (!editingAdmin) return;

    setAdmins(
      admins.map((a) =>
        a.id === editingAdmin.id
          ? { ...a, name: formData.name, role: formData.role, status: formData.status ? "启用" : "禁用" }
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

  // 重置密码
  const handleResetPassword = () => {
    if (resettingId) {
      setIsResetDialogOpen(false);
      toast.success("密码已重置为：123456");
    }
  };

  // 切换状态
  const toggleStatus = (admin: Admin) => {
    setAdmins(
      admins.map((a) =>
        a.id === admin.id ? { ...a, status: a.status === "启用" ? "禁用" : "启用" } : a
      )
    );
    toast.success(admin.status === "启用" ? "已禁用账户" : "已启用账户");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">管理员账户管理</h1>
          <p className="text-muted-foreground">管理系统管理员账户和权限</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>用户名/姓名</Label>
            <Input
              placeholder="输入用户名或姓名"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="space-y-2">
            <Label>角色</Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="全部角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                {mockRoles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="启用">启用</SelectItem>
                <SelectItem value="禁用">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => {}}>
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            重置
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>最后登录</TableHead>
              <TableHead className="w-40">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.username}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{admin.role}</Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={admin.status === "启用"}
                    onCheckedChange={() => toggleStatus(admin)}
                  />
                </TableCell>
                <TableCell>{admin.createdAt}</TableCell>
                <TableCell>{admin.lastLogin || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(admin)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openResetDialog(admin.id)}>
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(admin.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">共 {filteredAdmins.length} 条记录</div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增管理员</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="请输入用户名"
              />
            </div>
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入姓名"
              />
            </div>
            <div className="space-y-2">
              <Label>角色</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>启用状态</Label>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button onClick={handleAdd}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑管理员 - {editingAdmin?.username}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>用户名</Label>
              <Input value={formData.username} disabled />
            </div>
            <div className="space-y-2">
              <Label>姓名</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>角色</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockRoles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>启用状态</Label>
              <Switch
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>确定要删除该管理员吗？此操作不可撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 重置密码确认弹窗 */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认重置密码</AlertDialogTitle>
            <AlertDialogDescription>密码将被重置为默认密码：123456</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>确认重置</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
