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
import { toast } from "sonner";
import { mockUIConfigs, type UIConfig } from "@/lib/mocks/data";
import { Pencil, Save, Bell, Palette, Settings, Monitor, Upload, Volume2 } from "lucide-react";

export default function UIConfigPage() {
  const [configs, setConfigs] = useState<UIConfig[]>(mockUIConfigs);

  // 弹窗状态
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<UIConfig | null>(null);

  // 大屏待机内容状态
  const [screenSaverVideo, setScreenSaverVideo] = useState<File | null>(null);
  const [screenSaverImage, setScreenSaverImage] = useState<File | null>(null);
  const [alarmSoundFile, setAlarmSoundFile] = useState<File | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    configValue: "",
    description: "",
  });

  // 统计
  const totalCount = configs.length;
  const interfaceCount = configs.filter((c) => !isSwitchConfig(c.configKey)).length;
  const notificationCount = configs.filter((c) => isSwitchConfig(c.configKey) && c.configKey !== "recycle_remind_days").length;

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
  function isSwitchConfig(key: string) {
    return key.includes("notification") || key.includes("captcha") || key.includes("alarm_sound");
  }

  // 处理视频上传
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("请上传视频文件");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("视频文件大小不能超过100MB");
        return;
      }
      setScreenSaverVideo(file);
      toast.success(`已选择视频：${file.name}`);
    }
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("请上传图片文件");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("图片文件大小不能超过10MB");
        return;
      }
      setScreenSaverImage(file);
      toast.success(`已选择图片：${file.name}`);
    }
  };

  // 处理音频上传
  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("audio/")) {
        toast.error("请上传音频文件");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("音频文件大小不能超过5MB");
        return;
      }
      setAlarmSoundFile(file);
      toast.success(`已选择音频：${file.name}`);
    }
  };

  // 保存大屏待机内容
  const handleSaveScreenSaver = () => {
    toast.success("大屏待机内容已保存");
    setScreenSaverVideo(null);
    setScreenSaverImage(null);
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
              系统配置项数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              界面配置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-blue-600">{interfaceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              界面显示相关配置
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              通知配置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-purple-600">{notificationCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              通知开关配置
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 界面配置卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">界面配置</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10">配置名称</TableHead>
                <TableHead className="h-10">配置键</TableHead>
                <TableHead className="h-10">配置值</TableHead>
                <TableHead className="h-10">说明</TableHead>
                <TableHead className="h-10 w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs
                .filter((c) => !isSwitchConfig(c.configKey))
                .map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="py-2.5 font-medium">{config.configName}</TableCell>
                    <TableCell className="py-2.5">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {config.configKey}
                      </code>
                    </TableCell>
                    <TableCell className="py-2.5">{config.configValue}</TableCell>
                    <TableCell className="py-2.5 text-muted-foreground">{config.description}</TableCell>
                    <TableCell className="py-2.5">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(config)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 通知配置卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-base">通知配置</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10">配置名称</TableHead>
                <TableHead className="h-10">配置键</TableHead>
                <TableHead className="h-10">状态</TableHead>
                <TableHead className="h-10">说明</TableHead>
                <TableHead className="h-10 w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs
                .filter((c) => isSwitchConfig(c.configKey) && c.configKey !== "recycle_remind_days")
                .map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="py-2.5 font-medium">{config.configName}</TableCell>
                    <TableCell className="py-2.5">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {config.configKey}
                      </code>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Switch
                        checked={config.configValue === "true"}
                        onCheckedChange={() => toggleSwitch(config)}
                      />
                    </TableCell>
                    <TableCell className="py-2.5 text-muted-foreground">{config.description}</TableCell>
                    <TableCell className="py-2.5">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(config)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 大屏待机内容配置 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-cyan-500" />
            <CardTitle className="text-base">大屏待机内容</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 待机视频 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <Label>待机视频</Label>
              </div>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {screenSaverVideo ? screenSaverVideo.name : "点击上传视频"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持MP4格式，最大100MB
                  </p>
                </label>
              </div>
              {screenSaverVideo && (
                <Button size="sm" className="w-full" onClick={handleSaveScreenSaver}>
                  <Save className="mr-2 h-4 w-4" />
                  保存视频
                </Button>
              )}
            </div>

            {/* 待机图片 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label>待机图片</Label>
              </div>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {screenSaverImage ? screenSaverImage.name : "点击上传图片"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持JPG/PNG格式，最大10MB
                  </p>
                </label>
              </div>
              {screenSaverImage && (
                <Button size="sm" className="w-full" onClick={handleSaveScreenSaver}>
                  <Save className="mr-2 h-4 w-4" />
                  保存图片
                </Button>
              )}
            </div>

            {/* 报警提示音 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label>报警提示音</Label>
              </div>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleSoundUpload}
                  className="hidden"
                  id="sound-upload"
                />
                <label htmlFor="sound-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {alarmSoundFile ? alarmSoundFile.name : "点击上传音频"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持MP3/WAV格式，最大5MB
                  </p>
                </label>
              </div>
              {alarmSoundFile && (
                <Button size="sm" className="w-full" onClick={() => {
                  toast.success("报警提示音已保存");
                  setAlarmSoundFile(null);
                }}>
                  <Save className="mr-2 h-4 w-4" />
                  保存音频
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            <p className="font-medium">说明</p>
            <ul className="mt-1 space-y-0.5">
              <li>• 大屏待机时优先播放视频，若无视频则显示图片</li>
              <li>• 报警提示音在设备故障或异常时播放</li>
              <li>• 上传后将自动替换原有内容</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 其他配置卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-base">其他配置</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10">配置名称</TableHead>
                <TableHead className="h-10">配置键</TableHead>
                <TableHead className="h-10">配置值</TableHead>
                <TableHead className="h-10">说明</TableHead>
                <TableHead className="h-10 w-16">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs
                .filter((c) => c.configKey === "recycle_remind_days")
                .map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="py-2.5 font-medium">{config.configName}</TableCell>
                    <TableCell className="py-2.5">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {config.configKey}
                      </code>
                    </TableCell>
                    <TableCell className="py-2.5">{config.configValue} 天</TableCell>
                    <TableCell className="py-2.5 text-muted-foreground">{config.description}</TableCell>
                    <TableCell className="py-2.5">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(config)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑弹窗 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑配置 - {editingConfig?.configName}</DialogTitle>
            <DialogDescription>修改系统配置</DialogDescription>
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
