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
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { mockWMSSyncRecords, type WMSSyncRecord } from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  Download,
  Upload,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  ArrowLeftRight,
  Save,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function WMSPage() {
  const [syncRecords, setSyncRecords] = useState<WMSSyncRecord[]>(mockWMSSyncRecords);
  const [isSyncing, setIsSyncing] = useState(false);

  // 手动退库弹窗
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [returnForm, setReturnForm] = useState({
    filterBoxCode: "",
    count: 1,
    reason: "",
  });

  // 筛选条件
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 筛选记录
  const filteredRecords = syncRecords.filter((record) => {
    if (filterType !== "all" && record.syncType !== filterType) return false;
    if (filterStatus !== "all" && record.status !== filterStatus) return false;
    if (filterStartDate) {
      const recordDate = new Date(record.syncTime.split(" ")[0]);
      if (recordDate < filterStartDate) return false;
    }
    if (filterEndDate) {
      const recordDate = new Date(record.syncTime.split(" ")[0]);
      const endOfDay = new Date(filterEndDate);
      endOfDay.setHours(23, 59, 59);
      if (recordDate > endOfDay) return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // 统计
  const totalCount = syncRecords.length;
  const successCount = syncRecords.filter((r) => r.status === "成功").length;
  const failCount = syncRecords.filter((r) => r.status === "失败").length;
  const totalItems = syncRecords.reduce((sum, r) => sum + r.itemCount, 0);
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedRecords.map((r) => r.id));
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

  // 手动同步
  const handleSync = async (type: string) => {
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast.success(`${type}同步成功`);
  };

  // 手动退库
  const handleReturn = () => {
    if (!returnForm.filterBoxCode || !returnForm.reason) {
      toast.error("请填写滤盒编号和退库原因");
      return;
    }

    // 添加退库记录
    const newRecord: WMSSyncRecord = {
      id: Date.now().toString(),
      syncType: "出库同步",
      syncTime: new Date().toISOString().replace("T", " ").slice(0, 19),
      status: "成功",
      itemCount: returnForm.count,
    };

    setSyncRecords([newRecord, ...syncRecords]);
    setIsReturnDialogOpen(false);
    toast.success(`已成功退库 ${returnForm.count} 个滤盒`);
  };

  // 获取状态颜色
  const getStatusBadge = (status: string) => {
    return status === "成功" ? "default" : "destructive";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 同步操作卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-success/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Download className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle className="text-base">入库同步</CardTitle>
                <p className="text-xs text-muted-foreground">从WMS同步入库数据</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="sm"
              onClick={() => handleSync("入库")}
              disabled={isSyncing}
            >
              {isSyncing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSyncing ? "同步中..." : "执行同步"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">出库同步</CardTitle>
                <p className="text-xs text-muted-foreground">向WMS推送出库数据</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="sm"
              onClick={() => handleSync("出库")}
              disabled={isSyncing}
            >
              {isSyncing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSyncing ? "同步中..." : "执行同步"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <Database className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <CardTitle className="text-base">库存同步</CardTitle>
                <p className="text-xs text-muted-foreground">同步双方库存数据</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="sm"
              onClick={() => handleSync("库存")}
              disabled={isSyncing}
            >
              {isSyncing ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSyncing ? "同步中..." : "执行同步"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-warning/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <ArrowLeftRight className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-base">手动退库</CardTitle>
                <p className="text-xs text-muted-foreground">管理员办理退库操作</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              onClick={() => setIsReturnDialogOpen(true)}
            >
              办理退库
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KPI 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              同步总次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              历史同步总次数
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              成功次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {successRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-success">{successCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              同步成功记录
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              失败次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {totalCount > 0 ? 100 - successRate : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-destructive">{failCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要排查问题
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              同步数据量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-primary">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计同步条目
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="入库同步">入库同步</SelectItem>
              <SelectItem value="出库同步">出库同步</SelectItem>
              <SelectItem value="库存同步">库存同步</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="成功">成功</SelectItem>
              <SelectItem value="失败">失败</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker
            date={filterStartDate}
            onDateChange={setFilterStartDate}
            placeholder="开始日期"
            className="w-32"
          />
          <span className="text-muted-foreground text-sm">至</span>
          <DatePicker
            date={filterEndDate}
            onDateChange={setFilterEndDate}
            placeholder="结束日期"
            className="w-32"
          />
          <Button size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetFilter}>
            <RotateCcw className="h-4 w-4" />
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
                  checked={paginatedRecords.length > 0 && selectedIds.length === paginatedRecords.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">同步类型</TableHead>
              <TableHead className="h-12">同步时间</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12">数据量</TableHead>
              <TableHead className="h-12">错误信息</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <TableRow key={record.id} data-state={selectedIds.includes(record.id) && "selected"}>
                  <TableCell className="py-3 pl-4">
                    <Checkbox
                      checked={selectedIds.includes(record.id)}
                      onCheckedChange={(checked) => handleSelect(record.id, checked as boolean)}
                      aria-label="选择行"
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline">{record.syncType}</Badge>
                  </TableCell>
                  <TableCell className="py-3">{record.syncTime}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getStatusBadge(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell className="py-3">{record.itemCount}</TableCell>
                  <TableCell className="py-3 text-destructive">{record.errorMessage || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
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
          共 {filteredRecords.length} 条记录
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

      {/* 手动退库弹窗 */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>手动退库</DialogTitle>
            <DialogDescription>管理员手动办理滤盒退库操作</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>滤盒编号</Label>
                <Input
                  placeholder="如：FB20240601001"
                  value={returnForm.filterBoxCode}
                  onChange={(e) => setReturnForm({ ...returnForm, filterBoxCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>退库数量</Label>
                <Input
                  type="number"
                  min={1}
                  value={returnForm.count}
                  onChange={(e) => setReturnForm({ ...returnForm, count: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>退库原因 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入退库原因"
                value={returnForm.reason}
                onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
              />
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium">提示信息</p>
              <ul className="mt-1 space-y-0.5">
                <li>• 退库操作将同步到WMS系统</li>
                <li>• 退库记录将被保存到操作日志</li>
                <li>• 请确保滤盒编号正确</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)}>取消</Button>
            <Button onClick={handleReturn}>
              <Save className="mr-2 h-4 w-4" />
              确认退库
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
