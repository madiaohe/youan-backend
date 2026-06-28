"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Camera,
  RotateCcw,
  User,
  Trash2,
  Check,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  GripVertical,
  RefreshCw,
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
  employee,
  isSelected,
  onSelect,
  onCapture,
  onDelete,
  onTogglePermission,
}: {
  employee: Employee;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onCapture: () => void;
  onDelete: () => void;
  onTogglePermission: () => void;
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
      <TableCell className="py-3">{employee.name}</TableCell>
      <TableCell className="py-3">{employee.teamName}</TableCell>
      <TableCell className="py-3">
        {employee.hasFace ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee.facePhoto} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell className="py-3">
        <Badge variant={employee.hasFace ? "default" : "secondary"}>
          {employee.hasFace ? "已录入" : "未录入"}
        </Badge>
      </TableCell>
      <TableCell className="py-3">
        {employee.hasFace ? (
          <Switch
            checked={employee.faceLoginEnabled}
            onCheckedChange={onTogglePermission}
          />
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="py-3">{employee.faceCreatedAt || "-"}</TableCell>
      <TableCell className="w-12 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">操作</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={onCapture}>
              <Camera className="mr-2 h-4 w-4" />
              {employee.hasFace ? "更新" : "录入"}
            </DropdownMenuItem>
            {employee.hasFace && (
              <>
                <DropdownMenuItem onClick={onTogglePermission}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {employee.faceLoginEnabled ? "禁止登录" : "允许登录"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function FaceManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterFaceStatus, setFilterFaceStatus] = useState("all");
  const [filterLoginPermission, setFilterLoginPermission] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
    if (filterFaceStatus === "hasFace" && !emp.hasFace) return false;
    if (filterFaceStatus === "noFace" && emp.hasFace) return false;
    if (filterLoginPermission === "enabled" && !emp.faceLoginEnabled) return false;
    if (filterLoginPermission === "disabled" && emp.faceLoginEnabled) return false;
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
    setFilterFaceStatus("all");
    setFilterLoginPermission("all");
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

  // 打开摄像头弹窗
  const openCameraDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setPhotoTaken(false);
    setCapturedPhoto(null);
    setIsCameraDialogOpen(true);
  };

  // 打开删除弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 启动摄像头
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      toast.error("无法访问摄像头，请检查权限设置");
    }
  }, []);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // 拍照
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(photoData);
        setPhotoTaken(true);
        stopCamera();
      }
    }
  };

  // 重拍
  const retakePhoto = () => {
    setPhotoTaken(false);
    setCapturedPhoto(null);
    startCamera();
  };

  // 确认保存人脸
  const saveFace = () => {
    if (!currentEmployee) return;

    setEmployees(
      employees.map((e) =>
        e.id === currentEmployee.id
          ? {
              ...e,
              hasFace: true,
              facePhoto: capturedPhoto || undefined,
              faceLoginEnabled: true,
              faceCreatedAt: new Date().toISOString().split("T")[0],
            }
          : e
      )
    );

    setIsCameraDialogOpen(false);
    toast.success(currentEmployee.hasFace ? "人脸更新成功" : "人脸录入成功");
  };

  // 删除人脸
  const handleDelete = () => {
    if (!deletingId) return;

    setEmployees(
      employees.map((e) =>
        e.id === deletingId
          ? {
              ...e,
              hasFace: false,
              facePhoto: undefined,
              faceLoginEnabled: false,
              faceCreatedAt: undefined,
            }
          : e
      )
    );
    setIsDeleteDialogOpen(false);
    toast.success("人脸已删除");
  };

  // 批量删除人脸
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除人脸的员工");
      return;
    }

    const hasNoFace = selectedIds.some((id) => {
      const emp = employees.find((e) => e.id === id);
      return emp && !emp.hasFace;
    });

    if (hasNoFace) {
      toast.error("所选员工中有人未录入人脸");
      return;
    }

    setEmployees(
      employees.map((e) =>
        selectedIds.includes(e.id)
          ? {
              ...e,
              hasFace: false,
              facePhoto: undefined,
              faceLoginEnabled: false,
              faceCreatedAt: undefined,
            }
          : e
      )
    );
    setSelectedIds([]);
    toast.success(`已删除 ${selectedIds.length} 名员工的人脸数据`);
  };

  // 切换登录权限
  const toggleLoginPermission = (employee: Employee) => {
    if (!employee.hasFace) {
      toast.error("请先录入人脸");
      return;
    }

    setEmployees(
      employees.map((e) =>
        e.id === employee.id
          ? { ...e, faceLoginEnabled: !e.faceLoginEnabled }
          : e
      )
    );

    toast.success(
      employee.faceLoginEnabled ? "已禁止人脸登录" : "已允许人脸登录"
    );
  };

  // 弹窗打开时启动摄像头
  useEffect(() => {
    if (isCameraDialogOpen && !photoTaken) {
      queueMicrotask(() => {
        startCamera();
      });
    }
    return () => {
      stopCamera();
    };
  }, [isCameraDialogOpen, photoTaken, startCamera, stopCamera]);

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
            value={filterFaceStatus}
            onValueChange={(value) => {
              setFilterFaceStatus(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="人脸状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="hasFace">已录入</SelectItem>
              <SelectItem value="noFace">未录入</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterLoginPermission}
            onValueChange={(value) => {
              setFilterLoginPermission(value);
              setPageIndex(0);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="登录权限" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="enabled">允许</SelectItem>
              <SelectItem value="disabled">禁止</SelectItem>
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
              删除人脸
            </Button>
          )}
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
                <TableHead className="h-12">人脸照片</TableHead>
                <TableHead className="h-12">人脸状态</TableHead>
                <TableHead className="h-12">登录权限</TableHead>
                <TableHead className="h-12">录入时间</TableHead>
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
                      onCapture={() => openCameraDialog(employee)}
                      onDelete={() => openDeleteDialog(employee.id)}
                      onTogglePermission={() => toggleLoginPermission(employee)}
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

      {/* 人脸录入/更新弹窗 */}
      <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEmployee?.hasFace ? "更新人脸" : "录入人脸"} - {currentEmployee?.name} ({currentEmployee?.employeeId})
            </DialogTitle>
            <DialogDescription>
              请将面部置于框内，保持光线充足
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!photoTaken ? (
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* 人脸框提示 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-56 border-2 border-dashed border-white/50 rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                {capturedPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={capturedPhoto}
                    alt="Captured face"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <DialogFooter>
            {!photoTaken ? (
              <>
                <Button variant="outline" onClick={() => setIsCameraDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  取消
                </Button>
                <Button onClick={takePhoto} disabled={!cameraActive}>
                  <Camera className="mr-2 h-4 w-4" />
                  拍照
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={retakePhoto}>
                  重拍
                </Button>
                <Button onClick={saveFace}>
                  <Check className="mr-2 h-4 w-4" />
                  确认保存
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除人脸</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除该员工的人脸数据吗？删除后需要重新录入。
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
