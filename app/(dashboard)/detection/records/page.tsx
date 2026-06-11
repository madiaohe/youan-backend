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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  mockDetectionRecords,
  mockTeams,
  detectionDevices,
  detectionResults,
  type DetectionRecord,
} from "@/lib/mocks/data";
import { Search, RotateCcw, Eye, Download } from "lucide-react";

export default function DetectionRecordsPage() {
  const [records] = useState<DetectionRecord[]>(mockDetectionRecords);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterResult, setFilterResult] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 分页
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 详情弹窗
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DetectionRecord | null>(null);

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
    if (filterStartDate && record.detectionTime < filterStartDate) return false;
    if (filterEndDate && record.detectionTime > filterEndDate + " 23:59:59") return false;
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
    setFilterResult("all");
    setFilterStartDate("");
    setFilterEndDate("");
    setCurrentPage(1);
  };

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 查看详情
  const handleViewDetail = (record: DetectionRecord) => {
    setSelectedRecord(record);
    setIsDetailDialogOpen(true);
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredRecords.length} 条检测记录`);
  };

  // 统计
  const qualifiedCount = filteredRecords.filter((r) => r.result === "合格").length;
  const unqualifiedCount = filteredRecords.filter((r) => r.result === "不合格").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">检测记录查询</h1>
          <p className="text-muted-foreground">查询和管理呼吸阻力检测记录</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">总检测次数</div>
          <div className="text-2xl font-bold">{filteredRecords.length}</div>
        </div>
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="text-sm text-green-600">合格次数</div>
          <div className="text-2xl font-bold text-green-700">{qualifiedCount}</div>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="text-sm text-red-600">不合格次数</div>
          <div className="text-2xl font-bold text-red-700">{unqualifiedCount}</div>
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
            <Label>检测设备</Label>
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
            <Label>检测结果</Label>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger>
                <SelectValue placeholder="全部结果" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部结果</SelectItem>
                {detectionResults.map((result) => (
                  <SelectItem key={result} value={result}>
                    {result}
                  </SelectItem>
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
              <TableHead>检测设备</TableHead>
              <TableHead>吸气阻力(Pa)</TableHead>
              <TableHead>呼气阻力(Pa)</TableHead>
              <TableHead>流量(L/min)</TableHead>
              <TableHead>检测结果</TableHead>
              <TableHead>检测时间</TableHead>
              <TableHead className="w-20">操作</TableHead>
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
                  <TableCell>{record.deviceName}</TableCell>
                  <TableCell>{record.inhaleResistance}</TableCell>
                  <TableCell>{record.exhaleResistance}</TableCell>
                  <TableCell>{record.flowRate}</TableCell>
                  <TableCell>
                    <Badge variant={record.result === "合格" ? "default" : "destructive"}>
                      {record.result}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.detectionTime}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetail(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
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

      {/* 详情弹窗 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>检测记录详情</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">滤盒编号</Label>
                  <div className="font-medium">{selectedRecord.filterBoxCode}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">检测结果</Label>
                  <div>
                    <Badge variant={selectedRecord.result === "合格" ? "default" : "destructive"}>
                      {selectedRecord.result}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">员工工号</Label>
                  <div className="font-medium">{selectedRecord.employeeId}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">员工姓名</Label>
                  <div className="font-medium">{selectedRecord.employeeName}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">所属区队</Label>
                  <div>{selectedRecord.teamName}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">检测设备</Label>
                  <div>{selectedRecord.deviceName}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">吸气阻力</Label>
                  <div>{selectedRecord.inhaleResistance} Pa</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">呼气阻力</Label>
                  <div>{selectedRecord.exhaleResistance} Pa</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">检测流量</Label>
                  <div>{selectedRecord.flowRate} L/min</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">检测时间</Label>
                  <div>{selectedRecord.detectionTime}</div>
                </div>
              </div>
              {selectedRecord.remark && (
                <div>
                  <Label className="text-muted-foreground">备注</Label>
                  <div className="text-red-600">{selectedRecord.remark}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
