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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
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
import { toast } from "sonner";
import { mockUIConfigs, type UIConfig } from "@/lib/mocks/data";
import { Pencil, Save, Bell, Palette } from "lucide-react";

export default function UIConfigPage() {
  const [configs, setConfigs] = useState<UIConfig[]>(mockUIConfigs);

  // 弹窗状态
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<UIConfig | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    configValue: "",
    description: "",
  });

  // 打开编辑弹窗
  const openEditDialog = (config: UIConfig) => {
    setEditingConfig(config);
    setFormData({
      configValue: config.configValue,
      description: config.description,
    });
    setIsEditDialogOpen(true);
  };

  // 保存编辑
  const handleSave = () => {
    if (!editingConfig) return;

    setConfigs(
      configs.map((c) =>
        c.id === editingConfig.id
          ? {
              ...c,
              configValue: formData.configValue,
              description: formData.description,
            }
          : c
      )
    );

    setIsEditDialogOpen(false);
    toast.success("配置修改成功");
  };

  // 切换开关配置
  const toggleSwitch = (config: UIConfig) => {
    const newValue = config.configValue === "true" ? "false" : "true";
    setConfigs(
      configs.map((c) =>
        c.id === config.id ? { ...c, configValue: newValue } : c
      )
    );
    toast.success(`已${newValue === "true" ? "启用" : "禁用"}${config.configName}`);
  };

  // 判断是否为开关类型
  const isSwitchConfig = (key: string) => {
    return key.includes("notification") || key.includes("captcha");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">界面与通知配置</h1>
          <p className="text-muted-foreground">配置系统界面显示和通知设置</p>
        </div>
      </div>

      {/* 界面配置卡片 */}
      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center gap-2">
          <Palette className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-medium">界面配置</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>配置名称</TableHead>
              <TableHead>配置键</TableHead>
              <TableHead>配置值</TableHead>
              <TableHead>说明</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs
              .filter((c) => !isSwitchConfig(c.configKey))
              .map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.configName}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {config.configKey}
                    </code>
                  </TableCell>
                  <TableCell>{config.configValue}</TableCell>
                  <TableCell className="text-muted-foreground">{config.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(config)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* 通知配置卡片 */}
      <div className="rounded-md border">
        <div className="p-4 border-b flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-medium">通知配置</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>配置名称</TableHead>
              <TableHead>配置键</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>说明</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs
              .filter((c) => isSwitchConfig(c.configKey) && c.configKey !== "recycle_remind_days")
              .map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.configName}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {config.configKey}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={config.configValue === "true"}
                      onCheckedChange={() => toggleSwitch(config)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{config.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(config)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* 其他配置卡片 */}
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <h2 className="font-medium">其他配置</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>配置名称</TableHead>
              <TableHead>配置键</TableHead>
              <TableHead>配置值</TableHead>
              <TableHead>说明</TableHead>
              <TableHead className="w-20">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs
              .filter((c) => c.configKey === "recycle_remind_days")
              .map((config) => (
                <TableRow key={config.id}>
                  <TableCell className="font-medium">{config.configName}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {config.configKey}
                    </code>
                  </TableCell>
                  <TableCell>{config.configValue} 天</TableCell>
                  <TableCell className="text-muted-foreground">{config.description}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(config)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* 编辑弹窗 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑配置 - {editingConfig?.configName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>配置键</Label>
              <Input value={editingConfig?.configKey || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>配置值</Label>
              {editingConfig && isSwitchConfig(editingConfig.configKey) ? (
                <Select
                  value={formData.configValue}
                  onValueChange={(v) => setFormData({ ...formData, configValue: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">启用</SelectItem>
                    <SelectItem value="false">禁用</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.configValue}
                  onChange={(e) => setFormData({ ...formData, configValue: e.target.value })}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>说明</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
