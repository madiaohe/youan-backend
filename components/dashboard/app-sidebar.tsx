"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  FlaskConical,
  Recycle,
  Server,
  BarChart3,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";

// 菜单配置
const menuItems = [
  {
    title: "权限管理",
    icon: Shield,
    items: [
      { title: "管理员列表", url: "/permission/admin" },
      { title: "角色管理", url: "/permission/role" },
      { title: "管理员日志", url: "/permission/log" },
    ],
  },
  {
    title: "员工管理",
    icon: Users,
    items: [
      { title: "员工信息维护", url: "/employee/info" },
      { title: "人脸识别管理", url: "/employee/face" },
      { title: "区队管理", url: "/employee/team" },
    ],
  },
  {
    title: "检测管理",
    icon: FlaskConical,
    items: [
      { title: "检测参数设置", url: "/detection/params" },
      { title: "检测记录查询", url: "/detection/records" },
      { title: "检测日志导出", url: "/detection/export" },
    ],
  },
  {
    title: "回收管理",
    icon: Recycle,
    items: [
      { title: "待回收滤盒数据", url: "/recycle/pending" },
      { title: "回收记录查询", url: "/recycle/records" },
      { title: "待领用滤盒数据", url: "/recycle/waiting" },
    ],
  },
  {
    title: "设备管理",
    icon: Server,
    items: [
      { title: "检测回收柜管理", url: "/device/detector" },
      { title: "自助发放柜管理", url: "/device/dispenser" },
      { title: "WMS数据同步", url: "/device/wms" },
    ],
  },
  {
    title: "报表与统计分析",
    icon: BarChart3,
    items: [
      { title: "检测数据统计", url: "/report/stats" },
      { title: "区队不合格率排名", url: "/report/ranking" },
      { title: "大屏展示配置", url: "/report/screen" },
    ],
  },
  {
    title: "日志管理",
    icon: FileText,
    items: [
      { title: "操作日志", url: "/log/operation" },
      { title: "检测与回收日志", url: "/log/detection" },
      { title: "AI推荐面罩日志", url: "/log/ai" },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    items: [
      { title: "管理员账户管理", url: "/settings/admin" },
      { title: "设备参数配置", url: "/settings/device" },
      { title: "界面与通知配置", url: "/settings/ui" },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("admin");

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") ||
      sessionStorage.getItem("username") ||
      "admin";
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    toast.success("已退出登录");
    router.push("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">滤</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">滤盒管理系统</span>
            <span className="text-xs text-muted-foreground">后台管理</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>功能菜单</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menu) => (
                <Collapsible key={menu.title} asChild defaultOpen={menu.items.some(item => pathname === item.url)}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={menu.title}>
                        <menu.icon className="h-4 w-4" />
                        <span>{menu.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {menu.items.map((item) => (
                          <SidebarMenuSubItem key={item.url}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === item.url}
                            >
                              <Link href={item.url}>
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{username}</span>
                    <span className="text-xs text-muted-foreground">超级管理员</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    在线
                  </Badge>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  个人信息
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
