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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockSystemLogs, operationTypes, operationModules, type SystemLog } from "@/lib/mocks/data";
import { Search, RotateCcw, Download } from "lucide-react";

export default function OperationLogPage() {
  const [logs] = useState<SystemLog[]>(mockSystemLogs);

  // 筛选条件
  const [filterOperator, setFilterOperator] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterModule, setFilterModule] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 筛选日志
  const filteredLogs = logs.filter((log) => {
    if (filterOperator && !log.operator.includes(filterOperator)) return false;
    if (filterType !== "all" && log.operationType !== filterType) return false;
    if (filterModule !== "all" && log.operationModule !== filterModule) return false;
    if (filterStartDate && log.operationTime < filterStartDate) return false;
    if (filterEndDate && log.operationTime > filterEndDate + " 23:59:59") return false;
    return true;
  });

  // 分页数据
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 重置筛选
  const handleReset = () => {
    setFilterOperator("");
    setFilterType("all");
    setFilterModule("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredLogs.length} 条操作日志`);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">操作日志</h1>
          <p className="text-muted-foreground">查看系统操作历史记录</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出日志
        </Button>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-2">
            <Label>操作人</Label>
            <Input
              placeholder="输入操作人"
              value={filterOperator}
              onChange={(e) => setFilterOperator(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>操作类型</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {operationTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>操作模块</Label>
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger>
                <SelectValue placeholder="全部模块" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部模块</SelectItem>
                {operationModules.map((module) => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>开始日期</Label>
            <Input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>结束日期</Label>
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={() => setCurrentPage(1)}>
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
              <TableHead>操作人</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>操作类型</TableHead>
              <TableHead>操作模块</TableHead>
              <TableHead>操作内容</TableHead>
              <TableHead>操作时间</TableHead>
              <TableHead>IP地址</TableHead>
              <TableHead>浏览器</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.operator}</TableCell>
                  <TableCell>{log.operatorRole}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(log.operationType)}>{log.operationType}</Badge>
                  </TableCell>
                  <TableCell>{log.operationModule}</TableCell>
                  <TableCell>{log.operationContent}</TableCell>
                  <TableCell>{log.operationTime}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>{log.browser || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">暂无数据</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">共 {filteredLogs.length} 条记录</p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
