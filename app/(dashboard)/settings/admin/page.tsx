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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus, Pencil, Trash2, KeyRound, RotateCcw, User, Search } from "lucide-react";

export default function AdminAccountPage() {
  const [admins, setAdmins] = useState<Admin[]>(mockAdmins);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // 统计
  const totalCount = filteredAdmins.length;
  const enabledCount = filteredAdmins.filter((a) => a.status === "启用").length;
  const disabledCount = filteredAdmins.filter((a) => a.status === "禁用").length;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // 全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAdmins.map((a) => a.id));
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
      setSelectedIds(selectedIds.filter((id) => id !== deletingId));
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
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              管理员总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的管理员数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已启用
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {totalCount > 0 ? Math.round((enabledCount / totalCount) * 100) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-green-600">{enabledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正常使用账户
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已禁用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-gray-500">{disabledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              停用账户
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="用户名/姓名"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-36"
          />
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              {mockRoles.map((role) => (
                <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
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
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增管理员
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 h-12 pl-4">
                <Checkbox
                  checked={filteredAdmins.length > 0 && selectedIds.length === filteredAdmins.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">用户名</TableHead>
              <TableHead className="h-12">姓名</TableHead>
              <TableHead className="h-12">角色</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12">创建时间</TableHead>
              <TableHead className="h-12">最后登录</TableHead>
              <TableHead className="h-12 w-28">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id} data-state={selectedIds.includes(admin.id) && "selected"}>
                  <TableCell className="py-3 pl-4">
                    <Checkbox
                      checked={selectedIds.includes(admin.id)}
                      onCheckedChange={(checked) => handleSelect(admin.id, checked as boolean)}
                      aria-label="选择行"
                    />
                  </TableCell>
                  <TableCell className="py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {admin.username}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{admin.name}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline">{admin.role}</Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={admin.status === "启用"}
                      onCheckedChange={() => toggleStatus(admin)}
                    />
                  </TableCell>
                  <TableCell className="py-3">{admin.createdAt}</TableCell>
                  <TableCell className="py-3">{admin.lastLogin || "-"}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(admin)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openResetDialog(admin.id)}>
                        <KeyRound className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(admin.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        {selectedIds.length > 0 && <span>已选择 {selectedIds.length} 项，</span>}
        共 {filteredAdmins.length} 条记录
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增管理员</DialogTitle>
            <DialogDescription>添加新的管理员账户</DialogDescription>
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
            <DialogDescription>修改管理员信息</DialogDescription>
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
