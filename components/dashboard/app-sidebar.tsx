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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Shield,
  Users,
  FlaskConical,
  Recycle,
  Server,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  User,
  Bell,
  CreditCard,
  MoreVertical,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

// 菜单配置
const menuItems = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    url: "/",
    isSingle: true,
  },
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
      { title: "呼吸阻力检测参数设置", url: "/detection/params" },
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

// 用户数据
const userData = {
  name: "管理员",
  email: "admin@example.com",
  role: "超级管理员",
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [username, setUsername] = useState(userData.name);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUsername =
      localStorage.getItem("username") ||
      sessionStorage.getItem("username") ||
      userData.name;
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              tooltip="滤盒管理系统"
            >
              <Link href="/">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  滤
                </div>
                <span className="text-base font-semibold">滤盒管理系统</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menu) => {
                // 单个菜单项（工作台）
                if (menu.isSingle && menu.url) {
                  return (
                    <SidebarMenuItem key={menu.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === menu.url}
                        tooltip={menu.title}
                      >
                        <Link href={menu.url}>
                          <menu.icon className="h-4 w-4" />
                          <span>{menu.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // 带子菜单的菜单项
                const isActive = menu.items?.some(item => pathname === item.url);
                return (
                  <SidebarMenuCollapsible
                    key={menu.title}
                    title={menu.title}
                    icon={<menu.icon className="h-4 w-4" />}
                    isActive={isActive}
                  >
                    {menu.items?.map((item) => (
                      <SidebarMenuCollapsibleItem
                        key={item.url}
                        title={item.title}
                        url={item.url}
                        isActive={pathname === item.url}
                      />
                    ))}
                  </SidebarMenuCollapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={username}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                      {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{username}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {userData.email}
                    </span>
                  </div>
                  <MoreVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{username}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    个人信息
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    账户设置
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    通知设置
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
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
