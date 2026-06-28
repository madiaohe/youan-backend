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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { mockTeamRankings, mockTeams, type TeamRanking } from "@/lib/mocks/data";
import { Search, RotateCcw, Download, Trophy, AlertTriangle, TrendingUp, TrendingDown, BarChart3, LineChart } from "lucide-react";

// 趋势数据
const trendData = [
  { week: "第1周", rate: 12.5 },
  { week: "第2周", rate: 10.8 },
  { week: "第3周", rate: 11.2 },
  { week: "第4周", rate: 9.5 },
  { week: "第5周", rate: 8.7 },
  { week: "第6周", rate: 7.9 },
];

// 预测数据
const predictionData = {
  nextWeek: 7.2,
  trend: "down" as const,
  confidence: 88,
};

export default function TeamRankingPage() {
  const [rankings] = useState<TeamRanking[]>(mockTeamRankings);

  // 筛选条件
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 筛选记录
  const filteredRankings = rankings.filter((item) => {
    if (filterTeam !== "all" && item.teamId !== filterTeam) return false;
    return true;
  });

  // 计算总体不合格率
  const totalStats = rankings.reduce(
    (acc, item) => ({
      totalCount: acc.totalCount + item.totalCount,
      unqualifiedCount: acc.unqualifiedCount + item.unqualifiedCount,
    }),
    { totalCount: 0, unqualifiedCount: 0 }
  );
  const overallRate = totalStats.totalCount > 0
    ? ((totalStats.unqualifiedCount / totalStats.totalCount) * 100).toFixed(1)
    : "0";

  // 重置筛选
  const handleResetFilter = () => {
    setFilterTeam("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出区队不合格率排名报表`);
  };

  // 获取排名徽章
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">🥇 第1名</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">🥈 第2名</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">🥉 第3名</Badge>;
    return <Badge variant="outline">第{rank}名</Badge>;
  };

  // 获取不合格率颜色
  const getRateColor = (rate: number) => {
    if (rate >= 15) return "text-red-600";
    if (rate >= 10) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              区队数量
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{rankings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              参与排名区队
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总检测次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalStats.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              累计检测总数
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              总不合格次数
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              {overallRate}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-red-600">{totalStats.unqualifiedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              需要关注问题
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              平均不合格率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{overallRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              整体不合格率
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 趋势图 & 预测 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 趋势图 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">不合格率趋势图</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-48">
              {/* Y轴标签 */}
              <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-muted-foreground">
                <span>15%</span>
                <span>10%</span>
                <span>5%</span>
                <span>0%</span>
              </div>
              {/* 图表区域 */}
              <div className="ml-12 h-40 flex items-end gap-2 border-l border-b border-muted-foreground/20">
                {trendData.map((item, index) => {
                  const height = (item.rate / 15) * 100;
                  const isLowest = item.rate === Math.min(...trendData.map(d => d.rate));
                  const isHighest = item.rate === Math.max(...trendData.map(d => d.rate));
                  return (
                    <div key={item.week} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t transition-all ${
                          isLowest ? "bg-green-500" : isHighest ? "bg-red-500" : "bg-primary"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{item.week}</span>
                      <span className={`text-xs font-medium ${isLowest ? "text-green-600" : isHighest ? "text-red-600" : ""}`}>
                        {item.rate}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span>最高</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>正常</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span>最低</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 预测卡片 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-base">AI 预测</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">下周预计不合格率</p>
                <p className="text-3xl font-bold tabular-nums text-green-600 mt-1">
                  {predictionData.nextWeek}%
                </p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  {predictionData.trend === "down" ? (
                    <TrendingDown className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    趋势：{predictionData.trend === "down" ? "下降" : "上升"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">预测置信度</p>
                <p className="text-lg font-bold text-purple-600">{predictionData.confidence}%</p>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * 基于历史数据 AI 预测，仅供参考
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="区队" />
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
              <TableHead className="h-12">排名</TableHead>
              <TableHead className="h-12">区队名称</TableHead>
              <TableHead className="h-12">检测总数</TableHead>
              <TableHead className="h-12">不合格次数</TableHead>
              <TableHead className="h-12">不合格率</TableHead>
              <TableHead className="h-12 w-48">可视化</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRankings.length > 0 ? (
              filteredRankings.map((item) => (
                <TableRow key={item.teamId} className={item.rank <= 3 ? "bg-red-50" : ""}>
                  <TableCell className="py-3">{getRankBadge(item.rank)}</TableCell>
                  <TableCell className="py-3 font-medium">{item.teamName}</TableCell>
                  <TableCell className="py-3">{item.totalCount}</TableCell>
                  <TableCell className="py-3 text-red-600">{item.unqualifiedCount}</TableCell>
                  <TableCell className={`py-3 ${getRateColor(item.unqualifiedRate)}`}>
                    {item.unqualifiedRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={item.unqualifiedRate * 5}
                        className="h-2"
                      />
                      <span className="text-xs text-muted-foreground w-8">
                        {item.unqualifiedRate.toFixed(0)}%
                      </span>
                    </div>
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

      <div className="text-sm text-muted-foreground">
        共 {filteredRankings.length} 个区队 · 排名越靠前不合格率越高，需重点关注
      </div>
    </div>
  );
}
