"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, TrendingUp, TrendingDown } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

// 生成按时间统计数据（90天）- 4条数据线
const generateTimeStatsData = () => {
  const data = [];
  const baseDate = new Date("2024-06-29");

  for (let i = 90; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const totalCount = Math.floor(Math.random() * 100) + 100;
    const unqualifiedCount = Math.floor(Math.random() * 20) + 5;
    const qualifiedCount = totalCount - unqualifiedCount;
    const unqualifiedRate = Number(((unqualifiedCount / totalCount) * 100).toFixed(1));

    data.push({
      date: date.toISOString().split("T")[0],
      totalCount,
      qualifiedCount,
      unqualifiedCount,
      unqualifiedRate,
    });
  }

  return data;
};

// 生成按滤盒类型统计数据（90天）- 只有KN95和KN100两条数据线
const generateTypeStatsData = () => {
  const data = [];
  const baseDate = new Date("2024-06-29");

  for (let i = 90; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const KN95 = Math.floor(Math.random() * 80) + 60;
    const KN100 = Math.floor(Math.random() * 50) + 40;

    data.push({
      date: date.toISOString().split("T")[0],
      KN95,
      KN100,
    });
  }

  return data;
};

// 区队不合格率排名数据
const teamRankingData = [
  { rank: 1, teamName: "掘进二队", totalCount: 580, qualifiedCount: 568, unqualifiedCount: 12, unqualifiedRate: 2.1, trend: "down" },
  { rank: 2, teamName: "掘进一队", totalCount: 720, qualifiedCount: 698, unqualifiedCount: 22, unqualifiedRate: 3.1, trend: "down" },
  { rank: 3, teamName: "采煤二队", totalCount: 890, qualifiedCount: 856, unqualifiedCount: 34, unqualifiedRate: 3.8, trend: "up" },
  { rank: 4, teamName: "采煤一队", totalCount: 1050, qualifiedCount: 1002, unqualifiedCount: 48, unqualifiedRate: 4.6, trend: "up" },
  { rank: 5, teamName: "机电队", totalCount: 620, qualifiedCount: 589, unqualifiedCount: 31, unqualifiedRate: 5.0, trend: "down" },
  { rank: 6, teamName: "通风队", totalCount: 480, qualifiedCount: 450, unqualifiedCount: 30, unqualifiedRate: 6.3, trend: "up" },
];

// 图表配置 - 按时间统计（4条数据）
const timeChartConfig = {
  totalCount: {
    label: "检测总数",
    color: "var(--chart-1)",
  },
  qualifiedCount: {
    label: "合格数",
    color: "var(--chart-2)",
  },
  unqualifiedCount: {
    label: "不合格数",
    color: "var(--chart-3)",
  },
  unqualifiedRate: {
    label: "不合格率",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

// 图表配置 - 按滤盒类型（2条数据）
const typeChartConfig = {
  KN95: {
    label: "KN95",
    color: "var(--chart-1)",
  },
  KN100: {
    label: "KN100",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// 获取不合格率对应的badge样式
const getUnqualifiedRateBadge = (rate: number) => {
  if (rate <= 3) return "bg-success/10 text-success border-success/20";
  if (rate <= 5) return "bg-warning/10 text-warning border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
};

// 时间范围类型
type TimeRange = "7d" | "30d" | "90d";

// 时间范围显示文本
const timeRangeLabels: Record<TimeRange, string> = {
  "7d": "最近 7 天",
  "30d": "最近 30 天",
  "90d": "最近 90 天",
};

export default function DetectionStatsPage() {
  const [allTimeStats] = useState(generateTimeStatsData);
  const [allTypeStats] = useState(generateTypeStatsData);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [typeTimeRange, setTypeTimeRange] = useState<TimeRange>("30d");

  // 根据时间范围过滤按时间统计数据
  const filteredTimeData = useMemo(() => {
    const daysToSubtract = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const endDate = new Date("2024-06-29");
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return allTimeStats.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [allTimeStats, timeRange]);

  // 根据时间范围过滤按滤盒类型数据
  const filteredTypeData = useMemo(() => {
    const daysToSubtract = typeTimeRange === "7d" ? 7 : typeTimeRange === "30d" ? 30 : 90;
    const endDate = new Date("2024-06-29");
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return allTypeStats.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate && date <= endDate;
    });
  }, [allTypeStats, typeTimeRange]);

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="time" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1.5">
          <TabsTrigger value="time" className="gap-2 px-5 py-3 text-base">
            <Calendar className="h-4 w-4" />
            按时间统计
          </TabsTrigger>
          <TabsTrigger value="type" className="gap-2 px-5 py-3 text-base">
            <Package className="h-4 w-4" />
            按滤盒类型
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 按时间统计 - 4条数据线 */}
        <TabsContent value="time" className="space-y-4">
          <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle>检测趋势</CardTitle>
                <CardDescription>
                  {timeRangeLabels[timeRange]}检测数据变化趋势，共 {filteredTimeData.length} 条记录
                </CardDescription>
              </div>
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="选择时间范围"
                >
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    最近 90 天
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    最近 30 天
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    最近 7 天
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={timeChartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <AreaChart data={filteredTimeData}>
                  <defs>
                    <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-totalCount)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-totalCount)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillQualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-qualifiedCount)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-qualifiedCount)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillUnqualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-unqualifiedCount)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-unqualifiedCount)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="totalCount"
                    type="natural"
                    fill="url(#fillTotal)"
                    stroke="var(--color-totalCount)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="qualifiedCount"
                    type="natural"
                    fill="url(#fillQualified)"
                    stroke="var(--color-qualifiedCount)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="unqualifiedCount"
                    type="natural"
                    fill="url(#fillUnqualified)"
                    stroke="var(--color-unqualifiedCount)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="unqualifiedRate"
                    stroke="var(--color-unqualifiedRate)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* 区队排名表格 */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">区队不合格率排名</h2>
            <div className="rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 pl-6 w-16">排名</TableHead>
                    <TableHead className="h-12">区队名称</TableHead>
                    <TableHead className="h-12">检测总数</TableHead>
                    <TableHead className="h-12">合格次数</TableHead>
                    <TableHead className="h-12">不合格次数</TableHead>
                    <TableHead className="h-12">不合格率</TableHead>
                    <TableHead className="h-12 w-24">趋势</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRankingData.map((item) => (
                    <TableRow key={item.teamName}>
                      <TableCell className="py-3 pl-6">
                        <div className={`
                          flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold
                          ${item.rank === 1 ? 'bg-warning/10 text-warning' : ''}
                          ${item.rank === 2 ? 'bg-muted text-muted-foreground' : ''}
                          ${item.rank === 3 ? 'bg-chart-3/10 text-chart-3' : ''}
                          ${item.rank > 3 ? 'bg-muted/50 text-muted-foreground' : ''}
                        `}>
                          {item.rank}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 font-medium">{item.teamName}</TableCell>
                      <TableCell className="py-3">{item.totalCount}</TableCell>
                      <TableCell className="py-3 text-success">{item.qualifiedCount}</TableCell>
                      <TableCell className="py-3 text-destructive">{item.unqualifiedCount}</TableCell>
                      <TableCell className="py-3">
                        <Badge className={getUnqualifiedRateBadge(item.unqualifiedRate)}>
                          {item.unqualifiedRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        {item.trend === "down" ? (
                          <div className="flex items-center gap-1 text-success">
                            <TrendingDown className="h-4 w-4" />
                            <span className="text-xs">下降</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs">上升</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: 按滤盒类型统计 - 2条数据线 */}
        <TabsContent value="type" className="space-y-4">
          <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
              <div className="grid flex-1 gap-1">
                <CardTitle>滤盒类型趋势</CardTitle>
                <CardDescription>
                  {timeRangeLabels[typeTimeRange]}KN95与KN100检测数据对比，共 {filteredTypeData.length} 条记录
                </CardDescription>
              </div>
              <Select value={typeTimeRange} onValueChange={(v) => setTypeTimeRange(v as TimeRange)}>
                <SelectTrigger
                  className="w-[160px] rounded-lg sm:ml-auto"
                  aria-label="选择时间范围"
                >
                  <SelectValue placeholder="选择时间范围" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    最近 90 天
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    最近 30 天
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    最近 7 天
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
              <ChartContainer
                config={typeChartConfig}
                className="aspect-auto h-[300px] w-full"
              >
                <AreaChart data={filteredTypeData}>
                  <defs>
                    <linearGradient id="fillKN95" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-KN95)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-KN95)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="fillKN100" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-KN100)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-KN100)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString("zh-CN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                        }}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="KN95"
                    type="natural"
                    fill="url(#fillKN95)"
                    stroke="var(--color-KN95)"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="KN100"
                    type="natural"
                    fill="url(#fillKN100)"
                    stroke="var(--color-KN100)"
                    strokeWidth={2}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* 区队排名表格 */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">区队不合格率排名</h2>
            <div className="rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-12 pl-6 w-16">排名</TableHead>
                    <TableHead className="h-12">区队名称</TableHead>
                    <TableHead className="h-12">检测总数</TableHead>
                    <TableHead className="h-12">合格次数</TableHead>
                    <TableHead className="h-12">不合格次数</TableHead>
                    <TableHead className="h-12">不合格率</TableHead>
                    <TableHead className="h-12 w-24">趋势</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamRankingData.map((item) => (
                    <TableRow key={item.teamName}>
                      <TableCell className="py-3 pl-6">
                        <div className={`
                          flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold
                          ${item.rank === 1 ? 'bg-warning/10 text-warning' : ''}
                          ${item.rank === 2 ? 'bg-muted text-muted-foreground' : ''}
                          ${item.rank === 3 ? 'bg-chart-3/10 text-chart-3' : ''}
                          ${item.rank > 3 ? 'bg-muted/50 text-muted-foreground' : ''}
                        `}>
                          {item.rank}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 font-medium">{item.teamName}</TableCell>
                      <TableCell className="py-3">{item.totalCount}</TableCell>
                      <TableCell className="py-3 text-success">{item.qualifiedCount}</TableCell>
                      <TableCell className="py-3 text-destructive">{item.unqualifiedCount}</TableCell>
                      <TableCell className="py-3">
                        <Badge className={getUnqualifiedRateBadge(item.unqualifiedRate)}>
                          {item.unqualifiedRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        {item.trend === "down" ? (
                          <div className="flex items-center gap-1 text-success">
                            <TrendingDown className="h-4 w-4" />
                            <span className="text-xs">下降</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-destructive">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-xs">上升</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
