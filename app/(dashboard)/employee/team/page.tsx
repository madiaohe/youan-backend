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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { mockTeams, mockEmployees, type Team } from "@/lib/mocks/data";
import { Plus, Pencil, Trash2, Users, User } from "lucide-react";

export default function TeamManagementPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEmployeesDialogOpen, setIsEmployeesDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    leader: "",
    leaderPhone: "",
    status: true,
  });

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      code: "",
      name: "",
      leader: "",
      leaderPhone: "",
      status: true,
    });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      code: team.code,
      name: team.name,
      leader: team.leader,
      leaderPhone: team.leaderPhone,
      status: team.status === "启用",
    });
    setIsEditDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 打开员工列表弹窗
  const openEmployeesDialog = (teamId: string) => {
    setViewingTeamId(teamId);
    setIsEmployeesDialogOpen(true);
  };

  // 新增区队
  const handleAdd = () => {
    if (!formData.code || !formData.name) {
      toast.error("请填写区队编码和名称");
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      employeeCount: 0,
      leader: formData.leader,
      leaderPhone: formData.leaderPhone,
      createdAt: new Date().toISOString().split("T")[0],
      status: formData.status ? "启用" : "禁用",
    };

    setTeams([...teams, newTeam]);
    setIsAddDialogOpen(false);
    toast.success("新增成功");
  };

  // 编辑区队
  const handleEdit = () => {
    if (!editingTeam) return;

    setTeams(
      teams.map((t) =>
        t.id === editingTeam.id
          ? {
              ...t,
              code: formData.code,
              name: formData.name,
              leader: formData.leader,
              leaderPhone: formData.leaderPhone,
              status: formData.status ? "启用" : "禁用",
            }
          : t
      )
    );
    setIsEditDialogOpen(false);
    toast.success("修改成功");
  };

  // 删除区队
  const handleDelete = () => {
    if (deletingId) {
      const team = teams.find((t) => t.id === deletingId);
      if (team && team.employeeCount > 0) {
        toast.error("该区队下还有员工，无法删除");
        setIsDeleteDialogOpen(false);
        return;
      }
      setTeams(teams.filter((t) => t.id !== deletingId));
      setIsDeleteDialogOpen(false);
      toast.success("删除成功");
    }
  };

  // 获取区队员工列表
  const getTeamEmployees = (teamId: string) => {
    return mockEmployees.filter((emp) => emp.teamId === teamId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">区队管理</h1>
          <p className="text-muted-foreground">管理区队信息及员工关联</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增区队
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>区队编码</TableHead>
              <TableHead>区队名称</TableHead>
              <TableHead>员工人数</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-40">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.code}</TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{team.employeeCount} 人</Badge>
                </TableCell>
                <TableCell>{team.leader}</TableCell>
                <TableCell>{team.leaderPhone}</TableCell>
                <TableCell>
                  <Badge variant={team.status === "启用" ? "default" : "secondary"}>
                    {team.status}
                  </Badge>
                </TableCell>
                <TableCell>{team.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEmployeesDialog(team.id)}
                      title="查看员工"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(team)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(team.id)}
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

      <div className="text-sm text-muted-foreground">
        共 {teams.length} 条记录
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增区队</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-code">区队编码</Label>
                <Input
                  id="add-code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="请输入编码，如 T007"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-name">区队名称</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="请输入名称"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-leader">负责人</Label>
                <Input
                  id="add-leader"
                  value={formData.leader}
                  onChange={(e) =>
                    setFormData({ ...formData, leader: e.target.value })
                  }
                  placeholder="请输入负责人姓名"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-leaderPhone">联系电话</Label>
                <Input
                  id="add-leaderPhone"
                  value={formData.leaderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderPhone: e.target.value })
                  }
                  placeholder="请输入电话"
                />
              </div>
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
            <DialogTitle>编辑区队</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>区队编码</Label>
                <Input value={formData.code} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">区队名称</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-leader">负责人</Label>
                <Input
                  id="edit-leader"
                  value={formData.leader}
                  onChange={(e) =>
                    setFormData({ ...formData, leader: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-leaderPhone">联系电话</Label>
                <Input
                  id="edit-leaderPhone"
                  value={formData.leaderPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, leaderPhone: e.target.value })
                  }
                />
              </div>
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
              确定要删除该区队吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 员工列表弹窗 */}
      <Dialog open={isEmployeesDialogOpen} onOpenChange={setIsEmployeesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {teams.find((t) => t.id === viewingTeamId)?.name} - 员工列表
              <span className="text-muted-foreground font-normal ml-2">
                ({getTeamEmployees(viewingTeamId || "").length} 人)
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="h-72">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>工号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTeamEmployees(viewingTeamId || "").map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.employeeId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3" />
                          </div>
                          {employee.name}
                        </div>
                      </TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.status === "启用" ? "default" : "secondary"}
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getTeamEmployees(viewingTeamId || "").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        暂无员工
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmployeesDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
