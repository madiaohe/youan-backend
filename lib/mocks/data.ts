// Mock 管理员数据
export interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
  status: "启用" | "禁用";
  createdAt: string;
  lastLogin: string | null;
}

export const mockAdmins: Admin[] = [
  {
    id: "1",
    username: "admin",
    name: "张三",
    role: "超级管理员",
    status: "启用",
    createdAt: "2024-01-01 10:00:00",
    lastLogin: "2024-06-11 09:30:00",
  },
  {
    id: "2",
    username: "user01",
    name: "李四",
    role: "普通管理员",
    status: "启用",
    createdAt: "2024-02-15 14:20:00",
    lastLogin: "2024-06-10 16:45:00",
  },
  {
    id: "3",
    username: "user02",
    name: "王五",
    role: "普通管理员",
    status: "禁用",
    createdAt: "2024-03-20 09:15:00",
    lastLogin: null,
  },
  {
    id: "4",
    username: "user03",
    name: "赵六",
    role: "数据查看员",
    status: "启用",
    createdAt: "2024-04-10 11:30:00",
    lastLogin: "2024-06-09 14:20:00",
  },
  {
    id: "5",
    username: "user04",
    name: "钱七",
    role: "数据查看员",
    status: "启用",
    createdAt: "2024-05-05 16:00:00",
    lastLogin: "2024-06-08 10:10:00",
  },
];

// Mock 角色数据
export interface Role {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  createdAt: string;
  status: "启用" | "禁用";
  permissions: string[];
}

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "超级管理员",
    description: "拥有所有权限",
    permissionCount: 12,
    createdAt: "2024-01-01 10:00:00",
    status: "启用",
    permissions: [
      "permission", "permission:admin", "permission:role", "permission:log",
      "employee", "employee:info", "employee:face", "employee:team",
      "detection", "detection:params", "detection:records", "detection:export",
      "recycle", "recycle:pending", "recycle:records", "recycle:waiting",
      "device", "device:detector", "device:dispenser", "device:wms",
      "report", "report:stats", "report:ranking", "report:screen",
      "log", "log:operation", "log:detection", "log:ai",
      "settings", "settings:admin", "settings:device", "settings:ui",
    ],
  },
  {
    id: "2",
    name: "普通管理员",
    description: "日常运维管理",
    permissionCount: 8,
    createdAt: "2024-01-01 10:00:00",
    status: "启用",
    permissions: [
      "permission", "permission:admin", "permission:role",
      "employee", "employee:info", "employee:team",
      "detection", "detection:records",
      "recycle", "recycle:records",
      "device", "device:detector",
      "report", "report:stats",
    ],
  },
  {
    id: "3",
    name: "数据查看员",
    description: "仅查看报表数据",
    permissionCount: 3,
    createdAt: "2024-02-15 14:00:00",
    status: "启用",
    permissions: [
      "report", "report:stats", "report:ranking",
    ],
  },
];

// Mock 操作日志数据
export interface OperationLog {
  id: string;
  operator: string;
  operationType: string;
  operationModule: string;
  operationContent: string;
  operationTime: string;
  ipAddress: string;
}

export const mockOperationLogs: OperationLog[] = [
  {
    id: "1",
    operator: "admin",
    operationType: "登录",
    operationModule: "系统",
    operationContent: "登录系统成功",
    operationTime: "2024-06-11 10:30:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    operator: "admin",
    operationType: "新增",
    operationModule: "员工管理",
    operationContent: "新增员工：张三",
    operationTime: "2024-06-11 10:25:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "3",
    operator: "user01",
    operationType: "导出",
    operationModule: "检测管理",
    operationContent: "导出检测记录Excel",
    operationTime: "2024-06-11 09:15:00",
    ipAddress: "192.168.1.2",
  },
  {
    id: "4",
    operator: "admin",
    operationType: "编辑",
    operationModule: "权限管理",
    operationContent: "修改角色权限：普通管理员",
    operationTime: "2024-06-10 16:45:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "5",
    operator: "user01",
    operationType: "删除",
    operationModule: "员工管理",
    operationContent: "删除员工：李四",
    operationTime: "2024-06-10 15:30:00",
    ipAddress: "192.168.1.2",
  },
  {
    id: "6",
    operator: "admin",
    operationType: "登录",
    operationModule: "系统",
    operationContent: "登录系统成功",
    operationTime: "2024-06-10 09:00:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "7",
    operator: "user03",
    operationType: "导出",
    operationModule: "报表统计",
    operationContent: "导出检测统计报表PDF",
    operationTime: "2024-06-09 14:20:00",
    ipAddress: "192.168.1.3",
  },
  {
    id: "8",
    operator: "admin",
    operationType: "新增",
    operationModule: "权限管理",
    operationContent: "新增管理员：user05",
    operationTime: "2024-06-09 11:00:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "9",
    operator: "user01",
    operationType: "编辑",
    operationModule: "检测管理",
    operationContent: "修改检测参数：流量阈值",
    operationTime: "2024-06-08 16:30:00",
    ipAddress: "192.168.1.2",
  },
  {
    id: "10",
    operator: "admin",
    operationType: "导入",
    operationModule: "员工管理",
    operationContent: "批量导入员工信息：50条",
    operationTime: "2024-06-08 10:15:00",
    ipAddress: "192.168.1.1",
  },
];

// 菜单权限结构
export interface MenuPermission {
  id: string;
  name: string;
  children?: MenuPermission[];
}

export const menuPermissions: MenuPermission[] = [
  {
    id: "permission",
    name: "权限管理",
    children: [
      { id: "permission:admin", name: "管理员列表" },
      { id: "permission:role", name: "角色管理" },
      { id: "permission:log", name: "管理员日志" },
    ],
  },
  {
    id: "employee",
    name: "员工管理",
    children: [
      { id: "employee:info", name: "员工信息维护" },
      { id: "employee:face", name: "人脸识别管理" },
      { id: "employee:team", name: "区队管理" },
    ],
  },
  {
    id: "detection",
    name: "检测管理",
    children: [
      { id: "detection:params", name: "呼吸阻力检测参数设置" },
      { id: "detection:records", name: "检测记录查询" },
      { id: "detection:export", name: "检测日志导出" },
    ],
  },
  {
    id: "recycle",
    name: "回收管理",
    children: [
      { id: "recycle:pending", name: "待回收滤盒数据" },
      { id: "recycle:records", name: "回收记录查询" },
      { id: "recycle:waiting", name: "待领用滤盒数据" },
    ],
  },
  {
    id: "device",
    name: "设备管理",
    children: [
      { id: "device:detector", name: "检测回收柜管理" },
      { id: "device:dispenser", name: "自助发放柜管理" },
      { id: "device:wms", name: "WMS数据同步" },
    ],
  },
  {
    id: "report",
    name: "报表与统计分析",
    children: [
      { id: "report:stats", name: "滤盒检测数据统计" },
      { id: "report:ranking", name: "区队不合格率排名" },
      { id: "report:screen", name: "大屏展示配置" },
    ],
  },
  {
    id: "log",
    name: "日志管理",
    children: [
      { id: "log:operation", name: "操作日志" },
      { id: "log:detection", name: "检测与回收日志" },
      { id: "log:ai", name: "AI推荐面罩日志" },
    ],
  },
  {
    id: "settings",
    name: "系统设置",
    children: [
      { id: "settings:admin", name: "管理员账户管理" },
      { id: "settings:device", name: "设备参数配置" },
      { id: "settings:ui", name: "界面与通知配置" },
    ],
  },
];

// 操作类型枚举
export const operationTypes = ["登录", "登出", "新增", "编辑", "删除", "导出", "导入"];

// 操作模块枚举
export const operationModules = [
  "系统",
  "权限管理",
  "员工管理",
  "检测管理",
  "回收管理",
  "设备管理",
  "报表统计",
  "日志管理",
  "系统设置",
];
