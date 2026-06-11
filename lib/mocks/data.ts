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

// ========== 员工管理相关 ==========

// Mock 区队数据
export interface Team {
  id: string;
  code: string;
  name: string;
  employeeCount: number;
  leader: string;
  leaderPhone: string;
  createdAt: string;
  status: "启用" | "禁用";
}

export const mockTeams: Team[] = [
  {
    id: "1",
    code: "T001",
    name: "采煤一队",
    employeeCount: 25,
    leader: "张队长",
    leaderPhone: "13800138001",
    createdAt: "2024-01-01",
    status: "启用",
  },
  {
    id: "2",
    code: "T002",
    name: "采煤二队",
    employeeCount: 18,
    leader: "李队长",
    leaderPhone: "13800138002",
    createdAt: "2024-01-01",
    status: "启用",
  },
  {
    id: "3",
    code: "T003",
    name: "掘进一队",
    employeeCount: 12,
    leader: "王队长",
    leaderPhone: "13800138003",
    createdAt: "2024-01-15",
    status: "启用",
  },
  {
    id: "4",
    code: "T004",
    name: "掘进二队",
    employeeCount: 15,
    leader: "赵队长",
    leaderPhone: "13800138004",
    createdAt: "2024-02-01",
    status: "启用",
  },
  {
    id: "5",
    code: "T005",
    name: "机电队",
    employeeCount: 8,
    leader: "钱队长",
    leaderPhone: "13800138005",
    createdAt: "2024-02-15",
    status: "启用",
  },
  {
    id: "6",
    code: "T006",
    name: "通风队",
    employeeCount: 10,
    leader: "孙队长",
    leaderPhone: "13800138006",
    createdAt: "2024-03-01",
    status: "启用",
  },
];

// Mock 员工数据
export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  teamId: string;
  teamName: string;
  phone: string;
  cardNo: string;
  hasFace: boolean;
  faceLoginEnabled: boolean;
  facePhoto?: string;
  faceCreatedAt?: string;
  status: "启用" | "禁用";
  createdAt: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "1",
    employeeId: "E001",
    name: "张三",
    teamId: "1",
    teamName: "采煤一队",
    phone: "13800001001",
    cardNo: "C00123456",
    hasFace: true,
    faceLoginEnabled: true,
    facePhoto: "/avatars/face-1.jpg",
    faceCreatedAt: "2024-06-01",
    status: "启用",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    employeeId: "E002",
    name: "李四",
    teamId: "1",
    teamName: "采煤一队",
    phone: "13800001002",
    cardNo: "C00123457",
    hasFace: false,
    faceLoginEnabled: false,
    status: "启用",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    employeeId: "E003",
    name: "王五",
    teamId: "2",
    teamName: "采煤二队",
    phone: "13800001003",
    cardNo: "C00123458",
    hasFace: true,
    faceLoginEnabled: false,
    facePhoto: "/avatars/face-3.jpg",
    faceCreatedAt: "2024-05-15",
    status: "禁用",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    employeeId: "E004",
    name: "赵六",
    teamId: "2",
    teamName: "采煤二队",
    phone: "13800001004",
    cardNo: "C00123459",
    hasFace: true,
    faceLoginEnabled: true,
    facePhoto: "/avatars/face-4.jpg",
    faceCreatedAt: "2024-05-20",
    status: "启用",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    employeeId: "E005",
    name: "钱七",
    teamId: "3",
    teamName: "掘进一队",
    phone: "13800001005",
    cardNo: "C00123460",
    hasFace: false,
    faceLoginEnabled: false,
    status: "启用",
    createdAt: "2024-02-15",
  },
  {
    id: "6",
    employeeId: "E006",
    name: "孙八",
    teamId: "3",
    teamName: "掘进一队",
    phone: "13800001006",
    cardNo: "C00123461",
    hasFace: true,
    faceLoginEnabled: true,
    facePhoto: "/avatars/face-6.jpg",
    faceCreatedAt: "2024-04-10",
    status: "启用",
    createdAt: "2024-02-20",
  },
  {
    id: "7",
    employeeId: "E007",
    name: "周九",
    teamId: "4",
    teamName: "掘进二队",
    phone: "13800001007",
    cardNo: "C00123462",
    hasFace: false,
    faceLoginEnabled: false,
    status: "启用",
    createdAt: "2024-03-01",
  },
  {
    id: "8",
    employeeId: "E008",
    name: "吴十",
    teamId: "4",
    teamName: "掘进二队",
    phone: "13800001008",
    cardNo: "C00123463",
    hasFace: true,
    faceLoginEnabled: true,
    facePhoto: "/avatars/face-8.jpg",
    faceCreatedAt: "2024-03-15",
    status: "启用",
    createdAt: "2024-03-05",
  },
  {
    id: "9",
    employeeId: "E009",
    name: "郑十一",
    teamId: "5",
    teamName: "机电队",
    phone: "13800001009",
    cardNo: "C00123464",
    hasFace: true,
    faceLoginEnabled: false,
    facePhoto: "/avatars/face-9.jpg",
    faceCreatedAt: "2024-04-01",
    status: "启用",
    createdAt: "2024-03-10",
  },
  {
    id: "10",
    employeeId: "E010",
    name: "冯十二",
    teamId: "5",
    teamName: "机电队",
    phone: "13800001010",
    cardNo: "C00123465",
    hasFace: false,
    faceLoginEnabled: false,
    status: "禁用",
    createdAt: "2024-03-15",
  },
  {
    id: "11",
    employeeId: "E011",
    name: "陈十三",
    teamId: "6",
    teamName: "通风队",
    phone: "13800001011",
    cardNo: "C00123466",
    hasFace: true,
    faceLoginEnabled: true,
    facePhoto: "/avatars/face-11.jpg",
    faceCreatedAt: "2024-05-01",
    status: "启用",
    createdAt: "2024-03-20",
  },
  {
    id: "12",
    employeeId: "E012",
    name: "褚十四",
    teamId: "6",
    teamName: "通风队",
    phone: "13800001012",
    cardNo: "C00123467",
    hasFace: false,
    faceLoginEnabled: false,
    status: "启用",
    createdAt: "2024-03-25",
  },
];
