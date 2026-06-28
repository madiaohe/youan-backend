"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlaskConical,
  CheckCircle2,
  Recycle,
  Server,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  AlertCircle,
} from "lucide-react";
import { ChartTrend } from "@/components/dashboard/chart-trend";
import {
  mockDetectionStats,
  mockPendingRecycles,
  mockDetectorDevices,
  mockDispenserDevices,
  mockSensorStatuses,
  type PendingRecycle,
} from "@/lib/mocks/data";

// 待处理事项类型
interface PendingItem {
  id: string;
  type: "待回收" | "设备告警" | "库存预警";
  content: string;
  time: string;
  action: string;
}

export default function DashboardPage() {
  // 计算今日统计数据
  const todayStats = mockDetectionStats[0]; // 假设第一条是今天
  const yesterdayStats = mockDetectionStats[1]; // 假设第二条是昨天

  // 今日检测数变化
  const detectionChange = yesterdayStats
    ? (((todayStats.totalCount - yesterdayStats.totalCount) / yesterdayStats.totalCount) * 100).toFixed(0)
    : "0";

  // 合格率
  const qualifiedRate = ((todayStats.qualifiedCount / todayStats.totalCount) * 100).toFixed(1);
  const yesterdayQualifiedRate = yesterdayStats
    ? ((yesterdayStats.qualifiedCount / yesterdayStats.totalCount) * 100).toFixed(1)
    : qualifiedRate;
  const rateChange = (parseFloat(qualifiedRate) - parseFloat(yesterdayQualifiedRate)).toFixed(1);

  // 待回收数
  const pendingRecycleCount = mockPendingRecycles.length;
  const overdueCount = mockPendingRecycles.filter((r) => r.status === "已超期").length;

  // 设备在线率
  const allDevices = [...mockDetectorDevices, ...mockDispenserDevices];
  const onlineDevices = allDevices.filter((d) => d.status === "在线").length;
  const totalDevices = allDevices.length;
  const deviceOnlineRate = ((onlineDevices / totalDevices) * 100).toFixed(0);

  // KPI 数据
  const kpiData = [
    {
      title: "今日检测",
      value: todayStats.totalCount,
      change: detectionChange,
      trend: parseFloat(detectionChange) >= 0 ? "up" : "down",
      icon: FlaskConical,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "合格率",
      value: `${qualifiedRate}%`,
      change: rateChange.startsWith("-") ? rateChange : `+${rateChange}%`,
      trend: parseFloat(rateChange) >= 0 ? "up" : "down",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "待回收",
      value: pendingRecycleCount,
      change: overdueCount > 0 ? `${overdueCount}个已超期` : "",
      trend: "neutral",
      icon: Recycle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "设备在线率",
      value: `${deviceOnlineRate}%`,
      change: `${onlineDevices}/${totalDevices}`,
      trend: "neutral",
      icon: Server,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  // 构建待处理事项列表
  const pendingItems: PendingItem[] = [];

  // 添加待回收滤盒
  mockPendingRecycles.slice(0, 4).forEach((item: PendingRecycle) => {
    pendingItems.push({
      id: `recycle-${item.id}`,
      type: "待回收",
      content: `${item.filterBoxCode} ${item.employeeName} (${item.teamName})`,
      time: item.expireDate,
      action: "查看",
    });
  });

  // 添加设备告警（传感器异常）
  mockSensorStatuses
    .filter((s) => s.status === "异常" || s.status === "离线")
    .slice(0, 3)
    .forEach((sensor) => {
      // 查找设备名称
      const device = mockDetectorDevices.find((d) => d.id === sensor.deviceId);
      const deviceName = device?.name || sensor.deviceId;
      pendingItems.push({
        id: `sensor-${sensor.id}`,
        type: "设备告警",
        content: `${deviceName} ${sensor.sensorName} ${sensor.status === "异常" ? "异常" : "离线"}`,
        time: sensor.lastUpdateTime.split(" ")[1] || sensor.lastUpdateTime,
        action: "处理",
      });
    });

  // 添加库存预警
  mockDispenserDevices
    .filter((d) => d.stockCount < d.capacity * 0.3) // 库存低于30%预警
    .slice(0, 3)
    .forEach((device) => {
      pendingItems.push({
        id: `stock-${device.id}`,
        type: "库存预警",
        content: `${device.name} 库存不足 (${device.stockCount}/${device.capacity})`,
        time: device.lastHeartbeat.split(" ")[1] || device.lastHeartbeat,
        action: "补货",
      });
    });

  // 获取类型对应的图标和颜色
  const getTypeStyle = (type: PendingItem["type"]) => {
    switch (type) {
      case "待回收":
        return { icon: Recycle, color: "text-warning", bgColor: "bg-warning/10" };
      case "设备告警":
        return { icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" };
      case "库存预警":
        return { icon: Package, color: "text-warning", bgColor: "bg-warning/10" };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* KPI 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-success"
                        : stat.trend === "down"
                        ? "text-destructive"
                        : ""
                    }
                  >
                    {stat.change}
                  </span>
                  {stat.trend !== "neutral" && <span>较昨日</span>}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 趋势图表 */}
      <ChartTrend />

      {/* 待处理事项 */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5 text-primary" />
          待处理事项
        </h2>
        <Card>
          <CardContent className="p-0">
            <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 w-24">类型</TableHead>
                <TableHead className="h-10">内容</TableHead>
                <TableHead className="h-10 w-28">时间</TableHead>
                <TableHead className="h-10 w-20 text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingItems.length > 0 ? (
                pendingItems.slice(0, 10).map((item) => {
                  const style = getTypeStyle(item.type);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${style.bgColor}`}>
                            <style.icon className={`h-3.5 w-3.5 ${style.color}`} />
                          </div>
                          <span className="font-medium text-sm">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-sm">{item.content}</TableCell>
                      <TableCell className="py-3 text-sm text-muted-foreground">
                        {item.time}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          {item.action}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    暂无待处理事项
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
