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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mockDeviceParamConfigs, type DeviceParamConfig } from "@/lib/mocks/data";
import { Pencil, Save, RotateCcw, Settings, Info } from "lucide-react";

export default function DeviceParamPage() {
  const [configs, setConfigs] = useState<DeviceParamConfig[]>(mockDeviceParamConfigs);

  // 弹窗状态
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<DeviceParamConfig | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    paramValue: "",
    description: "",
  });

  // 统计
  const totalCount = configs.length;

  // 打开编辑弹窗
  const openEditDialog = (config: DeviceParamConfig) => {
    setEditingConfig(config);
    setFormData({
      paramValue: config.paramValue,
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
              paramValue: formData.paramValue,
              description: formData.description,
              updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
            }
          : c
      )
    );

    setIsEditDialogOpen(false);
    toast.success("参数修改成功");
  };

  // 重置为默认值
  const handleReset = (config: DeviceParamConfig) => {
    const original = mockDeviceParamConfigs.find((c) => c.id === config.id);
    if (original) {
      setConfigs(
        configs.map((c) =>
          c.id === config.id
            ? {
                ...original,
                updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
              }
            : c
        )
      );
      toast.success("已重置为默认值");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* KPI 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              参数总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              可配置参数数量
            </p>
          </CardContent>
        </Card>
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-warning mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-medium">注意事项</p>
                <ul className="mt-1 space-y-0.5 text-muted-foreground">
                  <li>• 修改参数将影响所有设备的运行</li>
                  <li>• 参数修改后立即生效</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 参数表格 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12">参数名称</TableHead>
              <TableHead className="h-12">参数键</TableHead>
              <TableHead className="h-12">参数值</TableHead>
              <TableHead className="h-12">说明</TableHead>
              <TableHead className="h-12">最后修改</TableHead>
              <TableHead className="h-12 w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Settings className="h-4 w-4 text-primary" />
                    </div>
                    {config.paramName}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {config.paramKey}
                  </code>
                </TableCell>
                <TableCell className="py-3">
                  <span className="font-mono">{config.paramValue}</span>
                </TableCell>
                <TableCell className="py-3 text-muted-foreground">{config.description}</TableCell>
                <TableCell className="py-3">{config.updatedAt}</TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(config)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReset(config)} title="重置">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
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
            <DialogTitle>编辑参数 - {editingConfig?.paramName}</DialogTitle>
            <DialogDescription>修改设备参数配置</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>参数键</Label>
              <Input value={editingConfig?.paramKey || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>参数值</Label>
              <Input
                value={formData.paramValue}
                onChange={(e) => setFormData({ ...formData, paramValue: e.target.value })}
              />
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
