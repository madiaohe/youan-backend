"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

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

// 日数据（最近7天）
const dailyData = [
  { date: "06-05", detection: 198, recycle: 55, dispense: 65 },
  { date: "06-06", detection: 134, recycle: 35, dispense: 38 },
  { date: "06-07", detection: 178, recycle: 48, dispense: 60 },
  { date: "06-08", detection: 145, recycle: 41, dispense: 42 },
  { date: "06-09", detection: 167, recycle: 38, dispense: 55 },
  { date: "06-10", detection: 189, recycle: 52, dispense: 48 },
  { date: "06-11", detection: 156, recycle: 45, dispense: 50 },
];

// 月数据（最近6个月）
const monthlyData = [
  { date: "2026-01", detection: 4230, recycle: 1250, dispense: 1320 },
  { date: "2026-02", detection: 3890, recycle: 1100, dispense: 1180 },
  { date: "2026-03", detection: 4560, recycle: 1380, dispense: 1450 },
  { date: "2026-04", detection: 5120, recycle: 1520, dispense: 1580 },
  { date: "2026-05", detection: 4780, recycle: 1420, dispense: 1490 },
  { date: "2026-06", detection: 4350, recycle: 1290, dispense: 1360 },
];

// 年数据（最近3年）
const yearlyData = [
  { date: "2024", detection: 48520, recycle: 14520, dispense: 15230 },
  { date: "2025", detection: 52180, recycle: 15680, dispense: 16450 },
  { date: "2026", detection: 28930, recycle: 8650, dispense: 9120 },
];

type TimeDimension = "day" | "month" | "year";

interface ChartTrendProps {
  className?: string;
}

export function ChartTrend({ className }: ChartTrendProps) {
  const [dimension, setDimension] = useState<TimeDimension>("day");

  // 根据维度获取数据
  const getData = () => {
    switch (dimension) {
      case "day":
        return dailyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
    }
  };

  const data = getData();

  // 维度选项
  const dimensionOptions: { value: TimeDimension; label: string }[] = [
    { value: "day", label: "日" },
    { value: "month", label: "月" },
    { value: "year", label: "年" },
  ];

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          趋势分析
        </CardTitle>
        <div className="flex border rounded-lg p-0.5">
          {dimensionOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 h-7 text-sm rounded",
                dimension === option.value && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => setDimension(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
