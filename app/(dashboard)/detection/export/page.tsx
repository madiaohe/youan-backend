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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  mockDetectionLogs,
  mockTeams,
  detectionDevices,
  type DetectionLog,
} from "@/lib/mocks/data";
import { Search, RotateCcw, FileSpreadsheet, FileText } from "lucide-react";

export default function DetectionExportPage() {
  const [logs] = useState<DetectionLog[]>(mockDetectionLogs);

  // 筛选条件
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterDevice, setFilterDevice] = useState("all");
  const [filterOperationType, setFilterOperationType] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 导出选项
  const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel");
  const [includeDetails, setIncludeDetails] = useState(true);

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
    if (filterStartDate && log.operationTime < filterStartDate) return false;
    if (filterEndDate && log.operationTime > filterEndDate + " 23:59:59") return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterKeyword("");
    setFilterTeam("all");
    setFilterDevice("all");
    setFilterOperationType("all");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  // 搜索
  const handleSearch = () => {
    toast.success(`找到 ${filteredLogs.length} 条记录`);
  };

  // 导出
  const handleExport = () => {
    const format = exportFormat === "excel" ? "Excel" : "CSV";
    toast.success(`已导出 ${filteredLogs.length} 条日志为 ${format} 格式`);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">检测日志导出</h1>
          <p className="text-muted-foreground">筛选并导出检测、回收、发放操作日志</p>
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
            <Label>设备</Label>
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
            <Label>操作类型</Label>
            <Select value={filterOperationType} onValueChange={setFilterOperationType}>
              <SelectTrigger>
                <SelectValue placeholder="全部类型" />
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

      {/* 导出选项 */}
      <div className="rounded-md border p-4">
        <h3 className="font-medium mb-4">导出选项</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Label>导出格式：</Label>
            <Select
              value={exportFormat}
              onValueChange={(v) => setExportFormat(v as "excel" | "csv")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="includeDetails"
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
            />
            <Label htmlFor="includeDetails" className="cursor-pointer">
              包含详细信息（阻力值、流量等）
            </Label>
          </div>
          <Button onClick={handleExport} className="ml-auto">
            {exportFormat === "excel" ? (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            导出 {filteredLogs.length} 条记录
          </Button>
        </div>
      </div>

      {/* 数据预览 */}
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <h3 className="font-medium">数据预览</h3>
          <p className="text-sm text-muted-foreground">
            共 {filteredLogs.length} 条符合条件的日志
          </p>
        </div>
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
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.filterBoxCode}</TableCell>
                  <TableCell>{log.employeeId}</TableCell>
                  <TableCell>{log.employeeName}</TableCell>
                  <TableCell>{log.teamName}</TableCell>
                  <TableCell>{log.deviceName}</TableCell>
                  <TableCell>
                    <Badge variant={getOperationTypeBadge(log.operationType)}>
                      {log.operationType}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.operationTime}</TableCell>
                  <TableCell>{log.result}</TableCell>
                  <TableCell>{log.remark || "-"}</TableCell>
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
    </div>
  );
}
