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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  mockWaitingDispenses,
  mockEmployees,
  dispenseDevices,
  type WaitingDispense,
} from "@/lib/mocks/data";
import { Search, RotateCcw, UserPlus, Download } from "lucide-react";

export default function WaitingDispensePage() {
  const [waitingDispenses, setWaitingDispenses] = useState<WaitingDispense[]>(mockWaitingDispenses);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 预约弹窗
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitingDispense | null>(null);
  const [reserveEmployeeId, setReserveEmployeeId] = useState("");

  // 筛选数据
  const filteredData = waitingDispenses.filter((item) => {
    if (filterKeyword && !item.filterBoxCode.includes(filterKeyword) && !item.batchNo.includes(filterKeyword))
      return false;
    if (filterDevice !== "all" && item.deviceId !== filterDevice) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterDevice("all");
    setFilterStatus("all");
  };

  // 搜索
  const handleSearch = () => {
    toast.success(`找到 ${filteredData.length} 条待领用数据`);
  };

  // 打开预约弹窗
  const openReserveDialog = (item: WaitingDispense) => {
    setSelectedItem(item);
    setReserveEmployeeId("");
    setIsReserveDialogOpen(true);
  };

  // 取消预约
  const handleCancelReserve = (item: WaitingDispense) => {
    setWaitingDispenses(
      waitingDispenses.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: "待领用" as const,
              reservedEmployeeId: undefined,
              reservedEmployeeName: undefined,
              reservedTime: undefined,
            }
          : d
      )
    );
    toast.success("已取消预约");
  };

  // 确认预约
  const handleReserve = () => {
    if (!selectedItem || !reserveEmployeeId) {
      toast.error("请选择预约员工");
      return;
    }

    const employee = mockEmployees.find((e) => e.id === reserveEmployeeId);
    if (!employee) {
      toast.error("员工不存在");
      return;
    }

    setWaitingDispenses(
      waitingDispenses.map((d) =>
        d.id === selectedItem.id
          ? {
              ...d,
              status: "已预约" as const,
              reservedEmployeeId: employee.id,
              reservedEmployeeName: employee.name,
              reservedTime: new Date().toISOString().replace("T", " ").slice(0, 19),
            }
          : d
      )
    );

    setIsReserveDialogOpen(false);
    toast.success(`已为 ${employee.name} 预约滤盒`);
  };

  // 导出数据
  const handleExport = () => {
    toast.success(`已导出 ${filteredData.length} 条待领用数据`);
  };

  // 统计
  const availableCount = filteredData.filter((d) => d.status === "待领用").length;
  const reservedCount = filteredData.filter((d) => d.status === "已预约").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">待领用滤盒数据</h1>
          <p className="text-muted-foreground">管理已入库待发放的滤盒数据</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">总待领用数</div>
          <div className="text-2xl font-bold">{filteredData.length}</div>
        </div>
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="text-sm text-green-600">可领用</div>
          <div className="text-2xl font-bold text-green-700">{availableCount}</div>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm text-blue-600">已预约</div>
          <div className="text-2xl font-bold text-blue-700">{reservedCount}</div>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label>滤盒编号/批次号</Label>
            <Input
              placeholder="输入编号或批次号"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>发放设备</Label>
            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger>
                <SelectValue placeholder="全部设备" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部设备</SelectItem>
                {dispenseDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
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
                <SelectItem value="待领用">待领用</SelectItem>
                <SelectItem value="已预约">已预约</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 col-span-2">
            <Button onClick={handleSearch}>
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
              <TableHead>滤盒编号</TableHead>
              <TableHead>批次号</TableHead>
              <TableHead>入库时间</TableHead>
              <TableHead>存放设备</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>预约员工</TableHead>
              <TableHead>预约时间</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.filterBoxCode}</TableCell>
                  <TableCell>{item.batchNo}</TableCell>
                  <TableCell>{item.storageTime}</TableCell>
                  <TableCell>{item.deviceName}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "待领用" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.reservedEmployeeName ? (
                      <span>
                        {item.reservedEmployeeName} ({item.reservedEmployeeId})
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{item.reservedTime || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {item.status === "待领用" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReserveDialog(item)}
                        >
                          <UserPlus className="mr-1 h-3 w-3" />
                          预约
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelReserve(item)}
                        >
                          取消预约
                        </Button>
                      )}
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
        共 {filteredData.length} 条记录
      </div>

      {/* 预约弹窗 */}
      <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>预约滤盒 - {selectedItem?.filterBoxCode}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>选择员工</Label>
              <Select value={reserveEmployeeId} onValueChange={setReserveEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择员工" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter((e) => e.status === "启用")
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.employeeId}) - {employee.teamName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedItem && (
              <div className="text-sm text-muted-foreground">
                <p>滤盒编号：{selectedItem.filterBoxCode}</p>
                <p>存放位置：{selectedItem.deviceName}</p>
                <p>批次号：{selectedItem.batchNo}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReserveDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleReserve}>确认预约</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
