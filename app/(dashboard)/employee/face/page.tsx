"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { mockEmployees, type Employee } from "@/lib/mocks/data";
import {
  Camera,
  Search,
  RotateCcw,
  User,
  Trash2,
  Check,
  X,
} from "lucide-react";

export default function FaceManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterFaceStatus, setFilterFaceStatus] = useState("all");
  const [filterLoginPermission, setFilterLoginPermission] = useState("all");

  // 筛选员工
  const filteredEmployees = employees.filter((emp) => {
    if (filterKeyword && !emp.employeeId.includes(filterKeyword) && !emp.name.includes(filterKeyword)) return false;
    if (filterFaceStatus === "hasFace" && !emp.hasFace) return false;
    if (filterFaceStatus === "noFace" && emp.hasFace) return false;
    if (filterLoginPermission === "enabled" && !emp.faceLoginEnabled) return false;
    if (filterLoginPermission === "disabled" && emp.faceLoginEnabled) return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterFaceStatus("all");
    setFilterLoginPermission("all");
  };

  // 打开摄像头弹窗
  const openCameraDialog = (employee: Employee) => {
    setCurrentEmployee(employee);
    setPhotoTaken(false);
    setCapturedPhoto(null);
    setIsCameraDialogOpen(true);
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
    toast.success("人脸录入成功");
  };

  // 删除人脸
  const deleteFace = (employee: Employee) => {
    setEmployees(
      employees.map((e) =>
        e.id === employee.id
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
    toast.success("人脸已删除");
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
      // Use queueMicrotask to defer camera start outside of effect body
      queueMicrotask(() => {
        startCamera();
      });
    }
    return () => {
      stopCamera();
    };
  }, [isCameraDialogOpen, photoTaken, startCamera, stopCamera]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">人脸识别管理</h1>
          <p className="text-muted-foreground">管理员工人脸信息及登录权限</p>
        </div>
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
            <Label>人脸状态</Label>
            <Select value={filterFaceStatus} onValueChange={setFilterFaceStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="hasFace">已录入</SelectItem>
                <SelectItem value="noFace">未录入</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>登录权限</Label>
            <Select value={filterLoginPermission} onValueChange={setFilterLoginPermission}>
              <SelectTrigger>
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="enabled">允许</SelectItem>
                <SelectItem value="disabled">禁止</SelectItem>
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
              <TableHead>工号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>所属区队</TableHead>
              <TableHead>人脸照片</TableHead>
              <TableHead>人脸状态</TableHead>
              <TableHead>登录权限</TableHead>
              <TableHead>录入时间</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.employeeId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.teamName}</TableCell>
                <TableCell>
                  {employee.hasFace ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={employee.facePhoto} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={employee.hasFace ? "default" : "secondary"}>
                    {employee.hasFace ? "已录入" : "未录入"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {employee.hasFace ? (
                    <Switch
                      checked={employee.faceLoginEnabled}
                      onCheckedChange={() => toggleLoginPermission(employee)}
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>{employee.faceCreatedAt || "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCameraDialog(employee)}
                    >
                      <Camera className="mr-1 h-3 w-3" />
                      拍照
                    </Button>
                    {employee.hasFace && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFace(employee)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

      {/* 人脸录入弹窗 */}
      <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              人脸录入 - {currentEmployee?.name} ({currentEmployee?.employeeId})
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {!photoTaken ? (
              <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground text-center">
                  请将面部置于框内，保持光线充足
                </p>
              </div>
            ) : (
              <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground text-center">
                  照片已捕捉，是否确认使用？
                </p>
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
    </div>
  );
}
