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
import { Progress } from "@/components/ui/progress";
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
import { mockAIRecommendLogs, mockTeams, detectionDevices, type AIRecommendLog } from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Brain,
} from "lucide-react";

export default function AIRecommendLogPage() {
  const [logs] = useState<AIRecommendLog[]>(mockAIRecommendLogs);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 筛选日志
  const filteredLogs = logs.filter((log) => {
    if (filterKeyword && !log.employeeName.includes(filterKeyword) && !log.employeeId.includes(filterKeyword))
      return false;
    if (filterTeam !== "all" && log.teamName !== mockTeams.find((t) => t.id === filterTeam)?.name)
      return false;
    if (filterDevice !== "all" && log.deviceId !== filterDevice) return false;
    if (filterStartDate) {
      const logDate = new Date(log.recommendTime.split(" ")[0]);
      if (logDate < filterStartDate) return false;
    }
    if (filterEndDate) {
      const logDate = new Date(log.recommendTime.split(" ")[0]);
      const endOfDay = new Date(filterEndDate);
      endOfDay.setHours(23, 59, 59);
      if (logDate > endOfDay) return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // 统计
  const totalCount = filteredLogs.length;
  const avgConfidence = filteredLogs.length > 0
    ? (filteredLogs.reduce((sum, log) => sum + log.confidence, 0) / filteredLogs.length).toFixed(1)
    : "0";
  const highConfidenceCount = filteredLogs.filter((l) => l.confidence > 90).length;
  const highConfidenceRate = totalCount > 0 ? Math.round((highConfidenceCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setPageIndex(0);
  };

  // 全选（当前页）
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedLogs.map((l) => l.id));
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

  // 导出
  const handleExport = () => {
    const exportCount = selectedIds.length > 0 ? selectedIds.length : filteredLogs.length;
    toast.success(`已导出 ${exportCount} 条AI推荐日志`);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              推荐总次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的推荐总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              平均置信度
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-purple-600">{avgConfidence}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              AI推荐准确度
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              高置信度推荐
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {highConfidenceRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-green-600">{highConfidenceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              置信度 &gt; 90%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              低置信度推荐
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-orange-600">{totalCount - highConfidenceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要人工确认
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="员工工号/姓名"
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
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDevice} onValueChange={setFilterDevice}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="设备" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部设备</SelectItem>
              {detectionDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
              ))}
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
        <Button size="sm" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出{selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 h-12 pl-4">
                <Checkbox
                  checked={paginatedLogs.length > 0 && selectedIds.length === paginatedLogs.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">员工姓名</TableHead>
              <TableHead className="h-12">区队</TableHead>
              <TableHead className="h-12">脸型</TableHead>
              <TableHead className="h-12">脸型大小</TableHead>
              <TableHead className="h-12">推荐面罩</TableHead>
              <TableHead className="h-12">置信度</TableHead>
              <TableHead className="h-12">推荐时间</TableHead>
              <TableHead className="h-12">设备</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id} data-state={selectedIds.includes(log.id) && "selected"}>
                  <TableCell className="py-3 pl-4">
                    <Checkbox
                      checked={selectedIds.includes(log.id)}
                      onCheckedChange={(checked) => handleSelect(log.id, checked as boolean)}
                      aria-label="选择行"
                    />
                  </TableCell>
                  <TableCell className="py-3 font-medium">{log.employeeName}</TableCell>
                  <TableCell className="py-3">{log.teamName}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline">{log.faceShape}</Badge>
                  </TableCell>
                  <TableCell className="py-3">{log.faceSize}</TableCell>
                  <TableCell className="py-3">{log.recommendedMask}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={log.confidence} className="h-2 w-16" />
                      <span className={`text-sm font-medium ${log.confidence >= 90 ? "text-green-600" : "text-orange-600"}`}>
                        {log.confidence}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{log.recommendTime}</TableCell>
                  <TableCell className="py-3">{log.deviceName}</TableCell>
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
          共 {filteredLogs.length} 条记录
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
    </div>
  );
}
