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
import { toast } from "sonner";
import {
  mockDetectorDevices,
  deviceStatuses,
  mockSensorStatuses,
  mockIndicatorLights,
  mockRecycleBoxStatuses,
  type DetectorDevice,
  type SensorStatus,
  type IndicatorLight,
  type RecycleBoxStatus,
} from "@/lib/mocks/data";
import { Search, RotateCcw, Plus, Pencil, Power, PowerOff, Server, Settings, Lightbulb, Activity, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DetectorDevicePage() {
  const [devices, setDevices] = useState<DetectorDevice[]>(mockDetectorDevices);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DetectorDevice | null>(null);
  const [detailDevice, setDetailDevice] = useState<DetectorDevice | null>(null);

  // 设备详情数据
  const [sensorStatuses, setSensorStatuses] = useState<SensorStatus[]>(mockSensorStatuses);
  const [indicatorLights, setIndicatorLights] = useState<IndicatorLight[]>(mockIndicatorLights);
  const recycleBoxStatuses = mockRecycleBoxStatuses;

  // 表单状态
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    ipAddress: "",
  });

  // 筛选设备
  const filteredDevices = devices.filter((device) => {
    if (filterKeyword && !device.name.includes(filterKeyword) && !device.code.includes(filterKeyword))
      return false;
    if (filterStatus !== "all" && device.status !== filterStatus) return false;
    return true;
  });

  // 统计
  const totalCount = devices.length;
  const onlineCount = devices.filter((d) => d.status === "在线").length;
  const offlineCount = devices.filter((d) => d.status === "离线").length;
  const maintenanceCount = devices.filter((d) => d.status === "维护中").length;
  const onlineRate = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterStatus("all");
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({ code: "", name: "", location: "", ipAddress: "" });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (device: DetectorDevice) => {
    setEditingDevice(device);
    setFormData({
      code: device.code,
      name: device.name,
      location: device.location,
      ipAddress: device.ipAddress,
    });
    setIsEditDialogOpen(true);
  };

  // 打开设备详情弹窗
  const openDetailDialog = (device: DetectorDevice) => {
    setDetailDevice(device);
    setIsDetailDialogOpen(true);
  };

  // 切换指示灯状态
  const toggleLight = (light: IndicatorLight) => {
    setIndicatorLights(
      indicatorLights.map((l) =>
        l.id === light.id
          ? { ...l, status: l.status === "亮" ? "灭" : "亮", mode: "手动" as const }
          : l
      )
    );
    toast.success(`${light.lightName} 已${light.status === "亮" ? "关闭" : "开启"}`);
  };

  // 切换指示灯模式
  const toggleLightMode = (light: IndicatorLight) => {
    setIndicatorLights(
      indicatorLights.map((l) =>
        l.id === light.id
          ? { ...l, mode: l.mode === "自动" ? "手动" : "自动" }
          : l
      )
    );
    toast.success(`${light.lightName} 已切换为${light.mode === "自动" ? "手动" : "自动"}模式`);
  };

  // 新增设备
  const handleAdd = () => {
    if (!formData.code || !formData.name) {
      toast.error("请填写设备编码和名称");
      return;
    }

    const newDevice: DetectorDevice = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      location: formData.location,
      status: "离线",
      ipAddress: formData.ipAddress,
      lastHeartbeat: "-",
      detectionCount: 0,
      recycleCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setDevices([...devices, newDevice]);
    setIsAddDialogOpen(false);
    toast.success("设备添加成功");
  };

  // 编辑设备
  const handleEdit = () => {
    if (!editingDevice) return;

    setDevices(
      devices.map((d) =>
        d.id === editingDevice.id
          ? { ...d, ...formData }
          : d
      )
    );
    setIsEditDialogOpen(false);
    toast.success("设备修改成功");
  };

  // 切换设备状态
  const toggleDeviceStatus = (device: DetectorDevice) => {
    const newStatus = device.status === "在线" ? "维护中" : "在线";
    setDevices(
      devices.map((d) =>
        d.id === device.id
          ? { ...d, status: newStatus as "在线" | "离线" | "维护中" }
          : d
      )
    );
    toast.success(`设备已${newStatus === "在线" ? "启用" : "停机维护"}`);
  };

  // 获取状态颜色
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      在线: "default",
      离线: "destructive",
      维护中: "secondary",
    };
    return variants[status] || "default";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              设备总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已注册设备数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              在线设备
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {onlineRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-green-600">{onlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正常运行中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              离线设备
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {totalCount > 0 ? Math.round((offlineCount / totalCount) * 100) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-red-600">{offlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要排查问题
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              维护中
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-yellow-600">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正在维护中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="设备编码/名称"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-40"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {deviceStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
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
          新增设备
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12">设备编码</TableHead>
              <TableHead className="h-12">设备名称</TableHead>
              <TableHead className="h-12">位置</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12">IP地址</TableHead>
              <TableHead className="h-12">最后心跳</TableHead>
              <TableHead className="h-12">检测次数</TableHead>
              <TableHead className="h-12">回收次数</TableHead>
              <TableHead className="h-12 w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Server className="h-4 w-4 text-primary" />
                      </div>
                      {device.code}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{device.name}</TableCell>
                  <TableCell className="py-3">{device.location}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getStatusBadge(device.status)}>{device.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-sm">{device.ipAddress}</TableCell>
                  <TableCell className="py-3">{device.lastHeartbeat}</TableCell>
                  <TableCell className="py-3">{device.detectionCount}</TableCell>
                  <TableCell className="py-3">{device.recycleCount}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => openDetailDialog(device)} title="设备详情">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(device)} title="编辑">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDeviceStatus(device)}
                        title={device.status === "在线" ? "停机维护" : "启用设备"}
                      >
                        {device.status === "在线" ? (
                          <PowerOff className="h-3 w-3" />
                        ) : (
                          <Power className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">共 {filteredDevices.length} 台设备</div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增检测回收柜</DialogTitle>
            <DialogDescription>添加新的检测回收设备</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>设备编码</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="如：JC-C01"
                />
              </div>
              <div className="space-y-2">
                <Label>设备名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：检测柜C-01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>安装位置</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="如：机电区一楼"
              />
            </div>
            <div className="space-y-2">
              <Label>IP地址</Label>
              <Input
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="如：192.168.1.105"
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
            <DialogTitle>编辑设备 - {editingDevice?.name}</DialogTitle>
            <DialogDescription>修改设备信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>设备编码</Label>
                <Input value={formData.code} disabled />
              </div>
              <div className="space-y-2">
                <Label>设备名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>安装位置</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>IP地址</Label>
              <Input
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 设备详情弹窗 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              设备详情 - {detailDevice?.name}
            </DialogTitle>
            <DialogDescription>
              {detailDevice?.code} | {detailDevice?.location} | {detailDevice?.ipAddress}
            </DialogDescription>
          </DialogHeader>

          {detailDevice && (
            <div className="space-y-4 py-4">
              {/* 传感器状态 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">传感器状态</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-9">传感器名称</TableHead>
                        <TableHead className="h-9">类型</TableHead>
                        <TableHead className="h-9">当前值</TableHead>
                        <TableHead className="h-9">状态</TableHead>
                        <TableHead className="h-9">更新时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sensorStatuses
                        .filter((s) => s.deviceId === detailDevice.id)
                        .map((sensor) => (
                          <TableRow key={sensor.id}>
                            <TableCell className="py-2">{sensor.sensorName}</TableCell>
                            <TableCell className="py-2">{sensor.sensorType}</TableCell>
                            <TableCell className="py-2 font-mono">
                              {sensor.value} {sensor.unit}
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge
                                variant={
                                  sensor.status === "正常" ? "default" :
                                  sensor.status === "异常" ? "destructive" : "secondary"
                                }
                              >
                                {sensor.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2 text-sm text-muted-foreground">
                              {sensor.lastUpdateTime}
                            </TableCell>
                          </TableRow>
                        ))}
                      {sensorStatuses.filter((s) => s.deviceId === detailDevice.id).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            暂无传感器数据
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 指示灯控制 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <CardTitle className="text-sm">指示灯控制</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-9">指示灯名称</TableHead>
                        <TableHead className="h-9">颜色</TableHead>
                        <TableHead className="h-9">状态</TableHead>
                        <TableHead className="h-9">模式</TableHead>
                        <TableHead className="h-9 w-24">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicatorLights
                        .filter((l) => l.deviceId === detailDevice.id)
                        .map((light) => (
                          <TableRow key={light.id}>
                            <TableCell className="py-2">{light.lightName}</TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    light.color === "红" ? "bg-red-500" :
                                    light.color === "黄" ? "bg-yellow-500" : "bg-green-500"
                                  }`}
                                />
                                {light.color}
                              </div>
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge variant={light.status === "亮" ? "default" : light.status === "闪烁" ? "secondary" : "outline"}>
                                {light.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2">
                              <Badge variant={light.mode === "自动" ? "default" : "outline"}>
                                {light.mode}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLight(light)}
                                  disabled={light.mode === "自动"}
                                  title={light.status === "亮" ? "关闭" : "开启"}
                                >
                                  <Power className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleLightMode(light)}
                                  title="切换模式"
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* 回收箱状态 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">回收箱状态</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-3 p-3">
                    {recycleBoxStatuses
                      .filter((b) => b.deviceId === detailDevice.id)
                      .map((box) => {
                        const percentage = Math.round((box.currentCount / box.capacity) * 100);
                        return (
                          <div
                            key={box.id}
                            className={`p-3 rounded-lg border ${
                              box.status === "已满箱" ? "bg-red-50 border-red-200" :
                              box.status === "即将满箱" ? "bg-yellow-50 border-yellow-200" :
                              "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{box.boxName}</span>
                              <Badge
                                variant={box.status === "已满箱" ? "destructive" : box.status === "即将满箱" ? "secondary" : "default"}
                              >
                                {box.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <Progress value={percentage} className="h-2 flex-1" />
                              <span className="text-xs font-medium tabular-nums w-14 text-right">
                                {box.currentCount}/{box.capacity}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              使用率 {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    {recycleBoxStatuses.filter((b) => b.deviceId === detailDevice.id).length === 0 && (
                      <div className="col-span-2 text-center py-4 text-muted-foreground">
                        暂无回收箱数据
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
