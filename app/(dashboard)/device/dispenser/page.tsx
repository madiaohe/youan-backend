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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mockDispenserDevices, deviceStatuses, type DispenserDevice } from "@/lib/mocks/data";
import { Search, RotateCcw, Plus, Pencil, RefreshCw } from "lucide-react";

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

  // 重置筛选
  const handleReset = () => {
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

  // 统计
  const onlineCount = devices.filter((d) => d.status === "在线").length;
  const totalStock = devices.reduce((sum, d) => sum + d.stockCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">自助发放柜管理</h1>
          <p className="text-muted-foreground">管理滤盒自助发放设备</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增设备
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">设备总数</div>
          <div className="text-2xl font-bold">{devices.length}</div>
        </div>
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="text-sm text-green-600">在线设备</div>
          <div className="text-2xl font-bold text-green-700">{onlineCount}</div>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm text-blue-600">总库存量</div>
          <div className="text-2xl font-bold text-blue-700">{totalStock}</div>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>设备编码/名称</Label>
            <Input
              placeholder="输入编码或名称"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              className="w-48"
            />
          </div>
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                {deviceStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>设备编码</TableHead>
              <TableHead>设备名称</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>IP地址</TableHead>
              <TableHead>库存</TableHead>
              <TableHead>发放次数</TableHead>
              <TableHead>最后心跳</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.code}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(device.status)}>{device.status}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{device.ipAddress}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{device.stockCount}/{device.capacity}</span>
                    </div>
                    <Progress value={(device.stockCount / device.capacity) * 100} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>{device.dispenseCount}</TableCell>
                <TableCell>{device.lastHeartbeat}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(device)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleSyncStock(device)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">共 {filteredDevices.length} 台设备</div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增自助发放柜</DialogTitle>
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
