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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  mockDetectionDeviceParams,
  type DetectionDeviceParams,
} from "@/lib/mocks/data";
import { Settings2, Pencil, Gauge, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

// 默认参数值
const DEFAULT_PARAMS = {
  flowRate: 85, // L/min
  kn95Threshold: 300, // Pa
  kn100Threshold: 350, // Pa
};

export default function DetectionParamsPage() {
  // 设备参数列表
  const [deviceParams, setDeviceParams] = useState<DetectionDeviceParams[]>(
    mockDetectionDeviceParams
  );

  // 分页状态
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // 分页数据
  const pageCount = Math.ceil(deviceParams.length / pageSize);
  const paginatedParams = deviceParams.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // 编辑对话框
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DetectionDeviceParams | null>(null);
  const [editFlowRate, setEditFlowRate] = useState(DEFAULT_PARAMS.flowRate);
  const [editKn95Threshold, setEditKn95Threshold] = useState(DEFAULT_PARAMS.kn95Threshold);
  const [editKn100Threshold, setEditKn100Threshold] = useState(DEFAULT_PARAMS.kn100Threshold);

  // 打开编辑对话框
  const handleEdit = (device: DetectionDeviceParams) => {
    setEditingDevice(device);
    setEditFlowRate(device.flowRate);
    setEditKn95Threshold(device.kn95Threshold);
    setEditKn100Threshold(device.kn100Threshold);
    setEditDialogOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingDevice) return;

    setDeviceParams((prev) =>
      prev.map((d) =>
        d.deviceId === editingDevice.deviceId
          ? {
              ...d,
              flowRate: editFlowRate,
              kn95Threshold: editKn95Threshold,
              kn100Threshold: editKn100Threshold,
              updatedAt: new Date().toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).replace(/\//g, "-"),
            }
          : d
      )
    );
    setEditDialogOpen(false);
    toast.success(`已保存 ${editingDevice.deviceName} 的参数设置`);
  };

  // 重置为默认值
  const handleResetToDefault = () => {
    setEditFlowRate(DEFAULT_PARAMS.flowRate);
    setEditKn95Threshold(DEFAULT_PARAMS.kn95Threshold);
    setEditKn100Threshold(DEFAULT_PARAMS.kn100Threshold);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 表格区域 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-12">设备名称</TableHead>
              <TableHead className="h-12">流量设定 (L/min)</TableHead>
              <TableHead className="h-12">KN95压差阈值 (Pa)</TableHead>
              <TableHead className="h-12">KN100压差阈值 (Pa)</TableHead>
              <TableHead className="h-12">更新时间</TableHead>
              <TableHead className="h-12 w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedParams.map((device) => (
              <TableRow key={device.deviceId}>
                <TableCell className="py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Settings2 className="h-4 w-4 text-primary" />
                    </div>
                    {device.deviceName}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="secondary" className="font-mono">
                    {device.flowRate}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className="font-mono">
                    {device.kn95Threshold}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="default" className="font-mono">
                    {device.kn100Threshold}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-muted-foreground text-sm">
                  {device.updatedAt}
                </TableCell>
                <TableCell className="py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(device)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-between">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          共 {deviceParams.length} 条记录
        </div>
        <div className="flex w-full items-center gap-6 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm">
              每页行数
            </Label>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPageIndex(0);
              }}
            >
              <SelectTrigger size="sm" className="w-16" id="rows-per-page">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            第 {pageIndex + 1} / {pageCount || 1} 页
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">首页</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">上一页</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">下一页</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setPageIndex(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">末页</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              参数设置 - {editingDevice?.deviceName}
            </DialogTitle>
            <DialogDescription>
              调整设备的流量设定和压差阈值参数
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 流量设定 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">流量设定</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
                    {editFlowRate}
                  </Badge>
                  <span className="text-muted-foreground">L/min</span>
                </div>
              </div>
              <Slider
                min={60}
                max={120}
                step={5}
                value={[editFlowRate]}
                onValueChange={(value) => setEditFlowRate(value[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>60 L/min</span>
                <span>默认: 85 L/min</span>
                <span>120 L/min</span>
              </div>
            </div>

            {/* 压差阈值 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">压差阈值设置</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* KN95 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-semibold">KN95</Badge>
                    <span className="text-xs text-muted-foreground">标准型</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editKn95Threshold}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setEditKn95Threshold(value);
                        }
                      }}
                      className="flex-1 text-center font-mono"
                      min={0}
                      max={1000}
                    />
                    <span className="text-muted-foreground text-sm shrink-0">Pa</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    默认 {DEFAULT_PARAMS.kn95Threshold} Pa
                  </p>
                </div>

                {/* KN100 */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="font-semibold">KN100</Badge>
                    <span className="text-xs text-muted-foreground">高防护</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editKn100Threshold}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0) {
                          setEditKn100Threshold(value);
                        }
                      }}
                      className="flex-1 text-center font-mono"
                      min={0}
                      max={1000}
                    />
                    <span className="text-muted-foreground text-sm shrink-0">Pa</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    默认 {DEFAULT_PARAMS.kn100Threshold} Pa
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleResetToDefault}>
              重置为默认值
            </Button>
            <Button onClick={handleSaveEdit}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
