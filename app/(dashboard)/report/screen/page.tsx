"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockScreenConfigs, type ScreenConfig } from "@/lib/mocks/data";
import { Plus, Pencil, Monitor, Eye, Info } from "lucide-react";

// 可选展示项
const availableShowItems = [
  { id: "detectionStats", name: "检测数据统计" },
  { id: "teamRanking", name: "区队不合格率排名" },
  { id: "realtimeStatus", name: "实时检测状态" },
  { id: "deviceStatus", name: "设备运行状态" },
  { id: "recentRecords", name: "最近检测记录" },
  { id: "stockInfo", name: "库存信息" },
];

export default function ScreenConfigPage() {
  const [configs, setConfigs] = useState<ScreenConfig[]>(mockScreenConfigs);

  // 弹窗状态
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ScreenConfig | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    refreshInterval: 30,
    showItems: [] as string[],
  });

  // 统计
  const totalCount = configs.length;
  const enabledCount = configs.filter((c) => c.enabled).length;

  // 打开新增弹窗
  const openAddDialog = () => {
    setFormData({ name: "", refreshInterval: 30, showItems: ["detectionStats", "teamRanking"] });
    setIsAddDialogOpen(true);
  };

  // 打开编辑弹窗
  const openEditDialog = (config: ScreenConfig) => {
    setEditingConfig(config);
    setFormData({
      name: config.name,
      refreshInterval: config.refreshInterval,
      showItems: config.showItems,
    });
    setIsEditDialogOpen(true);
  };

  // 切换展示项
  const toggleShowItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      showItems: prev.showItems.includes(itemId)
        ? prev.showItems.filter((id) => id !== itemId)
        : [...prev.showItems, itemId],
    }));
  };

  // 新增配置
  const handleAdd = () => {
    if (!formData.name) {
      toast.error("请填写大屏名称");
      return;
    }
    if (formData.showItems.length === 0) {
      toast.error("请至少选择一个展示项");
      return;
    }

    const newConfig: ScreenConfig = {
      id: Date.now().toString(),
      name: formData.name,
      enabled: true,
      refreshInterval: formData.refreshInterval,
      showItems: formData.showItems,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setConfigs([...configs, newConfig]);
    setIsAddDialogOpen(false);
    toast.success("大屏配置添加成功");
  };

  // 编辑配置
  const handleEdit = () => {
    if (!editingConfig) return;

    setConfigs(
      configs.map((c) =>
        c.id === editingConfig.id
          ? { ...c, ...formData }
          : c
      )
    );
    setIsEditDialogOpen(false);
    toast.success("大屏配置修改成功");
  };

  // 切换启用状态
  const toggleEnabled = (config: ScreenConfig) => {
    setConfigs(
      configs.map((c) =>
        c.id === config.id
          ? { ...c, enabled: !c.enabled }
          : c
      )
    );
    toast.success(config.enabled ? "已停用大屏" : "已启用大屏");
  };

  // 获取展示项名称
  const getShowItemNames = (ids: string[]) => {
    return ids
      .map((id) => availableShowItems.find((item) => item.id === id)?.name)
      .filter(Boolean)
      .join("、");
  };

  // 预览大屏
  const handlePreview = (config: ScreenConfig) => {
    toast.success(`正在打开 ${config.name} 预览...`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              配置总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              大屏配置数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已启用
            </CardTitle>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {totalCount > 0 ? Math.round((enabledCount / totalCount) * 100) : 0}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-green-600">{enabledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              正在运行的大屏
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              已停用
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-gray-500">{totalCount - enabledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              未启用的大屏
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 说明卡片 */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">配置说明</p>
              <ul className="space-y-0.5 text-blue-600">
                <li>• 大屏配置用于在工厂大屏上展示检测数据和统计信息</li>
                <li>• 可配置刷新间隔，建议 10-60 秒</li>
                <li>• 可选择多个展示项，系统会自动布局</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 工具栏 */}
      <div className="flex items-center justify-end pt-2">
        <Button size="sm" onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增配置
        </Button>
      </div>

      {/* 配置表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12">大屏名称</TableHead>
              <TableHead className="h-12">状态</TableHead>
              <TableHead className="h-12">刷新间隔</TableHead>
              <TableHead className="h-12">展示内容</TableHead>
              <TableHead className="h-12">创建时间</TableHead>
              <TableHead className="h-12 w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.length > 0 ? (
              configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Monitor className="h-4 w-4 text-primary" />
                      </div>
                      {config.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={() => toggleEnabled(config)}
                    />
                  </TableCell>
                  <TableCell className="py-3">{config.refreshInterval} 秒</TableCell>
                  <TableCell className="py-3">
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {getShowItemNames(config.showItems)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{config.createdAt}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => handlePreview(config)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(config)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
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
        共 {configs.length} 个大屏配置
      </div>

      {/* 新增弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新增大屏配置</DialogTitle>
            <DialogDescription>配置大屏展示内容和刷新频率</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>大屏名称</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：主入口大屏"
              />
            </div>
            <div className="space-y-2">
              <Label>刷新间隔（秒）</Label>
              <Select
                value={formData.refreshInterval.toString()}
                onValueChange={(v) => setFormData({ ...formData, refreshInterval: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 秒</SelectItem>
                  <SelectItem value="30">30 秒</SelectItem>
                  <SelectItem value="60">60 秒</SelectItem>
                  <SelectItem value="120">2 分钟</SelectItem>
                  <SelectItem value="300">5 分钟</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>展示内容</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableShowItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={item.id}
                      checked={formData.showItems.includes(item.id)}
                      onCheckedChange={() => toggleShowItem(item.id)}
                    />
                    <Label htmlFor={item.id} className="cursor-pointer text-sm">
                      {item.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button onClick={handleAdd}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑大屏配置 - {editingConfig?.name}</DialogTitle>
            <DialogDescription>修改大屏配置信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>大屏名称</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>刷新间隔（秒）</Label>
              <Select
                value={formData.refreshInterval.toString()}
                onValueChange={(v) => setFormData({ ...formData, refreshInterval: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 秒</SelectItem>
                  <SelectItem value="30">30 秒</SelectItem>
                  <SelectItem value="60">60 秒</SelectItem>
                  <SelectItem value="120">2 分钟</SelectItem>
                  <SelectItem value="300">5 分钟</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>展示内容</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableShowItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`edit-${item.id}`}
                      checked={formData.showItems.includes(item.id)}
                      onCheckedChange={() => toggleShowItem(item.id)}
                    />
                    <Label htmlFor={`edit-${item.id}`} className="cursor-pointer text-sm">
                      {item.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
