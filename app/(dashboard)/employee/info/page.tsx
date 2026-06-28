"use client";

import { useState, useRef } from "react";
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
  RotateCcw,
  User,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

// 默认初始密码
const DEFAULT_PASSWORD = "123456";

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
  employee,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onResetPassword,
}: {
  employee: Employee;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id: employee.id });

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
        <DragHandle id={employee.id} />
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label="选择行"
          />
          <span className="font-medium">{employee.employeeId}</span>
        </div>
      </TableCell>
      <TableCell className="py-3">
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
      <TableCell className="py-3">{employee.teamName}</TableCell>
      <TableCell className="py-3">{employee.phone}</TableCell>
      <TableCell className="py-3 font-mono text-sm">{employee.cardNo}</TableCell>
      <TableCell className="py-3">
        <Badge variant={employee.hasFace ? "default" : "secondary"}>
          {employee.hasFace ? "已录入" : "未录入"}
        </Badge>
      </TableCell>
      <TableCell className="py-3">
        <Badge variant={employee.status === "启用" ? "default" : "secondary"}>
          {employee.status}
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
            <DropdownMenuItem onClick={onResetPassword}>
              <KeyRound className="mr-2 h-4 w-4" />
              重置密码
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

export default function EmployeeInfoPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 表单状态
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    teamId: "",
    phone: "",
    cardNo: "",
    password: DEFAULT_PASSWORD,
    status: true,
  });

  // 密码显示状态
  const [showPassword, setShowPassword] = useState(false);

  // 导入文件
  const [importFile, setImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // 筛选员工
  const filteredEmployees = employees.filter((emp) => {
    if (filterKeyword && !emp.employeeId.includes(filterKeyword) && !emp.name.includes(filterKeyword)) return false;
    if (filterTeam !== "all" && emp.teamId !== filterTeam) return false;
    if (filterStatus !== "all" && emp.status !== filterStatus) return false;
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredEmployees.length / pageSize);
  const paginatedEmployees = filteredEmployees.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterStatus("all");
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedEmployees.map((e) => e.id));
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
      const oldIndex = employees.findIndex((e) => e.id === active.id);
      const newIndex = employees.findIndex((e) => e.id === over.id);
      setEmployees(arrayMove(employees, oldIndex, newIndex));
    }
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({
      employeeId: "",
      name: "",
      teamId: "",
      phone: "",
      cardNo: "",
      password: DEFAULT_PASSWORD,
      status: true,
    });
    setShowPassword(false);
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
      password: "",
      status: employee.status === "启用",
    });
    setShowPassword(false);
    setIsEditDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 打开重置密码弹窗
  const openResetPasswordDialog = (id: string) => {
    setResetPasswordId(id);
    setIsResetPasswordDialogOpen(true);
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
    toast.success(`新增成功，初始密码：${formData.password}`);
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
    if (formData.password) {
      toast.success("修改成功，密码已更新");
    } else {
      toast.success("修改成功");
    }
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

  // 重置单个员工密码
  const handleResetPassword = () => {
    setIsResetPasswordDialogOpen(false);
    toast.success(`密码已重置为：${DEFAULT_PASSWORD}`);
  };

  // 批量重置密码
  const handleBatchResetPassword = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要重置密码的员工");
      return;
    }
    toast.success(`已为 ${selectedIds.length} 名员工重置密码为：${DEFAULT_PASSWORD}`);
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

    setIsImportDialogOpen(false);
    setImportFile(null);
    toast.success("成功导入 15 条员工数据");
  };

  // 下载模板
  const handleDownloadTemplate = () => {
    toast.success("模板下载中...");
  };

  // 人力资源系统同步
  const handleSync = () => {
    setIsSyncDialogOpen(false);
    toast.success("已从人力资源系统同步 25 条员工数据");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="工号/姓名"
            value={filterKeyword}
            onChange={(e) => {
              setFilterKeyword(e.target.value);
              setPageIndex(0);
            }}
            className="w-32"
          />
          <Select
            value={filterTeam}
            onValueChange={(value) => {
              setFilterTeam(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="所属区队" />
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
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="启用">启用</SelectItem>
              <SelectItem value="禁用">禁用</SelectItem>
            </SelectContent>
          </Select>
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
              <Button variant="outline" size="sm" onClick={handleBatchResetPassword}>
                <KeyRound className="mr-2 h-4 w-4" />
                重置密码
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => setIsSyncDialogOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            人力同步
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            导入
          </Button>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增员工
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
                        paginatedEmployees.length > 0 &&
                        selectedIds.length === paginatedEmployees.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    工号
                  </div>
                </TableHead>
                <TableHead className="h-12">姓名</TableHead>
                <TableHead className="h-12">所属区队</TableHead>
                <TableHead className="h-12">手机号</TableHead>
                <TableHead className="h-12">刷卡卡号</TableHead>
                <TableHead className="h-12">人脸</TableHead>
                <TableHead className="h-12">状态</TableHead>
                <TableHead className="w-12 h-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                <SortableContext
                  items={paginatedEmployees.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {paginatedEmployees.map((employee) => (
                    <DraggableRow
                      key={employee.id}
                      employee={employee}
                      isSelected={selectedIds.includes(employee.id)}
                      onSelect={(checked) => handleSelect(employee.id, checked)}
                      onEdit={() => openEditDialog(employee)}
                      onDelete={() => openDeleteDialog(employee.id)}
                      onResetPassword={() => openResetPasswordDialog(employee.id)}
                    />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
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
          共 {filteredEmployees.length} 条记录
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
            <DialogTitle>新增员工</DialogTitle>
            <DialogDescription>
              创建新员工账号，初始密码为 6 位数字
            </DialogDescription>
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
            <div className="space-y-2">
              <Label htmlFor="add-password">初始密码</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="add-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="请输入初始密码"
                    maxLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFormData({ ...formData, password: DEFAULT_PASSWORD })}
                >
                  默认
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                密码为 6 位数字，点击"默认"恢复为 {DEFAULT_PASSWORD}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label>状态</Label>
              <div className="flex items-center gap-2">
                <Switch
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
            <DialogTitle>编辑员工</DialogTitle>
            <DialogDescription>
              修改员工基本信息，密码留空则不修改
            </DialogDescription>
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
            <div className="space-y-2">
              <Label htmlFor="edit-password">修改密码</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="留空则不修改密码"
                    maxLength={6}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFormData({ ...formData, password: DEFAULT_PASSWORD })}
                >
                  重置
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                密码为 6 位数字，留空则不修改
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label>状态</Label>
              <div className="flex items-center gap-2">
                <Switch
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

      {/* 重置密码确认弹窗 */}
      <AlertDialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>重置密码</AlertDialogTitle>
            <AlertDialogDescription>
              确定要将该员工的密码重置为默认密码（{DEFAULT_PASSWORD}）吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>确定</AlertDialogAction>
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

      {/* 人力资源系统同步弹窗 */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>人力资源系统数据同步</DialogTitle>
            <DialogDescription>
              从人力资源系统同步员工基础信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span className="font-medium">同步说明</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 将同步工号、姓名、所属区队等基础信息</li>
                <li>• 新员工将自动创建，初始密码为 {DEFAULT_PASSWORD}</li>
                <li>• 已有员工信息将被更新</li>
                <li>• 同步不会删除已有员工数据</li>
              </ul>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">上次同步时间</p>
                <p className="text-sm text-muted-foreground">2024-01-15 14:30:00</p>
              </div>
              <Badge variant="secondary">已连接</Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              开始同步
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
