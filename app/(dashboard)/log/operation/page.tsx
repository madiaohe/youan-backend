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
import { mockSystemLogs, operationTypes, operationModules, type SystemLog } from "@/lib/mocks/data";
import {
  Search,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
} from "lucide-react";

export default function OperationLogPage() {
  const [logs] = useState<SystemLog[]>(mockSystemLogs);

  // 筛选条件
  const [filterOperator, setFilterOperator] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 选择
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 筛选日志
  const filteredLogs = logs.filter((log) => {
    if (filterOperator && !log.operator.includes(filterOperator)) return false;
    if (filterType !== "all" && log.operationType !== filterType) return false;
    if (filterModule !== "all" && log.operationModule !== filterModule) return false;
    if (filterStartDate) {
      const logDate = new Date(log.operationTime.split(" ")[0]);
      if (logDate < filterStartDate) return false;
    }
    if (filterEndDate) {
      const logDate = new Date(log.operationTime.split(" ")[0]);
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
  const loginCount = filteredLogs.filter((l) => l.operationType === "登录").length;
  const editCount = filteredLogs.filter((l) => l.operationType === "编辑" || l.operationType === "新增").length;
  const deleteCount = filteredLogs.filter((l) => l.operationType === "删除").length;

  // 重置筛选
  const handleResetFilter = () => {
    setFilterOperator("");
    setFilterType("all");
    setFilterModule("all");
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
    toast.success(`已导出 ${exportCount} 条操作日志`);
    setSelectedIds([]);
  };

  // 获取操作类型颜色
  const getTypeBadge = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      登录: "default",
      登出: "secondary",
      新增: "default",
      编辑: "secondary",
      删除: "destructive",
      导出: "outline",
      查看: "outline",
    };
    return colors[type] || "default";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              操作总次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选条件下的操作总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              登录次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-primary">{loginCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              系统登录记录
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              编辑/新增
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-success">{editCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              数据修改操作
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              删除次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-destructive">{deleteCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              数据删除操作
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="操作人"
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="w-28"
          />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {operationTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterModule} onValueChange={setFilterModule}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {operationModules.map((module) => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
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
              <TableHead className="h-12">操作人</TableHead>
              <TableHead className="h-12">角色</TableHead>
              <TableHead className="h-12">操作类型</TableHead>
              <TableHead className="h-12">操作模块</TableHead>
              <TableHead className="h-12">操作内容</TableHead>
              <TableHead className="h-12">操作时间</TableHead>
              <TableHead className="h-12">IP地址</TableHead>
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
                  <TableCell className="py-3 font-medium">{log.operator}</TableCell>
                  <TableCell className="py-3">{log.operatorRole}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getTypeBadge(log.operationType)}>{log.operationType}</Badge>
                  </TableCell>
                  <TableCell className="py-3">{log.operationModule}</TableCell>
                  <TableCell className="py-3">{log.operationContent}</TableCell>
                  <TableCell className="py-3">{log.operationTime}</TableCell>
                  <TableCell className="py-3 font-mono text-sm">{log.ipAddress}</TableCell>
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
