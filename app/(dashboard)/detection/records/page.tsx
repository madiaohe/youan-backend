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
import {
  mockDetectionRecords,
  mockTeams,
  detectionDevices,
  detectionResults,
  type DetectionRecord,
} from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function DetectionRecordsPage() {
  const [records] = useState<DetectionRecord[]>(mockDetectionRecords);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 筛选记录
  const filteredRecords = records.filter((record) => {
    if (
      filterKeyword &&
      !record.filterBoxCode.includes(filterKeyword) &&
      !record.employeeName.includes(filterKeyword) &&
      !record.employeeId.includes(filterKeyword)
    )
      return false;
    if (filterTeam !== "all" && record.teamName !== mockTeams.find((t) => t.id === filterTeam)?.name)
      return false;
    if (filterDevice !== "all" && record.deviceId !== filterDevice) return false;
    if (filterResult !== "all" && record.result !== filterResult) return false;
    if (filterStartDate) {
      const recordDate = new Date(record.detectionTime.split(" ")[0]);
      if (recordDate < filterStartDate) return false;
    }
    if (filterEndDate) {
      const recordDate = new Date(record.detectionTime.split(" ")[0]);
      const endOfDay = new Date(filterEndDate);
      endOfDay.setHours(23, 59, 59);
      if (recordDate > endOfDay) return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 统计
  const totalCount = filteredRecords.length;
  const qualifiedCount = filteredRecords.filter((r) => r.result === "合格").length;
  const unqualifiedCount = filteredRecords.filter((r) => r.result === "不合格").length;
  const qualifiedRate = totalCount > 0 ? Math.round((qualifiedCount / totalCount) * 100) : 0;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterResult("all");
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

  // 导出
  const handleExport = () => {
    const exportCount = selectedIds.length > 0 ? selectedIds.length : filteredRecords.length;
    toast.success(`已导出 ${exportCount} 条检测记录`);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总检测次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的检测总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              合格次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {qualifiedRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-green-600">{qualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              合格率表现良好
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              不合格次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {100 - qualifiedRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-red-600">{unqualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要关注的检测记录
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
          <Select value={filterDevice} onValueChange={setFilterDevice}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="设备" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部设备</SelectItem>
              {detectionDevices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {detectionResults.map((result) => (
                <SelectItem key={result} value={result}>
                  {result}
                </SelectItem>
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
        <div className="flex items-center gap-2">
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
                  checked={
                    paginatedRecords.length > 0 &&
                    selectedIds.length === paginatedRecords.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">员工姓名</TableHead>
              <TableHead className="h-12">区队</TableHead>
              <TableHead className="h-12">滤盒编号</TableHead>
              <TableHead className="h-12">员工工号</TableHead>
              <TableHead className="h-12">检测设备</TableHead>
              <TableHead className="h-12">吸气阻力(Pa)</TableHead>
              <TableHead className="h-12">呼气阻力(Pa)</TableHead>
              <TableHead className="h-12">流量(L/min)</TableHead>
              <TableHead className="h-12">检测结果</TableHead>
              <TableHead className="h-12">检测时间</TableHead>
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
                  <TableCell className="py-3 font-medium">{record.employeeName}</TableCell>
                  <TableCell className="py-3">{record.teamName}</TableCell>
                  <TableCell className="py-3">{record.filterBoxCode}</TableCell>
                  <TableCell className="py-3">{record.employeeId}</TableCell>
                  <TableCell className="py-3">{record.deviceName}</TableCell>
                  <TableCell className="py-3">{record.inhaleResistance}</TableCell>
                  <TableCell className="py-3">{record.exhaleResistance}</TableCell>
                  <TableCell className="py-3">{record.flowRate}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={record.result === "合格" ? "default" : "destructive"}>
                      {record.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">{record.detectionTime}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
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
          {selectedIds.length > 0 && (
            <span>已选择 {selectedIds.length} 项，</span>
          )}
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
    </div>
  );
}
