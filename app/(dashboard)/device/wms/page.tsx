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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockWMSSyncRecords, type WMSSyncRecord } from "@/lib/mocks/data";
import { Search, RotateCcw, RefreshCw, Download, Upload, Database } from "lucide-react";

export default function WMSPage() {
  const [syncRecords] = useState<WMSSyncRecord[]>(mockWMSSyncRecords);
  const [isSyncing, setIsSyncing] = useState(false);

  // 筛选条件
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 筛选记录
  const filteredRecords = syncRecords.filter((record) => {
    if (filterType !== "all" && record.syncType !== filterType) return false;
    if (filterStatus !== "all" && record.status !== filterStatus) return false;
    if (filterStartDate && record.syncTime < filterStartDate) return false;
    if (filterEndDate && record.syncTime > filterEndDate + " 23:59:59") return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterType("all");
    setFilterStatus("all");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  // 手动同步
  const handleSync = async (type: string) => {
    setIsSyncing(true);
    // 模拟同步过程
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSyncing(false);
    toast.success(`${type}同步成功`);
  };

  // 获取状态颜色
  const getStatusBadge = (status: string) => {
    return status === "成功" ? "default" : "destructive";
  };

  // 统计
  const successCount = syncRecords.filter((r) => r.status === "成功").length;
  const failCount = syncRecords.filter((r) => r.status === "失败").length;
  const totalItems = syncRecords.reduce((sum, r) => sum + r.itemCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WMS数据同步</h1>
          <p className="text-muted-foreground">与仓储管理系统进行数据同步</p>
        </div>
      </div>

      {/* 同步操作卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-green-100 p-2">
              <Download className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">入库同步</h3>
              <p className="text-sm text-muted-foreground">从WMS同步入库数据</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSync("入库")}
            disabled={isSyncing}
          >
            {isSyncing ? "同步中..." : "执行同步"}
          </Button>
        </div>

        <div className="rounded-md border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Upload className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">出库同步</h3>
              <p className="text-sm text-muted-foreground">向WMS推送出库数据</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSync("出库")}
            disabled={isSyncing}
          >
            {isSyncing ? "同步中..." : "执行同步"}
          </Button>
        </div>

        <div className="rounded-md border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-purple-100 p-2">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">库存同步</h3>
              <p className="text-sm text-muted-foreground">同步双方库存数据</p>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={() => handleSync("库存")}
            disabled={isSyncing}
          >
            {isSyncing ? "同步中..." : "执行同步"}
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-md border p-4">
          <div className="text-sm text-muted-foreground">同步总次数</div>
          <div className="text-2xl font-bold">{syncRecords.length}</div>
        </div>
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="text-sm text-green-600">成功次数</div>
          <div className="text-2xl font-bold text-green-700">{successCount}</div>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="text-sm text-red-600">失败次数</div>
          <div className="text-2xl font-bold text-red-700">{failCount}</div>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="text-sm text-blue-600">同步数据量</div>
          <div className="text-2xl font-bold text-blue-700">{totalItems}</div>
        </div>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>同步类型</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="入库同步">入库同步</SelectItem>
                <SelectItem value="出库同步">出库同步</SelectItem>
                <SelectItem value="库存同步">库存同步</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>状态</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="全部" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="成功">成功</SelectItem>
                <SelectItem value="失败">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>开始日期</Label>
            <Input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-2">
            <Label>结束日期</Label>
            <Input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={() => {}}>
            <Search className="mr-2 h-4 w-4" />
            查询
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            重置
          </Button>
        </div>
      </div>

      {/* 同步记录表格 */}
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <h3 className="font-medium">同步记录</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>同步类型</TableHead>
              <TableHead>同步时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>数据量</TableHead>
              <TableHead>错误信息</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Badge variant="outline">{record.syncType}</Badge>
                  </TableCell>
                  <TableCell>{record.syncTime}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{record.itemCount}</TableCell>
                  <TableCell className="text-red-600">{record.errorMessage || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">共 {filteredRecords.length} 条同步记录</div>
    </div>
  );
}
