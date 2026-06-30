"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Settings, RefreshCw, TrendingUp, Package, AlertTriangle, Users, Timer } from "lucide-react";

// ========== 图表数据 ==========

const companyMonthlyData = [
  { month: "1月", 领用: 245, 回收: 238, 判废: 45 },
  { month: "2月", 领用: 252, 回收: 248, 判废: 52 },
  { month: "3月", 领用: 260, 回收: 255, 判废: 48 },
  { month: "4月", 领用: 278, 回收: 270, 判废: 61 },
  { month: "5月", 领用: 285, 回收: 278, 判废: 55 },
  { month: "6月", 领用: 295, 回收: 288, 判废: 67 },
];

const teamConsumptionData = [
  { team: "机电队", 领用: 42, 回收: 40, 判废: 8, 使用寿命: 32.5 },
  { team: "通风队", 领用: 38, 回收: 36, 判废: 7, 使用寿命: 30.8 },
  { team: "采煤一队", 领用: 55, 回收: 52, 判废: 12, 使用寿命: 28.4 },
  { team: "采煤二队", 领用: 52, 回收: 50, 判废: 11, 使用寿命: 27.9 },
  { team: "掘进一队", 领用: 48, 回收: 46, 判废: 10, 使用寿命: 26.3 },
  { team: "掘进二队", 领用: 45, 回收: 43, 判废: 9, 使用寿命: 24.6 },
  { team: "运输队", 领用: 35, 回收: 33, 判废: 6, 使用寿命: 29.1 },
  { team: "机电二队", 领用: 40, 回收: 38, 判废: 7, 使用寿命: 31.2 },
];

const chartConfig = {
  领用: { label: "领用数量", color: "var(--chart-1)" },
  回收: { label: "回收数量", color: "var(--chart-2)" },
  判废: { label: "判废数量", color: "var(--chart-3)" },
  使用寿命: { label: "使用寿命", color: "var(--chart-4)" },
} satisfies ChartConfig;

const availableMetrics = [
  { id: "dispense", name: "领用数量", icon: Package },
  { id: "recycle", name: "回收数量", icon: RefreshCw },
  { id: "scrap", name: "判废数量", icon: AlertTriangle },
  { id: "lifespan", name: "使用寿命", icon: TrendingUp },
];

const refreshOptions = [
  { value: "10", label: "10 秒" },
  { value: "30", label: "30 秒" },
  { value: "60", label: "1 分钟" },
  { value: "120", label: "2 分钟" },
  { value: "300", label: "5 分钟" },
];

export default function ScreenDisplayPage() {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [selectedMetrics, setSelectedMetrics] = useState(["dispense", "recycle", "scrap"]);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(now);
    setLastUpdate(now);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(refreshData, refreshInterval * 1000);
    return () => clearInterval(timer);
  }, [refreshInterval, refreshData, mounted]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metricId)
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const totalStats = {
    totalDispense: teamConsumptionData.reduce((sum, t) => sum + t.领用, 0),
    totalRecycle: teamConsumptionData.reduce((sum, t) => sum + t.回收, 0),
    totalScrap: teamConsumptionData.reduce((sum, t) => sum + t.判废, 0),
    avgLifespan: (teamConsumptionData.reduce((sum, t) => sum + t.使用寿命, 0) / teamConsumptionData.length).toFixed(1),
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--:--";
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">滤盒消耗规律分析大屏</h1>
          <p className="text-muted-foreground text-sm">公司整体及各区队滤盒消耗数据实时展示</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span>上次更新: {formatTime(lastUpdate)}</span>
          </div>

          <div className="text-lg font-mono font-medium text-primary">
            {formatTime(currentTime)}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>展示设置</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 px-6 pb-6">
                <div className="space-y-3">
                  <Label>刷新频率</Label>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(v) => setRefreshInterval(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {refreshOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>展示指标</Label>
                  <div className="space-y-2">
                    {availableMetrics.map(metric => (
                      <div key={metric.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                        <Checkbox
                          id={metric.id}
                          checked={selectedMetrics.includes(metric.id)}
                          onCheckedChange={() => toggleMetric(metric.id)}
                        />
                        <Label htmlFor={metric.id} className="cursor-pointer flex items-center gap-2">
                          <metric.icon className="h-4 w-4" />
                          {metric.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={refreshData} className="w-full" disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  立即刷新
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月领用总量</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-info">{totalStats.totalDispense}</div>
            <p className="text-xs text-muted-foreground mt-1">个滤盒</p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月回收总量</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-success">{totalStats.totalRecycle}</div>
            <p className="text-xs text-muted-foreground mt-1">个滤盒</p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">本月判废总量</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-warning">{totalStats.totalScrap}</div>
            <p className="text-xs text-muted-foreground mt-1">个滤盒</p>
          </CardContent>
        </Card>

        <Card className="@container/card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均使用寿命</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-primary">{totalStats.avgLifespan}</div>
            <p className="text-xs text-muted-foreground mt-1">天</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要图表区域 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              公司整体月度消耗趋势
            </CardTitle>
            <CardDescription>按月统计滤盒的领用、回收和判废数量</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <LineChart data={companyMonthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                {selectedMetrics.includes("dispense") && (
                  <Line type="monotone" dataKey="领用" stroke="var(--color-领用)" strokeWidth={2} dot={{ fill: "var(--color-领用)", r: 4 }} />
                )}
                {selectedMetrics.includes("recycle") && (
                  <Line type="monotone" dataKey="回收" stroke="var(--color-回收)" strokeWidth={2} dot={{ fill: "var(--color-回收)", r: 4 }} />
                )}
                {selectedMetrics.includes("scrap") && (
                  <Line type="monotone" dataKey="判废" stroke="var(--color-判废)" strokeWidth={2} dot={{ fill: "var(--color-判废)", r: 4 }} />
                )}
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              区队消耗排名
            </CardTitle>
            <CardDescription>按判废数量排名</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...teamConsumptionData]
                .sort((a, b) => b.判废 - a.判废)
                .slice(0, 6)
                .map((team, index) => (
                  <div key={team.team} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{team.team}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{team.判废} 个</span>
                    </div>
                    <Progress value={(team.判废 / 15) * 100} className="h-2" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 区队详细图表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            各区队判废趋势对比
          </CardTitle>
          <CardDescription>各区队判废数量柱状图对比</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={teamConsumptionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="team" tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              {selectedMetrics.includes("scrap") && (
                <Bar dataKey="判废" fill="var(--color-判废)" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 底部信息 */}
      <Card>
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="h-4 w-4" />
            <span>数据每 {refreshInterval} 秒自动刷新</span>
          </div>
          <span className="text-sm text-muted-foreground">滤盒全生命周期管理系统 · 数据仅供展示</span>
        </CardContent>
      </Card>
    </div>
  );
}
