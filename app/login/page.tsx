"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { User, Lock, Phone, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // 账号密码登录状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 手机验证码登录状态
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [phoneRememberMe, setPhoneRememberMe] = useState(false);

  // 获取验证码倒计时
  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      toast.error("请输入正确的手机号");
      return;
    }

    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast.success("验证码已发送");
  };

  // 账号密码登录
  const handlePasswordLogin = () => {
    if (!username) {
      toast.error("请输入用户名");
      return;
    }
    if (!password) {
      toast.error("请输入密码");
      return;
    }

    // Mock 登录成功
    if (rememberMe) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", username);
    }

    toast.success("登录成功");
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  // 手机验证码登录
  const handleCodeLogin = () => {
    if (!phone || phone.length !== 11) {
      toast.error("请输入正确的手机号");
      return;
    }
    if (!code || code.length !== 6) {
      toast.error("请输入6位验证码");
      return;
    }

    // Mock 登录成功
    if (phoneRememberMe) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("phone", phone);
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("phone", phone);
    }

    toast.success("登录成功");
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Toaster position="top-center" />

      {/* Logo 和标题 */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-primary-foreground text-2xl font-bold">滤</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">滤盒全生命周期管理系统</h1>
      </div>

      {/* 登录卡片 */}
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">欢迎登录</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password">账号密码登录</TabsTrigger>
              <TabsTrigger value="phone">手机验证码登录</TabsTrigger>
            </TabsList>

            {/* 账号密码登录 */}
            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名/工号</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="请输入用户名或工号"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    记住我
                  </Label>
                </div>
              </div>

              <Button className="w-full" onClick={handlePasswordLogin}>
                登 录
              </Button>

              <div className="text-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  忘记密码？
                </a>
              </div>
            </TabsContent>

            {/* 手机验证码登录 */}
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={11}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">验证码</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="code"
                      type="text"
                      placeholder="请输入验证码"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      maxLength={6}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={countdown > 0}
                    className="whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : "获取验证码"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="phoneRemember"
                    checked={phoneRememberMe}
                    onCheckedChange={(checked) => setPhoneRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="phoneRemember" className="text-sm cursor-pointer">
                    记住我
                  </Label>
                </div>
              </div>

              <Button className="w-full" onClick={handleCodeLogin}>
                登 录
              </Button>

              <div className="text-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  忘记密码？
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 版权信息 */}
      <p className="mt-8 text-sm text-muted-foreground">
        © 2024 囿安滤盒全生命周期管理系统
      </p>
    </div>
  );
}
