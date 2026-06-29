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
import { toast } from "sonner";
import { mockPendingRecycles, mockTeams, type PendingRecycle } from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Bell,
  Pencil,
  Save,
} from "lucide-react";

export default function PendingRecyclePage() {
  const [pendingRecycles, setPendingRecycles] = useState<PendingRecycle[]>(mockPendingRecycles);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResult, setFilterResult] = useState("all");

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 强制回收确认
  const [isForceDialogOpen, setIsForceDialogOpen] = useState(false);
  const [forceRecycleId, setForceRecycleId] = useState<string | null>(null);

  // 手动调整弹窗
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<PendingRecycle | null>(null);
  const [adjustForm, setAdjustForm] = useState({
    usageDays: 0,
    expireDate: "",
    reason: "",
  });

  // 筛选数据
  const filteredData = pendingRecycles.filter((item) => {
    if (
      filterKeyword &&
      !item.filterBoxCode.includes(filterKeyword) &&
      !item.employeeName.includes(filterKeyword) &&
      !item.employeeId.includes(filterKeyword)
    )
      return false;
    if (filterTeam !== "all" && item.teamName !== mockTeams.find((t) => t.id === filterTeam)?.name)
      return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterResult !== "all" && item.lastDetectionResult !== filterResult) return false;
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // 统计
  const totalCount = filteredData.length;
  const pendingCount = filteredData.filter((r) => r.status === "待回收").length;
  const overdueCount = filteredData.filter((r) => r.status === "已超期").length;
  const overdueRate = totalCount > 0 ? Math.round((overdueCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterStatus("all");
    setFilterResult("all");
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

  // 发送回收提醒
  const handleSendReminder = (item: PendingRecycle) => {
    toast.success(`已向 ${item.employeeName} 发送回收提醒`);
  };

  // 批量发送提醒
  const handleBatchReminder = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredData.length;
    toast.success(`已向 ${count} 人发送回收提醒`);
    setSelectedIds([]);
  };

  // 打开强制回收确认
  const openForceDialog = (id: string) => {
    setForceRecycleId(id);
    setIsForceDialogOpen(true);
  };

  // 强制回收
  const handleForceRecycle = () => {
    if (forceRecycleId) {
      setPendingRecycles(pendingRecycles.filter((item) => item.id !== forceRecycleId));
      setIsForceDialogOpen(false);
      toast.success("已强制回收滤盒");
    }
  };

  // 打开调整弹窗
  const openAdjustDialog = (item: PendingRecycle) => {
    setAdjustingItem(item);
    setAdjustForm({
      usageDays: item.usageDays,
      expireDate: item.expireDate,
      reason: "",
    });
    setIsAdjustDialogOpen(true);
  };

  // 保存调整
  const handleAdjustSave = () => {
    if (!adjustingItem) return;
    if (!adjustForm.reason.trim()) {
      toast.error("请填写调整原因");
      return;
    }

    setPendingRecycles(
      pendingRecycles.map((item) =>
        item.id === adjustingItem.id
          ? {
              ...item,
              usageDays: adjustForm.usageDays,
              expireDate: adjustForm.expireDate,
              status: new Date(adjustForm.expireDate) < new Date() ? "已超期" : "待回收",
            }
          : item
      )
    );
    setIsAdjustDialogOpen(false);
    toast.success("调整成功，已记录调整原因");
  };

  // 导出数据
  const handleExport = () => {
    const exportCount = selectedIds.length > 0 ? selectedIds.length : filteredData.length;
    toast.success(`已导出 ${exportCount} 条待回收数据`);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总待回收数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的待回收总数
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              待回收
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-warning">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正常待回收状态
            </p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已超期
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {overdueRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-destructive">{overdueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要紧急处理
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="滤盒编号/员工"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            className="w-36"
          />
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="区队" />
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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="待回收">待回收</SelectItem>
              <SelectItem value="已超期">已超期</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="合格">合格</SelectItem>
              <SelectItem value="不合格">不合格</SelectItem>
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
          <Button variant="outline" size="sm" onClick={handleBatchReminder}>
            <Bell className="mr-2 h-4 w-4" />
            发送提醒{selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </Button>
          <Button size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出{selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
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
              <TableHead className="h-12">员工姓名</TableHead>
              <TableHead className="h-12">区队</TableHead>
              <TableHead className="h-12">最后检测</TableHead>
              <TableHead className="h-12">结果</TableHead>
              <TableHead className="h-12">使用天数</TableHead>
              <TableHead className="h-12">到期日期</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12 w-32">操作</TableHead>
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
                  <TableCell className="py-3">{item.employeeName}</TableCell>
                  <TableCell className="py-3">{item.teamName}</TableCell>
                  <TableCell className="py-3">{item.lastDetectionTime}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={item.lastDetectionResult === "合格" ? "default" : "destructive"}>
                      {item.lastDetectionResult}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">{item.usageDays} 天</TableCell>
                  <TableCell className="py-3">{item.expireDate}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={item.status === "已超期" ? "destructive" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => openAdjustDialog(item)} title="手动调整">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSendReminder(item)} title="发送提醒">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openForceDialog(item.id)}>
                        强制回收
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
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

      {/* 手动调整弹窗 */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>手动调整 - {adjustingItem?.filterBoxCode}</DialogTitle>
            <DialogDescription>
              修正滤盒的使用天数和到期日期，用于管理员手动修正数据
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>员工姓名</Label>
                <Input value={adjustingItem?.employeeName || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>区队</Label>
                <Input value={adjustingItem?.teamName || ""} disabled />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>使用天数</Label>
                <Input
                  type="number"
                  value={adjustForm.usageDays}
                  onChange={(e) => setAdjustForm({ ...adjustForm, usageDays: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>到期日期</Label>
                <Input
                  type="date"
                  value={adjustForm.expireDate}
                  onChange={(e) => setAdjustForm({ ...adjustForm, expireDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>调整原因 <span className="text-destructive">*</span></Label>
              <Input
                placeholder="请输入调整原因（必填）"
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
              />
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium">提示信息</p>
              <ul className="mt-1 space-y-0.5">
                <li>• 调整操作将被记录到操作日志</li>
                <li>• 如到期日期早于今天，状态将自动变为"已超期"</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>取消</Button>
            <Button onClick={handleAdjustSave}>
              <Save className="mr-2 h-4 w-4" />
              保存调整
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 强制回收确认弹窗 */}
      <AlertDialog open={isForceDialogOpen} onOpenChange={setIsForceDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认强制回收</AlertDialogTitle>
            <AlertDialogDescription>
              强制回收后，该滤盒将从员工名下移除并进入待领用池。此操作不可撤销，确定要继续吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceRecycle}>确认回收</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
