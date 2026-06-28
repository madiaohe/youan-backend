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
  mockDetectionLogs,
  mockTeams,
  detectionDevices,
  type DetectionLog,
} from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
} from "lucide-react";

export default function DetectionExportPage() {
  const [logs] = useState<DetectionLog[]>(mockDetectionLogs);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterOperationType, setFilterOperationType] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 导出选项
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");

  // 筛选日志
  const filteredLogs = logs.filter((log) => {
    if (
      filterKeyword &&
      !log.filterBoxCode.includes(filterKeyword) &&
      !log.employeeName.includes(filterKeyword) &&
      !log.employeeId.includes(filterKeyword)
    )
      return false;
    if (filterTeam !== "all" && log.teamName !== mockTeams.find((t) => t.id === filterTeam)?.name)
      return false;
    if (filterDevice !== "all" && log.deviceId !== filterDevice) return false;
    if (filterOperationType !== "all" && log.operationType !== filterOperationType) return false;
    if (filterStartDate) {
      const recordDate = new Date(log.operationTime.split(" ")[0]);
      if (recordDate < filterStartDate) return false;
    }
    if (filterEndDate) {
      const recordDate = new Date(log.operationTime.split(" ")[0]);
      const endOfDay = new Date(filterEndDate);
      endOfDay.setHours(23, 59, 59);
      if (recordDate > endOfDay) return false;
    }
    return true;
  });

  // 分页数据
  const pageCount = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 重置筛选
  const handleResetFilter = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterOperationType("all");
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
  const handleExport = (format: "excel" | "pdf") => {
    const exportCount = selectedIds.length > 0 ? selectedIds.length : filteredLogs.length;
    const formatName = format === "excel" ? "Excel" : "PDF";
    toast.success(`已导出 ${exportCount} 条日志为 ${formatName} 格式`);
    setSelectedIds([]);
  };

  // 获取操作类型颜色
  const getOperationTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      检测: "default",
      回收: "secondary",
      发放: "outline",
    };
    return variants[type] || "default";
  };

  // 操作类型列表
  const operationTypes = ["检测", "回收", "发放"];

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
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
          <Select value={filterOperationType} onValueChange={setFilterOperationType}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {operationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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
          <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as "excel" | "pdf")}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => handleExport(exportFormat)}>
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
                    paginatedLogs.length > 0 &&
                    selectedIds.length === paginatedLogs.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="全选"
                />
              </TableHead>
              <TableHead className="h-12">员工姓名</TableHead>
              <TableHead className="h-12">区队</TableHead>
              <TableHead className="h-12">滤盒编号</TableHead>
              <TableHead className="h-12">员工工号</TableHead>
              <TableHead className="h-12">设备</TableHead>
              <TableHead className="h-12">操作类型</TableHead>
              <TableHead className="h-12">操作时间</TableHead>
              <TableHead className="h-12">结果</TableHead>
              <TableHead className="h-12">备注</TableHead>
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
                  <TableCell className="py-3">{log.filterBoxCode}</TableCell>
                  <TableCell className="py-3">{log.employeeId}</TableCell>
                  <TableCell className="py-3">{log.deviceName}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getOperationTypeBadge(log.operationType)}>
                      {log.operationType}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">{log.operationTime}</TableCell>
                  <TableCell className="py-3">{log.result}</TableCell>
                  <TableCell className="py-3">{log.remark || "-"}</TableCell>
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
          {selectedIds.length > 0 && (
            <span>已选择 {selectedIds.length} 项，</span>
          )}
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
