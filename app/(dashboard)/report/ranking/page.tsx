"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { mockTeams } from "@/lib/mocks/data";
import { Search, RotateCcw, TrendingUp, BarChart3, LineChart } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// ========== 图表数据 ==========

// 滤盒判废趋势数据（按月）
const scrapTrendData = [
  { month: "2024-01", 判废数量: 45 },
  { month: "2024-02", 判废数量: 52 },
  { month: "2024-03", 判废数量: 48 },
  { month: "2024-04", 判废数量: 61 },
  { month: "2024-05", 判废数量: 55 },
  { month: "2024-06", 判废数量: 67 },
];

// 判废趋势图配置
const scrapTrendChartConfig = {
  判废数量: {
    label: "判废数量",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// 区队平均滤盒使用寿命数据（从领用到判废天数）
const lifespanData = [
  { team: "机电队", 平均天数: 32.5 },
  { team: "通风队", 平均天数: 30.8 },
  { team: "采煤一队", 平均天数: 28.4 },
  { team: "采煤二队", 平均天数: 27.9 },
  { team: "掘进一队", 平均天数: 26.3 },
  { team: "掘进二队", 平均天数: 24.6 },
];

// 使用寿命图表配置
const lifespanChartConfig = {
  平均天数: {
    label: "平均使用天数",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// 预测未来消耗量数据（历史 + 预测）
const predictionChartData = [
  { month: "2024-01", 实际消耗: 45, 预测消耗: null },
  { month: "2024-02", 实际消耗: 52, 预测消耗: null },
  { month: "2024-03", 实际消耗: 48, 预测消耗: null },
  { month: "2024-04", 实际消耗: 61, 预测消耗: null },
  { month: "2024-05", 实际消耗: 55, 预测消耗: null },
  { month: "2024-06", 实际消耗: 67, 预测消耗: null },
  { month: "2024-07", 实际消耗: null, 预测消耗: 70 },
  { month: "2024-08", 实际消耗: null, 预测消耗: 73 },
  { month: "2024-09", 实际消耗: null, 预测消耗: 68 },
];

// 预测图表配置
const predictionChartConfig = {
  实际消耗: {
    label: "实际消耗",
    color: "var(--chart-1)",
  },
  预测消耗: {
    label: "预测消耗",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// 预测统计数据
const predictionData = {
  nextMonth: 70,
  nextQuarter: 210,
  confidence: 88,
};

export default function TeamRankingPage() {
  // 筛选条件
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();

  // 重置筛选
  const handleResetFilter = () => {
    setFilterTeam("all");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
  };

  // 执行筛选
  const handleSearch = () => {
    const filterDesc = [];
    if (filterTeam !== "all") {
      const teamName = mockTeams.find(t => t.id === filterTeam)?.name;
      filterDesc.push(`区队: ${teamName}`);
    }
    if (filterStartDate) {
      filterDesc.push(`开始: ${filterStartDate.toLocaleDateString()}`);
    }
    if (filterEndDate) {
      filterDesc.push(`结束: ${filterEndDate.toLocaleDateString()}`);
    }

    if (filterDesc.length > 0) {
      toast.success(`筛选条件: ${filterDesc.join(", ")}`);
    } else {
      toast.info("已显示全部数据");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具栏 */}
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
        <Button size="sm" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleResetFilter}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* 1. 滤盒判废趋势图（按时间序列） - Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <LineChart className="h-5 w-5 text-primary" />
            滤盒判废趋势图
          </CardTitle>
          <CardDescription>按月统计滤盒的判废数量变化趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={scrapTrendChartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart accessibilityLayer data={scrapTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillScrap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-判废数量)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-判废数量)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="判废数量"
                stroke="var(--color-判废数量)"
                fill="url(#fillScrap)"
                strokeWidth={2}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 2. 区队平均滤盒使用寿命 & 3. 预测未来消耗量 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 区队平均滤盒使用寿命 - Horizontal Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-chart-2" />
              区队平均滤盒使用寿命
            </CardTitle>
            <CardDescription>从领用到判废的平均使用天数（按区队排名）</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lifespanChartConfig} className="aspect-auto h-[280px] w-full">
              <BarChart
                accessibilityLayer
                data={lifespanData}
                layout="vertical"
                margin={{ left: 12, right: 32 }}
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  tickFormatter={(value) => `${value}天`}
                />
                <YAxis
                  dataKey="team"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  width={80}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Bar
                  dataKey="平均天数"
                  fill="var(--color-平均天数)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* 预测未来消耗量 - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-chart-3" />
              预测未来消耗量
            </CardTitle>
            <CardDescription>基于历史数据预测未来3个月的滤盒消耗量</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={predictionChartConfig} className="aspect-auto h-[280px] w-full">
              <RechartsLineChart
                accessibilityLayer
                data={predictionChartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                {/* 预测分界线 */}
                <ReferenceLine
                  x="2024-06"
                  stroke="var(--border)"
                  strokeDasharray="5 5"
                />
                <Line
                  dataKey="实际消耗"
                  type="monotone"
                  stroke="var(--color-实际消耗)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-实际消耗)", r: 4 }}
                />
                <Line
                  dataKey="预测消耗"
                  type="monotone"
                  stroke="var(--color-预测消耗)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "var(--color-预测消耗)", r: 4 }}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </RechartsLineChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted p-2.5">
                <p className="text-xs text-muted-foreground">下月预测</p>
                <p className="text-base font-bold text-chart-2">{predictionData.nextMonth}个</p>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <p className="text-xs text-muted-foreground">下季度预测</p>
                <p className="text-base font-bold text-chart-3">{predictionData.nextQuarter}个</p>
              </div>
              <div className="rounded-lg bg-muted p-2.5">
                <p className="text-xs text-muted-foreground">预测置信度</p>
                <p className="text-base font-bold">{predictionData.confidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
