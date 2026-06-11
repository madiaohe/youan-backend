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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { mockDetectionParams, type DetectionParam } from "@/lib/mocks/data";
import { Pencil, Save, RotateCcw } from "lucide-react";

export default function DetectionParamsPage() {
  const [params, setParams] = useState<DetectionParam[]>(mockDetectionParams);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<DetectionParam | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    minValue: 0,
    maxValue: 0,
    description: "",
  });

  // 打开编辑弹窗
  const openEditDialog = (param: DetectionParam) => {
    setEditingParam(param);
    setFormData({
      minValue: param.minValue,
      maxValue: param.maxValue,
      description: param.description,
    });
    setIsEditDialogOpen(true);
  };

  // 保存编辑
  const handleSave = () => {
    if (!editingParam) return;

    if (formData.minValue >= formData.maxValue) {
      toast.error("最小值必须小于最大值");
      return;
    }

    setParams(
      params.map((p) =>
        p.id === editingParam.id
          ? {
              ...p,
              minValue: formData.minValue,
              maxValue: formData.maxValue,
              description: formData.description,
              updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
              updatedBy: "admin",
            }
          : p
      )
    );

    setIsEditDialogOpen(false);
    toast.success("参数修改成功");
  };

  // 重置为默认值
  const handleReset = (param: DetectionParam) => {
    const original = mockDetectionParams.find((p) => p.id === param.id);
    if (original) {
      setParams(
        params.map((p) =>
          p.id === param.id
            ? {
                ...original,
                updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
                updatedBy: "admin",
              }
            : p
        )
      );
      toast.success("已重置为默认值");
    }
  };

  // 获取参数类型标签
  const getParamTypeBadge = (code: string) => {
    if (code.includes("MAX")) {
      return <Badge variant="destructive">上限</Badge>;
    } else if (code.includes("MIN")) {
      return <Badge variant="secondary">下限</Badge>;
    } else {
      return <Badge variant="outline">常规</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">呼吸阻力检测参数设置</h1>
          <p className="text-muted-foreground">配置检测设备的标准参数阈值</p>
        </div>
      </div>

      {/* 参数说明 */}
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-medium text-blue-900 mb-2">参数说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 吸气阻力：员工吸气时的阻力范围，超出范围视为不合格</li>
          <li>• 呼气阻力：员工呼气时的阻力范围，超出范围视为不合格</li>
          <li>• 检测流量：标准检测时的气体流量范围</li>
          <li>• 检测时长：单次检测的最短和最长持续时间</li>
        </ul>
      </div>

      {/* 参数表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>参数名称</TableHead>
              <TableHead>参数编码</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>最小值</TableHead>
              <TableHead>最大值</TableHead>
              <TableHead>单位</TableHead>
              <TableHead>说明</TableHead>
              <TableHead>最后修改</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {params.map((param) => (
              <TableRow key={param.id}>
                <TableCell className="font-medium">{param.name}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    {param.code}
                  </code>
                </TableCell>
                <TableCell>{getParamTypeBadge(param.code)}</TableCell>
                <TableCell>{param.minValue}</TableCell>
                <TableCell>{param.maxValue}</TableCell>
                <TableCell>{param.unit}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {param.description}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{param.updatedAt}</div>
                    <div className="text-muted-foreground">by {param.updatedBy}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(param)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReset(param)}
                      title="重置为默认值"
                    >
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
            <DialogTitle>编辑参数 - {editingParam?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minValue">最小值</Label>
                <Input
                  id="edit-minValue"
                  type="number"
                  value={formData.minValue}
                  onChange={(e) =>
                    setFormData({ ...formData, minValue: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxValue">最大值</Label>
                <Input
                  id="edit-maxValue"
                  type="number"
                  value={formData.maxValue}
                  onChange={(e) =>
                    setFormData({ ...formData, maxValue: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unit">单位</Label>
              <Input id="edit-unit" value={editingParam?.unit || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">参数说明</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
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
