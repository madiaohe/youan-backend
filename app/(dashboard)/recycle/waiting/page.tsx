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
import { Checkbox } from "@/components/ui/checkbox";
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
  mockWaitingDispenses,
  mockEmployees,
  dispenseDevices,
  type WaitingDispense,
} from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Minus,
  Trash2,
  Save,
} from "lucide-react";
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

export default function WaitingDispensePage() {
  const [waitingDispenses, setWaitingDispenses] = useState<WaitingDispense[]>(mockWaitingDispenses);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 预约弹窗
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WaitingDispense | null>(null);
  const [reserveEmployeeId, setReserveEmployeeId] = useState("");

  // 新增/删除弹窗
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    filterBoxCode: "",
    batchNo: "",
    deviceId: "",
    deviceName: "",
    count: 1,
  });

  // 筛选数据
  const filteredData = waitingDispenses.filter((item) => {
    if (filterKeyword && !item.filterBoxCode.includes(filterKeyword) && !item.batchNo.includes(filterKeyword))
      return false;
    if (filterDevice !== "all" && item.deviceId !== filterDevice) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // 统计
  const totalCount = filteredData.length;
  const availableCount = filteredData.filter((d) => d.status === "待领用").length;
  const reservedCount = filteredData.filter((d) => d.status === "已预约").length;
  const availableRate = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterDevice("all");
    setFilterStatus("all");
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedData.map((item) => item.id));
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
    const exportCount = selectedIds.length > 0 ? selectedIds.length : filteredData.length;
    toast.success(`已导出 ${exportCount} 条待领用数据`);
    setSelectedIds([]);
  };

  // 打开新增弹窗
  const openAddDialog = () => {
    setAddForm({
      filterBoxCode: "",
      batchNo: "",
      deviceId: dispenseDevices[0]?.id || "",
      deviceName: dispenseDevices[0]?.name || "",
      count: 1,
    });
    setIsAddDialogOpen(true);
  };

  // 新增滤盒
  const handleAdd = () => {
    if (!addForm.filterBoxCode || !addForm.batchNo || !addForm.deviceId) {
      toast.error("请填写完整信息");
      return;
    }

    const device = dispenseDevices.find((d) => d.id === addForm.deviceId);
    const newItems: WaitingDispense[] = [];

    for (let i = 0; i < addForm.count; i++) {
      const suffix = addForm.count > 1 ? `-${String(i + 1).padStart(3, "0")}` : "";
      newItems.push({
        id: Date.now().toString() + i,
        filterBoxCode: addForm.filterBoxCode + suffix,
        status: "待领用",
        batchNo: addForm.batchNo,
        storageTime: new Date().toISOString().replace("T", " ").slice(0, 19),
        deviceId: addForm.deviceId,
        deviceName: device?.name || "",
      });
    }

    setWaitingDispenses([...newItems, ...waitingDispenses]);
    setIsAddDialogOpen(false);
    toast.success(`已新增 ${addForm.count} 条待领用滤盒记录`);
  };

  // 打开删除确认弹窗
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  // 删除滤盒记录
  const handleDelete = () => {
    if (deletingId) {
      setWaitingDispenses(waitingDispenses.filter((d) => d.id !== deletingId));
      setIsDeleteDialogOpen(false);
      toast.success("已删除滤盒记录");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("请选择要删除的记录");
      return;
    }
    setWaitingDispenses(waitingDispenses.filter((d) => !selectedIds.includes(d.id)));
    setSelectedIds([]);
    toast.success("已批量删除选中记录");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总待领用数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的待领用总数
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              可领用
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {availableRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-success">{availableCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              可直接领用
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已预约
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {totalCount > 0 ? 100 - availableRate : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-primary">{reservedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              已被预约等待领取
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="滤盒编号/批次号"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-36"
          />
          <Select value={filterDevice} onValueChange={setFilterDevice}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="设备" />
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="待领用">待领用</SelectItem>
              <SelectItem value="已预约">已预约</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilter}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            新增滤盒
          </Button>
          {selectedIds.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleBatchDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              删除({selectedIds.length})
            </Button>
          )}
          <Button size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 h-12 pl-4">
                <Checkbox
                  checked={paginatedData.length > 0 && selectedIds.length === paginatedData.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">滤盒编号</TableHead>
              <TableHead className="h-12">批次号</TableHead>
              <TableHead className="h-12">存放设备</TableHead>
              <TableHead className="h-12">入库时间</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12">预约员工</TableHead>
              <TableHead className="h-12">预约时间</TableHead>
              <TableHead className="h-12 w-28">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id} data-state={selectedIds.includes(item.id) && "selected"}>
                  <TableCell className="py-3 pl-4">
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onCheckedChange={(checked) => handleSelect(item.id, checked as boolean)}
                      aria-label="选择行"
                    />
                  </TableCell>
                  <TableCell className="py-3 font-medium">{item.filterBoxCode}</TableCell>
                  <TableCell className="py-3">{item.batchNo}</TableCell>
                  <TableCell className="py-3">{item.deviceName}</TableCell>
                  <TableCell className="py-3">{item.storageTime}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={item.status === "待领用" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {item.reservedEmployeeName ? (
                      <span>
                        {item.reservedEmployeeName} ({item.reservedEmployeeId})
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="py-3">{item.reservedTime || "-"}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      {item.status === "待领用" ? (
                        <Button variant="outline" size="sm" onClick={() => openReserveDialog(item)} title="预约">
                          <UserPlus className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleCancelReserve(item)}>
                          取消
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(item.id)} title="删除">
                        <Trash2 className="h-3 w-3" />
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

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {selectedIds.length > 0 && <span>已选择 {selectedIds.length} 项，</span>}
          共 {filteredData.length} 条记录
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

      {/* 预约弹窗 */}
      <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>预约滤盒 - {selectedItem?.filterBoxCode}</DialogTitle>
            <DialogDescription>为员工预约此滤盒</DialogDescription>
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

      {/* 新增滤盒弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增待领用滤盒</DialogTitle>
            <DialogDescription>手动添加待领用滤盒记录（如人工补发）</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>滤盒编号</Label>
                <Input
                  placeholder="如：FB20240611001"
                  value={addForm.filterBoxCode}
                  onChange={(e) => setAddForm({ ...addForm, filterBoxCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>批次号</Label>
                <Input
                  placeholder="如：B20240611001"
                  value={addForm.batchNo}
                  onChange={(e) => setAddForm({ ...addForm, batchNo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>存放设备</Label>
                <Select
                  value={addForm.deviceId}
                  onValueChange={(v) => {
                    const device = dispenseDevices.find((d) => d.id === v);
                    setAddForm({ ...addForm, deviceId: v, deviceName: device?.name || "" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择设备" />
                  </SelectTrigger>
                  <SelectContent>
                    {dispenseDevices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>新增数量</Label>
                <Input
                  type="number"
                  min={1}
                  value={addForm.count}
                  onChange={(e) => setAddForm({ ...addForm, count: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium">提示信息</p>
              <ul className="mt-1 space-y-0.5">
                <li>• 如新增数量大于1，滤盒编号将自动添加序号后缀</li>
                <li>• 例如：编号 FB20240611001，数量3 → FB20240611001-001, -002, -003</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button onClick={handleAdd}>
              <Save className="mr-2 h-4 w-4" />
              确认新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此滤盒记录吗？此操作不可撤销。
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
