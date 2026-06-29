"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
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
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 图表配置
const chartConfig = {
  detection: {
    label: "检测数量",
    color: "var(--chart-1)",
  },
  recycle: {
    label: "回收数量",
    color: "var(--chart-2)",
  },
  dispense: {
    label: "发放数量",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

// 生成模拟数据
function generateDailyData(days: number) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    data.push({
      date: dateStr,
      fullDate: date.toISOString().split('T')[0],
      detection: Math.floor(Math.random() * 150) + 80,
      recycle: Math.floor(Math.random() * 50) + 20,
      dispense: Math.floor(Math.random() * 60) + 30,
    });
  }

  return data;
}

type TimeRange = "7d" | "30d" | "90d";

interface ChartTrendProps {
  className?: string;
}

export function ChartTrend({ className }: ChartTrendProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  // 预生成所有数据
  const allData = useMemo(() => ({
    "7d": generateDailyData(7),
    "30d": generateDailyData(30),
    "90d": generateDailyData(90),
  }), []);

  // 根据时间范围获取数据
  const data = useMemo(() => {
    return allData[timeRange];
  }, [timeRange, allData]);

  // 时间范围选项
  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "过去七天" },
    { value: "30d", label: "过去一个月" },
    { value: "90d", label: "过去三个月" },
  ];

  // 格式化日期显示
  const tickFormatter = (value: string) => {
    return value;
  };

  // 计算 X 轴刻度间隔
  const getTickInterval = () => {
    switch (timeRange) {
      case "7d":
        return 0; // 显示所有
      case "30d":
        return 6; // 每7天显示一个
      case "90d":
        return 14; // 约每两周显示一个
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            趋势分析
          </CardTitle>
          <CardDescription>
            {timeRange === "7d" && "过去七天数据趋势"}
            {timeRange === "30d" && "过去一个月数据趋势"}
            {timeRange === "90d" && "过去三个月数据趋势"}
          </CardDescription>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value as TimeRange)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[500px]/card:flex"
          >
            <ToggleGroupItem value="7d">过去七天</ToggleGroupItem>
            <ToggleGroupItem value="30d">过去一个月</ToggleGroupItem>
            <ToggleGroupItem value="90d">过去三个月</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger
              className="flex w-36 @[500px]/card:hidden"
              size="sm"
              aria-label="选择时间范围"
            >
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                过去七天
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                过去一个月
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                过去三个月
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillDetection" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-detection)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-detection)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRecycle" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-recycle)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-recycle)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDispense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-dispense)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-dispense)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={tickFormatter}
              interval={getTickInterval()}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
              labelFormatter={(value, payload) => {
                if (payload && payload[0]?.payload?.fullDate) {
                  return payload[0].payload.fullDate;
                }
                return value;
              }}
            />
            <Area
              type="monotone"
              dataKey="detection"
              stroke="var(--color-detection)"
              fill="url(#fillDetection)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="recycle"
              stroke="var(--color-recycle)"
              fill="url(#fillRecycle)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="dispense"
              stroke="var(--color-dispense)"
              fill="url(#fillDispense)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
