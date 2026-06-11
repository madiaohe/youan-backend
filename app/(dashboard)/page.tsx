"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FlaskConical,
  Recycle,
  Server,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
  // Mock 统计数据
  const stats = [
    {
      title: "今日检测",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: FlaskConical,
      color: "text-blue-500",
    },
    {
      title: "合格率",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "待回收",
      value: "23",
      change: "-5",
      trend: "down",
      icon: Recycle,
      color: "text-orange-500",
    },
    {
      title: "设备在线",
      value: "8/10",
      change: "",
      trend: "neutral",
      icon: Server,
      color: "text-purple-500",
    },
  ];

  // Mock 最近检测记录
  const recentDetections = [
    { id: 1, name: "张三", team: "采煤一队", type: "KN95", result: "合格", time: "10:30" },
    { id: 2, name: "李四", team: "采煤二队", type: "KN100", result: "不合格", time: "10:25" },
    { id: 3, name: "王五", team: "掘进一队", type: "KN95", result: "合格", time: "10:20" },
    { id: 4, name: "赵六", team: "机电队", type: "KN95", result: "合格", time: "10:15" },
    { id: 5, name: "钱七", team: "通风队", type: "KN100", result: "合格", time: "10:10" },
  ];

  // Mock 告警信息
  const alerts = [
    { id: 1, message: "回收箱 A1 已满，请及时清理", time: "09:45", type: "warning" },
    { id: 2, message: "设备 D03 离线，请检查网络连接", time: "09:30", type: "error" },
    { id: 3, message: "检测参数已更新", time: "09:00", type: "info" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {stat.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
                  <span className={stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : ""}>
                    {stat.change}
                  </span>
                  <span>较昨日</span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 最近检测记录 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              最近检测记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDetections.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.team} · {record.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={record.result === "合格" ? "default" : "destructive"}>
                      {record.result}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {record.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 系统告警 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              系统告警
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 border-b pb-2 last:border-0"
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      alert.type === "error"
                        ? "bg-red-500"
                        : alert.type === "warning"
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
