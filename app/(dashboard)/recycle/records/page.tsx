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
import {
  mockRecycleRecords,
  mockTeams,
  detectionDevices,
  type RecycleRecord,
} from "@/lib/mocks/data";
import { Search, RotateCcw, Download } from "lucide-react";

export default function RecycleRecordsPage() {
  const [records] = useState<RecycleRecord[]>(mockRecycleRecords);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
    if (filterType !== "all" && record.recycleType !== filterType) return false;
    if (filterStartDate && record.recycleTime < filterStartDate) return false;
    if (filterEndDate && record.recycleTime > filterEndDate + " 23:59:59") return false;
    return true;
  });

  // 分页数据
  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterType("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredRecords.length} 条回收记录`);
  };

  // 统计
  const normalCount = filteredRecords.filter((r) => r.recycleType === "正常回收").length;
  const forceCount = filteredRecords.filter((r) => r.recycleType === "强制回收").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">回收记录查询</h1>
          <p className="text-muted-foreground">查询滤盒回收历史记录</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">总回收次数</div>
          <div className="text-2xl font-bold">{filteredRecords.length}</div>
        </div>
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="text-sm text-green-600">正常回收</div>
          <div className="text-2xl font-bold text-green-700">{normalCount}</div>
        </div>
        <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
          <div className="text-sm text-orange-600">强制回收</div>
          <div className="text-2xl font-bold text-orange-700">{forceCount}</div>
        </div>
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
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>回收设备</Label>
            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger>
                <SelectValue placeholder="全部设备" />
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
          </div>
          <div className="space-y-2">
            <Label>回收类型</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="正常回收">正常回收</SelectItem>
                <SelectItem value="强制回收">强制回收</SelectItem>
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

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>滤盒编号</TableHead>
              <TableHead>员工工号</TableHead>
              <TableHead>员工姓名</TableHead>
              <TableHead>区队</TableHead>
              <TableHead>回收时间</TableHead>
              <TableHead>回收设备</TableHead>
              <TableHead>回收类型</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.filterBoxCode}</TableCell>
                  <TableCell>{record.employeeId}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.teamName}</TableCell>
                  <TableCell>{record.recycleTime}</TableCell>
                  <TableCell>{record.deviceName}</TableCell>
                  <TableCell>
                    <Badge variant={record.recycleType === "正常回收" ? "default" : "secondary"}>
                      {record.recycleType}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.remark || "-"}</TableCell>
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 {filteredRecords.length} 条记录
          </p>
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
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
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
