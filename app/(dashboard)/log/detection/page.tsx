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
import { mockDetectionLogs, mockTeams, detectionDevices, type DetectionLog } from "@/lib/mocks/data";
import { Search, RotateCcw, Download } from "lucide-react";

export default function DetectionLogPage() {
  const [logs] = useState<DetectionLog[]>(mockDetectionLogs);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterOperationType, setFilterOperationType] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 筛选日志
  const filteredLogs = logs.filter((log) => {
    if (filterKeyword && !log.filterBoxCode.includes(filterKeyword) && !log.employeeName.includes(filterKeyword))
      return false;
    if (filterTeam !== "all" && log.teamName !== mockTeams.find((t) => t.id === filterTeam)?.name)
      return false;
    if (filterDevice !== "all" && log.deviceId !== filterDevice) return false;
    if (filterOperationType !== "all" && log.operationType !== filterOperationType) return false;
    if (filterStartDate && log.operationTime < filterStartDate) return false;
    if (filterEndDate && log.operationTime > filterEndDate + " 23:59:59") return false;
    return true;
  });

  // 分页数据
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterOperationType("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredLogs.length} 条检测与回收日志`);
  };

  // 获取操作类型颜色
  const getTypeBadge = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      检测: "default",
      回收: "secondary",
      发放: "outline",
    };
    return colors[type] || "default";
  };

  const operationTypes = ["检测", "回收", "发放"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">检测与回收日志</h1>
          <p className="text-muted-foreground">查看滤盒检测、回收、发放操作记录</p>
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
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>设备</Label>
            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger>
                <SelectValue placeholder="全部设备" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部设备</SelectItem>
                {detectionDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>{device.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>操作类型</Label>
            <Select value={filterOperationType} onValueChange={setFilterOperationType}>
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
        </div>
        <div className="mt-4 flex items-end gap-2">
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

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>滤盒编号</TableHead>
              <TableHead>员工工号</TableHead>
              <TableHead>员工姓名</TableHead>
              <TableHead>区队</TableHead>
              <TableHead>设备</TableHead>
              <TableHead>操作类型</TableHead>
              <TableHead>操作时间</TableHead>
              <TableHead>结果</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.filterBoxCode}</TableCell>
                  <TableCell>{log.employeeId}</TableCell>
                  <TableCell>{log.employeeName}</TableCell>
                  <TableCell>{log.teamName}</TableCell>
                  <TableCell>{log.deviceName}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(log.operationType)}>{log.operationType}</Badge>
                  </TableCell>
                  <TableCell>{log.operationTime}</TableCell>
                  <TableCell>{log.result}</TableCell>
                  <TableCell>{log.remark || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">暂无数据</TableCell>
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
                  onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
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
                  onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
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
