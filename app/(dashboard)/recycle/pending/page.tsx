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
import { Search, RotateCcw, RefreshCw, Download } from "lucide-react";

export default function PendingRecyclePage() {
  const [pendingRecycles, setPendingRecycles] = useState<PendingRecycle[]>(mockPendingRecycles);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterResult, setFilterResult] = useState("all");

  // 强制回收确认
  const [isForceDialogOpen, setIsForceDialogOpen] = useState(false);
  const [forceRecycleId, setForceRecycleId] = useState<string | null>(null);

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

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterStatus("all");
    setFilterResult("all");
  };

  // 搜索
  const handleSearch = () => {
    toast.success(`找到 ${filteredData.length} 条待回收记录`);
  };

  // 发送回收提醒
  const handleSendReminder = (item: PendingRecycle) => {
    toast.success(`已向 ${item.employeeName} 发送回收提醒`);
  };

  // 批量发送提醒
  const handleBatchReminder = () => {
    toast.success(`已向 ${filteredData.length} 人发送回收提醒`);
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

  // 导出数据
  const handleExport = () => {
    toast.success(`已导出 ${filteredData.length} 条待回收数据`);
  };

  // 统计
  const pendingCount = filteredData.filter((r) => r.status === "待回收").length;
  const overdueCount = filteredData.filter((r) => r.status === "已超期").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">待回收滤盒数据</h1>
          <p className="text-muted-foreground">管理需要回收的滤盒数据</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBatchReminder}>
            批量发送提醒
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">总待回收数</div>
          <div className="text-2xl font-bold">{filteredData.length}</div>
        </div>
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <div className="text-sm text-yellow-600">待回收</div>
          <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="text-sm text-red-600">已超期</div>
          <div className="text-2xl font-bold text-red-700">{overdueCount}</div>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-2">
            <Label>滤盒编号/员工</Label>
            <Input
              placeholder="输入编号或姓名"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>区队</Label>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger>
                <SelectValue placeholder="全部区队" />
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
          </div>
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待回收">待回收</SelectItem>
                <SelectItem value="已超期">已超期</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>检测结果</Label>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger>
                <SelectValue placeholder="全部结果" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结果</SelectItem>
                <SelectItem value="合格">合格</SelectItem>
                <SelectItem value="不合格">不合格</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
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
              <TableHead>员工工号</TableHead>
              <TableHead>员工姓名</TableHead>
              <TableHead>区队</TableHead>
              <TableHead>最后检测时间</TableHead>
              <TableHead>检测结果</TableHead>
              <TableHead>使用天数</TableHead>
              <TableHead>到期日期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-40">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.filterBoxCode}</TableCell>
                  <TableCell>{item.employeeId}</TableCell>
                  <TableCell>{item.employeeName}</TableCell>
                  <TableCell>{item.teamName}</TableCell>
                  <TableCell>{item.lastDetectionTime}</TableCell>
                  <TableCell>
                    <Badge variant={item.lastDetectionResult === "合格" ? "default" : "destructive"}>
                      {item.lastDetectionResult}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.usageDays} 天</TableCell>
                  <TableCell>{item.expireDate}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "已超期" ? "destructive" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(item)}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        提醒
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openForceDialog(item.id)}
                      >
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

      <div className="text-sm text-muted-foreground">
        共 {filteredData.length} 条记录
      </div>

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
