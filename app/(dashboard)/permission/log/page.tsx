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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { mockOperationLogs, operationTypes, operationModules, type OperationLog } from "@/lib/mocks/data";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function AdminLogPage() {
  const [logs] = useState<OperationLog[]>(mockOperationLogs);

  // 筛选条件
  const [filterOperator, setFilterOperator] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 分页
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
      endOfDay.setHours(23, 59, 59, 999);
      if (logDate > endOfDay) return false;
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
  const handleReset = () => {
    setFilterOperator("");
    setFilterType("all");
    setFilterModule("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setPageIndex(0);
  };

  // 获取操作类型对应的颜色
  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      登录: "default",
      登出: "secondary",
      新增: "default",
      编辑: "secondary",
      删除: "destructive",
      导出: "outline",
      导入: "outline",
    };
    return typeColors[type] || "default";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="操作人"
          value={filterOperator}
          onChange={(e) => {
            setFilterOperator(e.target.value);
            setPageIndex(0);
          }}
          className="w-32"
        />
        <Select
          value={filterType}
          onValueChange={(value) => {
            setFilterType(value);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="操作类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            {operationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterModule}
          onValueChange={(value) => {
            setFilterModule(value);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="操作模块" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部模块</SelectItem>
            {operationModules.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DatePicker
          date={filterStartDate}
          onDateChange={(date) => {
            setFilterStartDate(date);
            setPageIndex(0);
          }}
          placeholder="开始日期"
          className="w-36"
        />
        <span className="text-muted-foreground">至</span>
        <DatePicker
          date={filterEndDate}
          onDateChange={(date) => {
            setFilterEndDate(date);
            setPageIndex(0);
          }}
          placeholder="结束日期"
          className="w-36"
        />
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 h-12">操作人</TableHead>
              <TableHead className="h-12">操作模块</TableHead>
              <TableHead className="h-12 w-[40%]">操作内容</TableHead>
              <TableHead className="h-12">操作时间</TableHead>
              <TableHead className="h-12">IP 地址</TableHead>
              <TableHead className="h-12">操作类型</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="pl-6 py-3 font-medium">{log.operator}</TableCell>
                  <TableCell className="py-3">{log.operationModule}</TableCell>
                  <TableCell className="py-3 max-w-xs truncate" title={log.operationContent}>
                    {log.operationContent}
                  </TableCell>
                  <TableCell className="py-3 whitespace-nowrap">{log.operationTime}</TableCell>
                  <TableCell className="py-3 font-mono text-sm">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getTypeBadge(log.operationType)}>
                      {log.operationType}
                    </Badge>
                  </TableCell>
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
