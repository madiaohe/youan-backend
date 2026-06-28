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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { mockTeams, mockEmployees, type Team, type Employee } from "@/lib/mocks/data";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  RotateCcw,
  User,
  ArrowRight,
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
  team,
  isSelected,
  onSelect,
  onEdit,
  onAssign,
  onViewEmployees,
  onDelete,
}: {
  team: Team;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onAssign: () => void;
  onViewEmployees: () => void;
  onDelete: () => void;
}) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id: team.id });

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
        <DragHandle id={team.id} />
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label="选择行"
          />
          <span className="font-medium">{team.code}</span>
        </div>
      </TableCell>
      <TableCell className="py-3">{team.name}</TableCell>
      <TableCell className="py-3">
        <Badge variant="outline">{team.employeeCount} 人</Badge>
      </TableCell>
      <TableCell className="py-3">{team.leader || "-"}</TableCell>
      <TableCell className="py-3">{team.leaderPhone || "-"}</TableCell>
      <TableCell className="py-3">
        <Badge variant={team.status === "启用" ? "default" : "secondary"}>
          {team.status}
        </Badge>
      </TableCell>
      <TableCell className="py-3">{team.createdAt}</TableCell>
      <TableCell className="w-12 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">操作</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAssign}>
              <UserPlus className="mr-2 h-4 w-4" />
              分配员工
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onViewEmployees}>
              <Users className="mr-2 h-4 w-4" />
              查看员工
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

export default function TeamManagementPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEmployeesDialogOpen, setIsEmployeesDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingTeamId, setViewingTeamId] = useState<string | null>(null);
  const [assigningTeamId, setAssigningTeamId] = useState<string | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 表单状态
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    leader: "",
    leaderPhone: "",
    status: true,
  });

  // 待分配员工列表
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [employeeSearchKeyword, setEmployeeSearchKeyword] = useState("");
  const [employeeFilterTeam, setEmployeeFilterTeam] = useState("all");

  // DnD sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // 筛选区队
  const filteredTeams = teams.filter((team) => {
    if (filterKeyword && !team.code.includes(filterKeyword) && !team.name.includes(filterKeyword)) return false;
    if (filterStatus !== "all" && team.status !== filterStatus) return false;
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredTeams.length / pageSize);
  const paginatedTeams = filteredTeams.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 获取可分配的员工列表（可按条件筛选）
  const getAvailableEmployees = () => {
    return employees.filter((emp) => {
      if (employeeSearchKeyword && !emp.employeeId.includes(employeeSearchKeyword) && !emp.name.includes(employeeSearchKeyword)) {
        return false;
      }
      if (employeeFilterTeam === "unassigned" && emp.teamId) {
        return false;
      }
      if (employeeFilterTeam !== "all" && employeeFilterTeam !== "unassigned" && emp.teamId !== employeeFilterTeam) {
        return false;
      }
      return true;
    });
  };

  // 获取区队员工列表
  const getTeamEmployees = (teamId: string) => {
    return employees.filter((emp) => emp.teamId === teamId);
  };

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterStatus("all");
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTeams.map((t) => t.id));
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
      const oldIndex = teams.findIndex((t) => t.id === active.id);
      const newIndex = teams.findIndex((t) => t.id === over.id);
      setTeams(arrayMove(teams, oldIndex, newIndex));
    }
  };

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

  // 打开分配员工弹窗
  const openAssignDialog = (teamId: string) => {
    setAssigningTeamId(teamId);
    setSelectedEmployeeIds([]);
    setEmployeeSearchKeyword("");
    setEmployeeFilterTeam("all");
    setIsAssignDialogOpen(true);
  };

  // 打开查看员工弹窗
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
    if (!deletingId) return;

    const team = teams.find((t) => t.id === deletingId);
    if (team && team.employeeCount > 0) {
      toast.error("该区队下还有员工，请先移除或调动员工");
      setIsDeleteDialogOpen(false);
      return;
    }
    setTeams(teams.filter((t) => t.id !== deletingId));
    setIsDeleteDialogOpen(false);
    toast.success("删除成功");
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除的区队");
      return;
    }

    const hasEmployees = selectedIds.some((id) => {
      const team = teams.find((t) => t.id === id);
      return team && team.employeeCount > 0;
    });

    if (hasEmployees) {
      toast.error("所选区队中有区队存在员工，请先移除或调动员工");
      return;
    }

    setTeams(teams.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    toast.success(`成功删除 ${selectedIds.length} 条记录`);
  };

  // 切换员工选择
  const toggleEmployeeSelection = (employeeId: string) => {
    if (selectedEmployeeIds.includes(employeeId)) {
      setSelectedEmployeeIds(selectedEmployeeIds.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployeeIds([...selectedEmployeeIds, employeeId]);
    }
  };

  // 确认分配员工
  const handleConfirmAssign = () => {
    if (!assigningTeamId) return;
    if (selectedEmployeeIds.length === 0) {
      toast.error("请选择要分配的员工");
      return;
    }

    const team = teams.find((t) => t.id === assigningTeamId);
    if (!team) return;

    // 更新员工的区队
    setEmployees(
      employees.map((emp) =>
        selectedEmployeeIds.includes(emp.id)
          ? { ...emp, teamId: assigningTeamId, teamName: team.name }
          : emp
      )
    );

    // 更新区队的员工数量
    const newEmployeeCount = selectedEmployeeIds.filter((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp && emp.teamId !== assigningTeamId;
    }).length;

    setTeams(
      teams.map((t) =>
        t.id === assigningTeamId
          ? { ...t, employeeCount: t.employeeCount + newEmployeeCount }
          : t
      )
    );

    // 如果员工原来属于其他区队，需要减少那个区队的员工数
    selectedEmployeeIds.forEach((empId) => {
      const emp = employees.find((e) => e.id === empId);
      if (emp && emp.teamId && emp.teamId !== assigningTeamId) {
        setTeams((prev) =>
          prev.map((t) =>
            t.id === emp.teamId
              ? { ...t, employeeCount: Math.max(0, t.employeeCount - 1) }
              : t
          )
        );
      }
    });

    setIsAssignDialogOpen(false);
    toast.success(`成功将 ${selectedEmployeeIds.length} 名员工分配到 ${team.name}`);
  };

  // 从区队移除员工
  const handleRemoveEmployee = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    // 更新员工信息
    setEmployees(
      employees.map((emp) =>
        emp.id === employeeId
          ? { ...emp, teamId: "", teamName: "" }
          : emp
      )
    );

    // 更新区队员工数量
    setTeams(
      teams.map((t) =>
        t.id === employee.teamId
          ? { ...t, employeeCount: Math.max(0, t.employeeCount - 1) }
          : t
      )
    );

    toast.success(`已将 ${employee.name} 从区队移除`);
  };

  // 调动员工到其他区队
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferringEmployee, setTransferringEmployee] = useState<Employee | null>(null);
  const [targetTeamId, setTargetTeamId] = useState("");

  const openTransferDialog = (employee: Employee) => {
    setTransferringEmployee(employee);
    setTargetTeamId("");
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!transferringEmployee || !targetTeamId) {
      toast.error("请选择目标区队");
      return;
    }

    const targetTeam = teams.find((t) => t.id === targetTeamId);
    if (!targetTeam) return;

    const oldTeamId = transferringEmployee.teamId;

    // 更新员工区队
    setEmployees(
      employees.map((emp) =>
        emp.id === transferringEmployee.id
          ? { ...emp, teamId: targetTeamId, teamName: targetTeam.name }
          : emp
      )
    );

    // 更新两个区队的员工数量
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === oldTeamId) {
          return { ...t, employeeCount: Math.max(0, t.employeeCount - 1) };
        }
        if (t.id === targetTeamId) {
          return { ...t, employeeCount: t.employeeCount + 1 };
        }
        return t;
      })
    );

    setIsTransferDialogOpen(false);
    toast.success(`已将 ${transferringEmployee.name} 调动到 ${targetTeam.name}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="编码/名称"
            value={filterKeyword}
            onChange={(e) => {
              setFilterKeyword(e.target.value);
              setPageIndex(0);
            }}
            className="w-32"
          />
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
            <Button variant="outline" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          )}
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增区队
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
                        paginatedTeams.length > 0 &&
                        selectedIds.length === paginatedTeams.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    区队编码
                  </div>
                </TableHead>
                <TableHead className="h-12">区队名称</TableHead>
                <TableHead className="h-12">员工人数</TableHead>
                <TableHead className="h-12">负责人</TableHead>
                <TableHead className="h-12">联系电话</TableHead>
                <TableHead className="h-12">状态</TableHead>
                <TableHead className="h-12">创建时间</TableHead>
                <TableHead className="w-12 h-12">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTeams.length > 0 ? (
                <SortableContext
                  items={paginatedTeams.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {paginatedTeams.map((team) => (
                    <DraggableRow
                      key={team.id}
                      team={team}
                      isSelected={selectedIds.includes(team.id)}
                      onSelect={(checked) => handleSelect(team.id, checked)}
                      onEdit={() => openEditDialog(team)}
                      onAssign={() => openAssignDialog(team.id)}
                      onViewEmployees={() => openEmployeesDialog(team.id)}
                      onDelete={() => openDeleteDialog(team.id)}
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
          共 {filteredTeams.length} 条记录
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
            <DialogTitle>新增区队</DialogTitle>
            <DialogDescription>
              创建新的区队信息
            </DialogDescription>
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
                  placeholder="如 T007"
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
            <DialogTitle>编辑区队</DialogTitle>
            <DialogDescription>
              修改区队基本信息
            </DialogDescription>
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
              确定要删除该区队吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 分配员工弹窗 */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              分配员工到 {teams.find((t) => t.id === assigningTeamId)?.name}
            </DialogTitle>
            <DialogDescription>
              选择要分配到该区队的员工
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="工号/姓名"
                value={employeeSearchKeyword}
                onChange={(e) => setEmployeeSearchKeyword(e.target.value)}
                className="w-32"
              />
              <Select value={employeeFilterTeam} onValueChange={setEmployeeFilterTeam}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="当前所属区队" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部区队</SelectItem>
                  <SelectItem value="unassigned">未分配</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ScrollArea className="h-80 rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>工号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>当前区队</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAvailableEmployees().map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="cursor-pointer"
                      onClick={() => toggleEmployeeSelection(employee.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedEmployeeIds.includes(employee.id)}
                          onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{employee.employeeId}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        {employee.teamName ? (
                          <Badge variant="outline">{employee.teamName}</Badge>
                        ) : (
                          <span className="text-muted-foreground">未分配</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {getAvailableEmployees().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        暂无符合条件的员工
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="text-sm text-muted-foreground">
              已选择 {selectedEmployeeIds.length} 名员工
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmAssign} disabled={selectedEmployeeIds.length === 0}>
              确认分配
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 查看员工弹窗 */}
      <Dialog open={isEmployeesDialogOpen} onOpenChange={setIsEmployeesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {teams.find((t) => t.id === viewingTeamId)?.name} - 员工列表
            </DialogTitle>
            <DialogDescription>
              该区队下的所有员工，可进行调动或移除操作
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="h-80 rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    <TableHead>工号</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>手机号</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="w-24">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTeamEmployees(viewingTeamId || "").map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employeeId}</TableCell>
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
                        <Badge variant={employee.status === "启用" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openTransferDialog(employee)}
                            title="调动"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveEmployee(employee.id)}
                            title="移除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getTeamEmployees(viewingTeamId || "").length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
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

      {/* 员工调动弹窗 */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>调动员工</DialogTitle>
            <DialogDescription>
              将 {transferringEmployee?.name} 调动到其他区队
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>当前区队</Label>
              <Input
                value={transferringEmployee?.teamName || "未分配"}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>目标区队</Label>
              <Select value={targetTeamId} onValueChange={setTargetTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择目标区队" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter((t) => t.id !== transferringEmployee?.teamId && t.status === "启用")
                    .map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmTransfer} disabled={!targetTeamId}>
              确认调动
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
