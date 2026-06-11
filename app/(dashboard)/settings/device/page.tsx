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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { mockDeviceParamConfigs, type DeviceParamConfig } from "@/lib/mocks/data";
import { Pencil, Save, RotateCcw, Settings } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">设备参数配置</h1>
          <p className="text-muted-foreground">配置系统设备的运行参数</p>
        </div>
      </div>

      {/* 说明卡片 */}
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900">注意事项</h3>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• 修改参数将影响所有设备的运行，请谨慎操作</li>
              <li>• 参数修改后立即生效，无需重启设备</li>
              <li>• 如不确定参数含义，请联系技术人员</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 参数表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>参数名称</TableHead>
              <TableHead>参数键</TableHead>
              <TableHead>参数值</TableHead>
              <TableHead>说明</TableHead>
              <TableHead>最后修改</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.id}>
                <TableCell className="font-medium">{config.paramName}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {config.paramKey}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="font-mono">{config.paramValue}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{config.description}</TableCell>
                <TableCell>{config.updatedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(config)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleReset(config)} title="重置">
                      <RotateCcw className="h-4 w-4" />
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
