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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { mockScreenConfigs, type ScreenConfig } from "@/lib/mocks/data";
import { Plus, Pencil, Monitor, Eye } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">大屏展示配置</h1>
          <p className="text-muted-foreground">配置数据大屏展示内容和刷新频率</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          新增配置
        </Button>
      </div>

      {/* 说明卡片 */}
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-medium text-blue-900 mb-2">配置说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 大屏配置用于在工厂大屏上展示检测数据和统计信息</li>
          <li>• 可配置刷新间隔，建议 10-60 秒</li>
          <li>• 可选择多个展示项，系统会自动布局</li>
          <li>• 停用后大屏将停止更新数据</li>
        </ul>
      </div>

      {/* 配置表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>大屏名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>刷新间隔</TableHead>
              <TableHead>展示内容</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    {config.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => toggleEnabled(config)}
                  />
                </TableCell>
                <TableCell>{config.refreshInterval} 秒</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate text-sm text-muted-foreground">
                    {getShowItemNames(config.showItems)}
                  </div>
                </TableCell>
                <TableCell>{config.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(config)}
                      title="预览"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(config)}
                      title="编辑"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
