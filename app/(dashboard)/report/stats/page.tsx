"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockDetectionStats, type DetectionStats } from "@/lib/mocks/data";
import { Search, RotateCcw, Download, TrendingUp, TrendingDown, Activity, Package } from "lucide-react";

export default function DetectionStatsPage() {
  const [stats] = useState<DetectionStats[]>(mockDetectionStats);

  // 筛选条件
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 筛选记录
  const filteredStats = stats.filter((item) => {
    if (filterStartDate && item.date < filterStartDate) return false;
    if (filterEndDate && item.date > filterEndDate) return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterStartDate("");
    setFilterEndDate("");
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredStats.length} 天的统计数据`);
  };

  // 计算汇总
  const summary = filteredStats.reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.totalCount,
      qualifiedCount: acc.qualifiedCount + item.qualifiedCount,
      unqualifiedCount: acc.unqualifiedCount + item.unqualifiedCount,
      recycleCount: acc.recycleCount + item.recycleCount,
      dispenseCount: acc.dispenseCount + item.dispenseCount,
    }),
    { totalCount: 0, qualifiedCount: 0, unqualifiedCount: 0, recycleCount: 0, dispenseCount: 0 }
  );

  const qualifiedRate = summary.totalCount > 0
    ? ((summary.qualifiedCount / summary.totalCount) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">滤盒检测数据统计</h1>
          <p className="text-muted-foreground">查看检测数据统计和趋势分析</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">检测总数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">合格次数</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.qualifiedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">不合格次数</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.unqualifiedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">合格率</CardTitle>
            <Badge variant="secondary">{qualifiedRate}%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">回收/发放</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.recycleCount}/{summary.dispenseCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="flex flex-wrap items-end gap-4">
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

      {/* 数据表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日期</TableHead>
              <TableHead>检测总数</TableHead>
              <TableHead>合格次数</TableHead>
              <TableHead>不合格次数</TableHead>
              <TableHead>合格率</TableHead>
              <TableHead>回收次数</TableHead>
              <TableHead>发放次数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStats.map((item) => {
              const rate = ((item.qualifiedCount / item.totalCount) * 100).toFixed(1);
              return (
                <TableRow key={item.date}>
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>{item.totalCount}</TableCell>
                  <TableCell className="text-green-600">{item.qualifiedCount}</TableCell>
                  <TableCell className="text-red-600">{item.unqualifiedCount}</TableCell>
                  <TableCell>
                    <Badge variant={Number(rate) >= 90 ? "default" : "destructive"}>
                      {rate}%
                    </Badge>
                  </TableCell>
                  <TableCell>{item.recycleCount}</TableCell>
                  <TableCell>{item.dispenseCount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        共 {filteredStats.length} 天数据
      </div>
    </div>
  );
}
