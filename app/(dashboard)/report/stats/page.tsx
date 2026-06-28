"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { mockDetectionStats, type DetectionStats } from "@/lib/mocks/data";
import { Search, RotateCcw, Download, TrendingUp, TrendingDown, Activity, Package, BarChart3, PieChart } from "lucide-react";

// 滤盒类型统计
const filterBoxTypeStats = [
  { type: "KN95", count: 2340, qualifiedCount: 2198, rate: 93.9 },
  { type: "KN100", count: 1560, qualifiedCount: 1482, rate: 95.0 },
  { type: "KP95", count: 890, qualifiedCount: 845, rate: 94.9 },
  { type: "KP100", count: 650, qualifiedCount: 618, rate: 95.1 },
];

// 预测数据
const predictionData = {
  nextWeekTotal: 580,
  nextWeekQualified: 550,
  trend: "up" as const,
  confidence: 92,
};

export default function DetectionStatsPage() {
  const [stats] = useState<DetectionStats[]>(mockDetectionStats);

  // 筛选条件
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [filterDimension, setFilterDimension] = useState("day");
  const [filterType, setFilterType] = useState("all");

  // 筛选记录
  const filteredStats = stats.filter((item) => {
    if (filterStartDate && new Date(item.date) < filterStartDate) return false;
    if (filterEndDate) {
      const itemDate = new Date(item.date);
      const endOfDay = new Date(filterEndDate);
      endOfDay.setHours(23, 59, 59);
      if (itemDate > endOfDay) return false;
    }
    return true;
  });

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

  // 重置筛选
  const handleResetFilter = () => {
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setFilterDimension("day");
    setFilterType("all");
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出 ${filteredStats.length} 天的统计数据`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              检测总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{summary.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              筛选期间总检测次数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              合格次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              {qualifiedRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-success">{summary.qualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              检测合格总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              不合格次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {summary.totalCount > 0 ? (100 - parseFloat(qualifiedRate)).toFixed(1) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-destructive">{summary.unqualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要关注问题
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              回收次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-warning">{summary.recycleCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计回收数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              发放次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-primary">{summary.dispenseCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计发放数量
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 按滤盒类型统计 & 预测功能 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 按滤盒类型统计 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">按滤盒类型统计</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10">滤盒类型</TableHead>
                  <TableHead className="h-10">检测数量</TableHead>
                  <TableHead className="h-10">合格数量</TableHead>
                  <TableHead className="h-10">合格率</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterBoxTypeStats.map((item) => (
                  <TableRow key={item.type}>
                    <TableCell className="py-2.5 font-medium">
                      <Badge variant="outline">{item.type}</Badge>
                    </TableCell>
                    <TableCell className="py-2.5">{item.count}</TableCell>
                    <TableCell className="py-2.5 text-success">{item.qualifiedCount}</TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Progress value={item.rate} className="h-2 w-16" />
                        <span className="text-sm font-medium">{item.rate}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI 预测 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <CardTitle className="text-base">AI 预测分析</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">下周预计检测量</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">{predictionData.nextWeekTotal}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">预计合格量</p>
                  <p className="text-2xl font-bold tabular-nums text-success mt-1">{predictionData.nextWeekQualified}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/50">
                <div className="flex items-center gap-2">
                  {predictionData.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    趋势：{predictionData.trend === "up" ? "上升" : "下降"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  置信度：{predictionData.confidence}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                * 基于历史数据的 AI 预测结果，仅供参考
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Select value={filterDimension} onValueChange={setFilterDimension}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="维度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">按日</SelectItem>
              <SelectItem value="week">按周</SelectItem>
              <SelectItem value="month">按月</SelectItem>
              <SelectItem value="year">按年</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="滤盒类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="KN95">KN95</SelectItem>
              <SelectItem value="KN100">KN100</SelectItem>
              <SelectItem value="KP95">KP95</SelectItem>
              <SelectItem value="KP100">KP100</SelectItem>
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
          导出报表
        </Button>
      </div>

      {/* 数据表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12">
                {filterDimension === "day" && "日期"}
                {filterDimension === "week" && "周"}
                {filterDimension === "month" && "月份"}
                {filterDimension === "year" && "年份"}
              </TableHead>
              <TableHead className="h-12">检测总数</TableHead>
              <TableHead className="h-12">合格次数</TableHead>
              <TableHead className="h-12">不合格次数</TableHead>
              <TableHead className="h-12">合格率</TableHead>
              <TableHead className="h-12">回收次数</TableHead>
              <TableHead className="h-12">发放次数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStats.length > 0 ? (
              filteredStats.map((item) => {
                const rate = ((item.qualifiedCount / item.totalCount) * 100).toFixed(1);
                return (
                  <TableRow key={item.date}>
                    <TableCell className="py-3 font-medium">{item.date}</TableCell>
                    <TableCell className="py-3">{item.totalCount}</TableCell>
                    <TableCell className="py-3 text-success">{item.qualifiedCount}</TableCell>
                    <TableCell className="py-3 text-destructive">{item.unqualifiedCount}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant={Number(rate) >= 90 ? "default" : "destructive"}>
                        {rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">{item.recycleCount}</TableCell>
                    <TableCell className="py-3">{item.dispenseCount}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        共 {filteredStats.length} 条数据
      </div>
    </div>
  );
}
