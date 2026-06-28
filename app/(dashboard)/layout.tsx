"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

// 菜单路径映射
const menuMap: Record<string, { title: string; parent?: string }> = {
  // 工作台
  "/": { title: "工作台" },
  // 权限管理
  "/permission/admin": { title: "管理员列表", parent: "权限管理" },
  "/permission/role": { title: "角色管理", parent: "权限管理" },
  "/permission/log": { title: "管理员日志", parent: "权限管理" },
  // 员工管理
  "/employee/info": { title: "员工信息维护", parent: "员工管理" },
  "/employee/face": { title: "人脸识别管理", parent: "员工管理" },
  "/employee/team": { title: "区队管理", parent: "员工管理" },
  // 检测管理
  "/detection/params": { title: "呼吸阻力检测参数设置", parent: "检测管理" },
  "/detection/records": { title: "检测记录查询", parent: "检测管理" },
  "/detection/export": { title: "检测日志导出", parent: "检测管理" },
  // 回收管理
  "/recycle/pending": { title: "待回收滤盒数据", parent: "回收管理" },
  "/recycle/records": { title: "回收记录查询", parent: "回收管理" },
  "/recycle/waiting": { title: "待领用滤盒数据", parent: "回收管理" },
  // 设备管理
  "/device/detector": { title: "检测回收柜管理", parent: "设备管理" },
  "/device/dispenser": { title: "自助发放柜管理", parent: "设备管理" },
  "/device/wms": { title: "WMS数据同步", parent: "设备管理" },
  // 报表与统计分析
  "/report/stats": { title: "检测数据统计", parent: "报表与统计分析" },
  "/report/ranking": { title: "区队不合格率排名", parent: "报表与统计分析" },
  "/report/screen": { title: "大屏展示配置", parent: "报表与统计分析" },
  // 日志管理
  "/log/operation": { title: "操作日志", parent: "日志管理" },
  "/log/detection": { title: "检测与回收日志", parent: "日志管理" },
  "/log/ai": { title: "AI推荐面罩日志", parent: "日志管理" },
  // 系统设置
  "/settings/admin": { title: "管理员账户管理", parent: "系统设置" },
  "/settings/device": { title: "设备参数配置", parent: "系统设置" },
  "/settings/ui": { title: "界面与通知配置", parent: "系统设置" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 获取当前页面的面包屑信息
  const currentPage = menuMap[pathname];
  const isHomePage = pathname === "/";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {isHomePage ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>首页</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    {currentPage?.parent && (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <span className="text-muted-foreground">{currentPage.parent}</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </>
                    )}
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPage?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
        <Toaster position="top-center" />
      </SidebarProvider>
    </TooltipProvider>
  );
}
