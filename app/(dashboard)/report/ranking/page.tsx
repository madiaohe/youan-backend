"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { mockTeamRankings, mockTeams, type TeamRanking } from "@/lib/mocks/data";
import { Search, RotateCcw, Download, Trophy, AlertTriangle } from "lucide-react";

export default function TeamRankingPage() {
  const [rankings] = useState<TeamRanking[]>(mockTeamRankings);

  // 筛选条件
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 筛选记录
  const filteredRankings = rankings.filter((item) => {
    if (filterTeam !== "all" && item.teamId !== filterTeam) return false;
    return true;
  });

  // 重置筛选
  const handleReset = () => {
    setFilterTeam("all");
    setFilterStartDate("");
    setFilterEndDate("");
  };

  // 导出
  const handleExport = () => {
    toast.success(`已导出区队不合格率排名报表`);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">区队不合格率排名</h1>
          <p className="text-muted-foreground">按不合格率从高到低排名，重点关注问题区队</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          导出报表
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">区队数量</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rankings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总检测次数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总不合格次数</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalStats.unqualifiedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均不合格率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选条件 */}
      <div className="rounded-md border p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>区队</Label>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-40">
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
              <TableHead>排名</TableHead>
              <TableHead>区队名称</TableHead>
              <TableHead>检测总数</TableHead>
              <TableHead>不合格次数</TableHead>
              <TableHead>不合格率</TableHead>
              <TableHead className="w-48">可视化</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRankings.map((item) => (
              <TableRow key={item.teamId} className={item.rank <= 3 ? "bg-red-50" : ""}>
                <TableCell>{getRankBadge(item.rank)}</TableCell>
                <TableCell className="font-medium">{item.teamName}</TableCell>
                <TableCell>{item.totalCount}</TableCell>
                <TableCell className="text-red-600">{item.unqualifiedCount}</TableCell>
                <TableCell className={getRateColor(item.unqualifiedRate)}>
                  {item.unqualifiedRate.toFixed(1)}%
                </TableCell>
                <TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        共 {filteredRankings.length} 个区队 · 排名越靠前不合格率越高，需重点关注
      </div>
    </div>
  );
}
