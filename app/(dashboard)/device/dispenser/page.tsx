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
import { Progress } from "@/components/ui/progress";
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
import { mockDispenserDevices, deviceStatuses, type DispenserDevice } from "@/lib/mocks/data";
import { Search, RotateCcw, Plus, Pencil, RefreshCw, Package } from "lucide-react";

export default function DispenserDevicePage() {
  const [devices, setDevices] = useState<DispenserDevice[]>(mockDispenserDevices);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DispenserDevice | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    ipAddress: "",
    capacity: 100,
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
  const totalStock = devices.reduce((sum, d) => sum + d.stockCount, 0);
  const totalCapacity = devices.reduce((sum, d) => sum + d.capacity, 0);
  const stockRate = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterStatus("all");
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({ code: "", name: "", location: "", ipAddress: "", capacity: 100 });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (device: DispenserDevice) => {
    setEditingDevice(device);
    setFormData({
      code: device.code,
      name: device.name,
      location: device.location,
      ipAddress: device.ipAddress,
      capacity: device.capacity,
    });
    setIsEditDialogOpen(true);
  };

  // 新增设备
  const handleAdd = () => {
    if (!formData.code || !formData.name) {
      toast.error("请填写设备编码和名称");
      return;
    }

    const newDevice: DispenserDevice = {
      id: Date.now().toString(),
      code: formData.code,
      name: formData.name,
      location: formData.location,
      status: "离线",
      ipAddress: formData.ipAddress,
      lastHeartbeat: "-",
      stockCount: 0,
      capacity: formData.capacity,
      dispenseCount: 0,
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

  // 同步库存
  const handleSyncStock = (device: DispenserDevice) => {
    setDevices(
      devices.map((d) =>
        d.id === device.id
          ? { ...d, lastHeartbeat: new Date().toISOString().replace("T", " ").slice(0, 19) }
          : d
      )
    );
    toast.success(`已同步 ${device.name} 库存数据`);
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              设备总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已注册发放柜数量
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              在线设备
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-success">{onlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正常运行中
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总库存量
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {stockRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-primary">{totalStock}</div>
            <p className="text-xs text-muted-foreground mt-1">
              当前库存总量
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总容量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">{totalCapacity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              设备总容量
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
              <TableHead className="h-12">库存</TableHead>
              <TableHead className="h-12">发放次数</TableHead>
              <TableHead className="h-12">最后心跳</TableHead>
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
                        <Package className="h-4 w-4 text-primary" />
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
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{device.stockCount}/{device.capacity}</span>
                      </div>
                      <Progress value={(device.stockCount / device.capacity) * 100} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{device.dispenseCount}</TableCell>
                  <TableCell className="py-3">{device.lastHeartbeat}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(device)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSyncStock(device)}>
                        <RefreshCw className="h-3 w-3" />
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
            <DialogTitle>新增自助发放柜</DialogTitle>
            <DialogDescription>添加新的发放设备</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>设备编码</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="如：FF-C01"
                />
              </div>
              <div className="space-y-2">
                <Label>设备名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如：发放柜C-01"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IP地址</Label>
                <Input
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  placeholder="如：192.168.1.115"
                />
              </div>
              <div className="space-y-2">
                <Label>容量</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                />
              </div>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IP地址</Label>
                <Input
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>容量</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
