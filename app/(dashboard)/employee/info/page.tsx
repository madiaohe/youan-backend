"use client";

import { useState, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { mockEmployees, mockTeams, type Employee } from "@/lib/mocks/data";
import {
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Upload,
  Download,
  Search,
  RotateCcw,
  User,
} from "lucide-react";

export default function EmployeeInfoPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 表单状态
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    teamId: "",
    phone: "",
    cardNo: "",
    status: true,
  });

  // 导入文件
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 筛选员工
  const filteredEmployees = employees.filter((emp) => {
    if (filterKeyword && !emp.employeeId.includes(filterKeyword) && !emp.name.includes(filterKeyword)) return false;
    if (filterTeam !== "all" && emp.teamId !== filterTeam) return false;
    if (filterStatus !== "all" && emp.status !== filterStatus) return false;
    return true;
  });

  // 全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredEmployees.map((e) => e.id));
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

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterStatus("all");
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      employeeId: "",
      name: "",
      teamId: "",
      phone: "",
      cardNo: "",
      status: true,
    });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      teamId: employee.teamId,
      phone: employee.phone,
      cardNo: employee.cardNo,
      status: employee.status === "启用",
    });
    setIsEditDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 新增员工
  const handleAdd = () => {
    if (!formData.employeeId || !formData.name || !formData.teamId) {
      toast.error("请填写完整信息");
      return;
    }

    const team = mockTeams.find((t) => t.id === formData.teamId);

    const newEmployee: Employee = {
      id: Date.now().toString(),
      employeeId: formData.employeeId,
      name: formData.name,
      teamId: formData.teamId,
      teamName: team?.name || "",
      phone: formData.phone,
      cardNo: formData.cardNo,
      hasFace: false,
      faceLoginEnabled: false,
      status: formData.status ? "启用" : "禁用",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
    toast.success("新增成功");
  };

  // 编辑员工
  const handleEdit = () => {
    if (!editingEmployee) return;

    const team = mockTeams.find((t) => t.id === formData.teamId);

    setEmployees(
      employees.map((e) =>
        e.id === editingEmployee.id
          ? {
              ...e,
              employeeId: formData.employeeId,
              name: formData.name,
              teamId: formData.teamId,
              teamName: team?.name || "",
              phone: formData.phone,
              cardNo: formData.cardNo,
              status: formData.status ? "启用" : "禁用",
            }
          : e
      )
    );
    setIsEditDialogOpen(false);
    toast.success("修改成功");
  };

  // 删除员工
  const handleDelete = () => {
    if (deletingId) {
      setEmployees(employees.filter((e) => e.id !== deletingId));
      setIsDeleteDialogOpen(false);
      toast.success("删除成功");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除的员工");
      return;
    }

    setEmployees(employees.filter((e) => !selectedIds.includes(e.id)));
    setSelectedIds([]);
    toast.success(`成功删除 ${selectedIds.length} 条记录`);
  };

  // 重置密码
  const handleResetPassword = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要重置密码的员工");
      return;
    }

    toast.success(`已为 ${selectedIds.length} 名员工重置密码为默认密码（123456）`);
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  // 批量导入
  const handleImport = () => {
    if (!importFile) {
      toast.error("请选择要导入的文件");
      return;
    }

    // Mock 导入
    setIsImportDialogOpen(false);
    setImportFile(null);
    toast.success(`成功导入 15 条员工数据`);
  };

  // 下载模板
  const handleDownloadTemplate = () => {
    toast.success("模板下载中...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">员工信息维护</h1>
          <p className="text-muted-foreground">管理员工基本信息</p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2">
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增员工
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
          onClick={() => setIsImportDialogOpen(true)}
        >
          <Upload className="mr-2 h-4 w-4" />
          批量导入
        </Button>
        <Button
          variant="outline"
          onClick={handleResetPassword}
          disabled={selectedIds.length === 0}
        >
          <KeyRound className="mr-2 h-4 w-4" />
          重置密码
        </Button>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label>工号/姓名</Label>
            <Input
              placeholder="输入工号或姓名"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>所属区队</Label>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger>
                <SelectValue placeholder="全部区队" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部区队</SelectItem>
                {mockTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="启用">启用</SelectItem>
                <SelectItem value="禁用">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => {}}>
              <Search className="mr-2 h-4 w-4" />
              查询
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>工号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>所属区队</TableHead>
              <TableHead>手机号</TableHead>
              <TableHead>刷卡卡号</TableHead>
              <TableHead>人脸</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(employee.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(employee.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{employee.employeeId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.facePhoto} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    {employee.name}
                  </div>
                </TableCell>
                <TableCell>{employee.teamName}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell className="font-mono text-sm">{employee.cardNo}</TableCell>
                <TableCell>
                  <Badge variant={employee.hasFace ? "default" : "secondary"}>
                    {employee.hasFace ? "已录入" : "未录入"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.status === "启用" ? "default" : "secondary"}>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(employee)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(employee.id)}
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
        共 {filteredEmployees.length} 条记录
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增员工</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-employeeId">工号</Label>
                <Input
                  id="add-employeeId"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  placeholder="请输入工号"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-team">所属区队</Label>
              <Select
                value={formData.teamId}
                onValueChange={(value) =>
                  setFormData({ ...formData, teamId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择区队" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-phone">手机号</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="请输入手机号"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-cardNo">刷卡卡号</Label>
                <Input
                  id="add-cardNo"
                  value={formData.cardNo}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNo: e.target.value })
                  }
                  placeholder="请输入卡号"
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
            <DialogTitle>编辑员工</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>工号</Label>
                <Input value={formData.employeeId} disabled />
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team">所属区队</Label>
              <Select
                value={formData.teamId}
                onValueChange={(value) =>
                  setFormData({ ...formData, teamId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="请选择区队" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">手机号</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cardNo">刷卡卡号</Label>
                <Input
                  id="edit-cardNo"
                  value={formData.cardNo}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNo: e.target.value })
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
              确定要删除该员工吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 批量导入弹窗 */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量导入员工信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>1. 下载导入模板</Label>
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                下载 Excel 模板
              </Button>
            </div>

            <div className="space-y-2">
              <Label>2. 上传文件</Label>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  拖拽文件到此处，或点击选择
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 .xlsx .csv 格式
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {importFile && (
                <p className="text-sm text-muted-foreground">
                  已选择: {importFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleImport} disabled={!importFile}>
              开始导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
