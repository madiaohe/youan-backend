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

// ========== 检测管理相关 ==========

// 检测参数类型
export interface DetectionParam {
  id: string;
  name: string;
  code: string;
  minValue: number;
  maxValue: number;
  unit: string;
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export const mockDetectionParams: DetectionParam[] = [
  {
    id: "1",
    name: "吸气阻力上限",
    code: "INHALE_MAX",
    minValue: 0,
    maxValue: 350,
    unit: "Pa",
    description: "吸气阻力检测上限阈值",
    updatedAt: "2024-06-01 10:00:00",
    updatedBy: "admin",
  },
  {
    id: "2",
    name: "吸气阻力下限",
    code: "INHALE_MIN",
    minValue: 0,
    maxValue: 100,
    unit: "Pa",
    description: "吸气阻力检测下限阈值",
    updatedAt: "2024-06-01 10:00:00",
    updatedBy: "admin",
  },
  {
    id: "3",
    name: "呼气阻力上限",
    code: "EXHALE_MAX",
    minValue: 0,
    maxValue: 300,
    unit: "Pa",
    description: "呼气阻力检测上限阈值",
    updatedAt: "2024-06-01 10:00:00",
    updatedBy: "admin",
  },
  {
    id: "4",
    name: "呼气阻力下限",
    code: "EXHALE_MIN",
    minValue: 0,
    maxValue: 80,
    unit: "Pa",
    description: "呼气阻力检测下限阈值",
    updatedAt: "2024-06-01 10:00:00",
    updatedBy: "admin",
  },
  {
    id: "5",
    name: "检测流量",
    code: "FLOW_RATE",
    minValue: 30,
    maxValue: 95,
    unit: "L/min",
    description: "标准检测流量范围",
    updatedAt: "2024-05-15 14:30:00",
    updatedBy: "user01",
  },
  {
    id: "6",
    name: "检测时长",
    code: "DURATION",
    minValue: 5,
    maxValue: 15,
    unit: "s",
    description: "单次检测持续时间",
    updatedAt: "2024-05-15 14:30:00",
    updatedBy: "user01",
  },
];

// 检测记录类型
export interface DetectionRecord {
  id: string;
  filterBoxCode: string;
  employeeId: string;
  employeeName: string;
  teamName: string;
  deviceId: string;
  deviceName: string;
  detectionTime: string;
  inhaleResistance: number;
  exhaleResistance: number;
  flowRate: number;
  result: "合格" | "不合格";
  remark?: string;
}

export const mockDetectionRecords: DetectionRecord[] = [
  {
    id: "1",
    filterBoxCode: "FB20240601001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    detectionTime: "2024-06-11 08:30:00",
    inhaleResistance: 180,
    exhaleResistance: 150,
    flowRate: 85,
    result: "合格",
  },
  {
    id: "2",
    filterBoxCode: "FB20240601002",
    employeeId: "E002",
    employeeName: "李四",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    detectionTime: "2024-06-11 08:35:00",
    inhaleResistance: 380,
    exhaleResistance: 200,
    flowRate: 82,
    result: "不合格",
    remark: "吸气阻力超标",
  },
  {
    id: "3",
    filterBoxCode: "FB20240601003",
    employeeId: "E003",
    employeeName: "王五",
    teamName: "采煤二队",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    detectionTime: "2024-06-11 08:40:00",
    inhaleResistance: 160,
    exhaleResistance: 140,
    flowRate: 88,
    result: "合格",
  },
  {
    id: "4",
    filterBoxCode: "FB20240601004",
    employeeId: "E004",
    employeeName: "赵六",
    teamName: "采煤二队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    detectionTime: "2024-06-11 09:00:00",
    inhaleResistance: 200,
    exhaleResistance: 320,
    flowRate: 80,
    result: "不合格",
    remark: "呼气阻力超标",
  },
  {
    id: "5",
    filterBoxCode: "FB20240601005",
    employeeId: "E006",
    employeeName: "孙八",
    teamName: "掘进一队",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    detectionTime: "2024-06-11 09:15:00",
    inhaleResistance: 150,
    exhaleResistance: 130,
    flowRate: 90,
    result: "合格",
  },
  {
    id: "6",
    filterBoxCode: "FB20240601006",
    employeeId: "E008",
    employeeName: "吴十",
    teamName: "掘进二队",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    detectionTime: "2024-06-11 09:30:00",
    inhaleResistance: 170,
    exhaleResistance: 145,
    flowRate: 86,
    result: "合格",
  },
  {
    id: "7",
    filterBoxCode: "FB20240601007",
    employeeId: "E009",
    employeeName: "郑十一",
    teamName: "机电队",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    detectionTime: "2024-06-11 10:00:00",
    inhaleResistance: 190,
    exhaleResistance: 160,
    flowRate: 84,
    result: "合格",
  },
  {
    id: "8",
    filterBoxCode: "FB20240601008",
    employeeId: "E011",
    employeeName: "陈十三",
    teamName: "通风队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    detectionTime: "2024-06-11 10:30:00",
    inhaleResistance: 165,
    exhaleResistance: 140,
    flowRate: 87,
    result: "合格",
  },
  {
    id: "9",
    filterBoxCode: "FB20240610001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    detectionTime: "2024-06-10 08:00:00",
    inhaleResistance: 175,
    exhaleResistance: 155,
    flowRate: 83,
    result: "合格",
  },
  {
    id: "10",
    filterBoxCode: "FB20240610002",
    employeeId: "E004",
    employeeName: "赵六",
    teamName: "采煤二队",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    detectionTime: "2024-06-10 08:30:00",
    inhaleResistance: 185,
    exhaleResistance: 160,
    flowRate: 85,
    result: "合格",
  },
];

// 检测日志类型
export interface DetectionLog {
  id: string;
  filterBoxCode: string;
  employeeId: string;
  employeeName: string;
  teamName: string;
  deviceId: string;
  deviceName: string;
  operationType: "检测" | "回收" | "发放";
  operationTime: string;
  result: string;
  remark?: string;
}

export const mockDetectionLogs: DetectionLog[] = [
  {
    id: "1",
    filterBoxCode: "FB20240601001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    operationType: "检测",
    operationTime: "2024-06-11 08:30:00",
    result: "合格",
  },
  {
    id: "2",
    filterBoxCode: "FB20240601002",
    employeeId: "E002",
    employeeName: "李四",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    operationType: "检测",
    operationTime: "2024-06-11 08:35:00",
    result: "不合格",
    remark: "吸气阻力超标",
  },
  {
    id: "3",
    filterBoxCode: "FB20240501001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    operationType: "回收",
    operationTime: "2024-06-10 18:00:00",
    result: "已回收",
  },
  {
    id: "4",
    filterBoxCode: "FB20240601003",
    employeeId: "E003",
    employeeName: "王五",
    teamName: "采煤二队",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    operationType: "检测",
    operationTime: "2024-06-10 09:00:00",
    result: "合格",
  },
  {
    id: "5",
    filterBoxCode: "FB20240601005",
    employeeId: "E006",
    employeeName: "孙八",
    teamName: "掘进一队",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    operationType: "发放",
    operationTime: "2024-06-10 07:30:00",
    result: "已发放",
  },
  {
    id: "6",
    filterBoxCode: "FB20240601004",
    employeeId: "E004",
    employeeName: "赵六",
    teamName: "采煤二队",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    operationType: "检测",
    operationTime: "2024-06-09 10:00:00",
    result: "不合格",
    remark: "呼气阻力超标",
  },
  {
    id: "7",
    filterBoxCode: "FB20240501002",
    employeeId: "E008",
    employeeName: "吴十",
    teamName: "掘进二队",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    operationType: "回收",
    operationTime: "2024-06-09 17:30:00",
    result: "已回收",
  },
  {
    id: "8",
    filterBoxCode: "FB20240601006",
    employeeId: "E009",
    employeeName: "郑十一",
    teamName: "机电队",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    operationType: "发放",
    operationTime: "2024-06-09 07:00:00",
    result: "已发放",
  },
];

// 检测设备列表
export const detectionDevices = [
  { id: "D001", name: "检测柜A-01" },
  { id: "D002", name: "检测柜A-02" },
  { id: "D003", name: "检测柜B-01" },
  { id: "D004", name: "检测柜B-02" },
  { id: "D005", name: "检测柜C-01" },
];

// 检测设备参数配置
export interface DetectionDeviceParams {
  deviceId: string;
  deviceName: string;
  flowRate: number; // L/min
  kn95Threshold: number; // Pa
  kn100Threshold: number; // Pa
  updatedAt: string;
}

export const mockDetectionDeviceParams: DetectionDeviceParams[] = [
  { deviceId: "D001", deviceName: "检测柜A-01", flowRate: 85, kn95Threshold: 300, kn100Threshold: 350, updatedAt: "2024-06-10 14:30:00" },
  { deviceId: "D002", deviceName: "检测柜A-02", flowRate: 85, kn95Threshold: 300, kn100Threshold: 350, updatedAt: "2024-06-10 14:30:00" },
  { deviceId: "D003", deviceName: "检测柜B-01", flowRate: 85, kn95Threshold: 300, kn100Threshold: 350, updatedAt: "2024-06-10 14:30:00" },
  { deviceId: "D004", deviceName: "检测柜B-02", flowRate: 85, kn95Threshold: 300, kn100Threshold: 350, updatedAt: "2024-06-10 14:30:00" },
  { deviceId: "D005", deviceName: "检测柜C-01", flowRate: 85, kn95Threshold: 300, kn100Threshold: 350, updatedAt: "2024-06-10 14:30:00" },
];

// 检测结果类型
export const detectionResults = ["合格", "不合格"];

// ========== 回收管理相关 ==========

// 待回收滤盒数据
export interface PendingRecycle {
  id: string;
  filterBoxCode: string;
  employeeId: string;
  employeeName: string;
  teamName: string;
  lastDetectionTime: string;
  lastDetectionResult: "合格" | "不合格";
  usageDays: number;
  status: "待回收" | "已超期";
  expireDate: string;
}

export const mockPendingRecycles: PendingRecycle[] = [
  {
    id: "1",
    filterBoxCode: "FB20240501001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    lastDetectionTime: "2024-06-10 08:00:00",
    lastDetectionResult: "合格",
    usageDays: 30,
    status: "待回收",
    expireDate: "2024-06-11",
  },
  {
    id: "2",
    filterBoxCode: "FB20240501002",
    employeeId: "E008",
    employeeName: "吴十",
    teamName: "掘进二队",
    lastDetectionTime: "2024-06-09 16:00:00",
    lastDetectionResult: "不合格",
    usageDays: 32,
    status: "已超期",
    expireDate: "2024-06-09",
  },
  {
    id: "3",
    filterBoxCode: "FB20240501003",
    employeeId: "E006",
    employeeName: "孙八",
    teamName: "掘进一队",
    lastDetectionTime: "2024-06-08 14:30:00",
    lastDetectionResult: "合格",
    usageDays: 28,
    status: "待回收",
    expireDate: "2024-06-12",
  },
  {
    id: "4",
    filterBoxCode: "FB20240501004",
    employeeId: "E011",
    employeeName: "陈十三",
    teamName: "通风队",
    lastDetectionTime: "2024-06-07 10:00:00",
    lastDetectionResult: "合格",
    usageDays: 35,
    status: "已超期",
    expireDate: "2024-06-06",
  },
  {
    id: "5",
    filterBoxCode: "FB20240501005",
    employeeId: "E009",
    employeeName: "郑十一",
    teamName: "机电队",
    lastDetectionTime: "2024-06-10 09:00:00",
    lastDetectionResult: "合格",
    usageDays: 25,
    status: "待回收",
    expireDate: "2024-06-15",
  },
];

// 回收记录
export interface RecycleRecord {
  id: string;
  filterBoxCode: string;
  employeeId: string;
  employeeName: string;
  teamName: string;
  recycleTime: string;
  deviceId: string;
  deviceName: string;
  recycleType: "正常回收" | "强制回收";
  remark?: string;
}

export const mockRecycleRecords: RecycleRecord[] = [
  {
    id: "1",
    filterBoxCode: "FB20240401001",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    recycleTime: "2024-06-10 18:00:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    recycleType: "正常回收",
  },
  {
    id: "2",
    filterBoxCode: "FB20240401002",
    employeeId: "E002",
    employeeName: "李四",
    teamName: "采煤一队",
    recycleTime: "2024-06-10 17:30:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    recycleType: "正常回收",
  },
  {
    id: "3",
    filterBoxCode: "FB20240401003",
    employeeId: "E004",
    employeeName: "赵六",
    teamName: "采煤二队",
    recycleTime: "2024-06-09 18:00:00",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    recycleType: "正常回收",
  },
  {
    id: "4",
    filterBoxCode: "FB20240401004",
    employeeId: "E003",
    employeeName: "王五",
    teamName: "采煤二队",
    recycleTime: "2024-06-09 17:00:00",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    recycleType: "强制回收",
    remark: "检测不合格强制回收",
  },
  {
    id: "5",
    filterBoxCode: "FB20240401005",
    employeeId: "E006",
    employeeName: "孙八",
    teamName: "掘进一队",
    recycleTime: "2024-06-08 18:00:00",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    recycleType: "正常回收",
  },
  {
    id: "6",
    filterBoxCode: "FB20240401006",
    employeeId: "E008",
    employeeName: "吴十",
    teamName: "掘进二队",
    recycleTime: "2024-06-08 17:30:00",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    recycleType: "正常回收",
  },
  {
    id: "7",
    filterBoxCode: "FB20240401007",
    employeeId: "E009",
    employeeName: "郑十一",
    teamName: "机电队",
    recycleTime: "2024-06-07 18:00:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    recycleType: "正常回收",
  },
];

// 待领用滤盒数据
export interface WaitingDispense {
  id: string;
  filterBoxCode: string;
  status: "待领用" | "已预约";
  batchNo: string;
  storageTime: string;
  deviceId: string;
  deviceName: string;
  reservedEmployeeId?: string;
  reservedEmployeeName?: string;
  reservedTime?: string;
}

export const mockWaitingDispenses: WaitingDispense[] = [
  {
    id: "1",
    filterBoxCode: "FB20240611001",
    status: "待领用",
    batchNo: "B20240611001",
    storageTime: "2024-06-11 08:00:00",
    deviceId: "DP001",
    deviceName: "发放柜A-01",
  },
  {
    id: "2",
    filterBoxCode: "FB20240611002",
    status: "已预约",
    batchNo: "B20240611001",
    storageTime: "2024-06-11 08:00:00",
    deviceId: "DP001",
    deviceName: "发放柜A-01",
    reservedEmployeeId: "E002",
    reservedEmployeeName: "李四",
    reservedTime: "2024-06-11 09:00:00",
  },
  {
    id: "3",
    filterBoxCode: "FB20240611003",
    status: "待领用",
    batchNo: "B20240611001",
    storageTime: "2024-06-11 08:00:00",
    deviceId: "DP001",
    deviceName: "发放柜A-01",
  },
  {
    id: "4",
    filterBoxCode: "FB20240610001",
    status: "已预约",
    batchNo: "B20240610001",
    storageTime: "2024-06-10 08:00:00",
    deviceId: "DP002",
    deviceName: "发放柜A-02",
    reservedEmployeeId: "E005",
    reservedEmployeeName: "钱七",
    reservedTime: "2024-06-10 10:00:00",
  },
  {
    id: "5",
    filterBoxCode: "FB20240610002",
    status: "待领用",
    batchNo: "B20240610001",
    storageTime: "2024-06-10 08:00:00",
    deviceId: "DP002",
    deviceName: "发放柜A-02",
  },
];

// 发放设备列表
export const dispenseDevices = [
  { id: "DP001", name: "发放柜A-01" },
  { id: "DP002", name: "发放柜A-02" },
  { id: "DP003", name: "发放柜B-01" },
];

// 回收箱状态
export interface RecycleBoxStatus {
  id: string;
  deviceId: string;
  deviceName: string;
  boxName: string;
  currentCount: number;
  capacity: number;
  status: "正常" | "即将满箱" | "已满箱";
  lastUpdateTime: string;
}

export const mockRecycleBoxStatuses: RecycleBoxStatus[] = [
  {
    id: "1",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    boxName: "回收箱A1",
    currentCount: 45,
    capacity: 60,
    status: "正常",
    lastUpdateTime: "2024-06-11 15:30:00",
  },
  {
    id: "2",
    deviceId: "D001",
    deviceName: "检测柜A-01",
    boxName: "回收箱A2",
    currentCount: 58,
    capacity: 60,
    status: "即将满箱",
    lastUpdateTime: "2024-06-11 15:25:00",
  },
  {
    id: "3",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    boxName: "回收箱B1",
    currentCount: 32,
    capacity: 60,
    status: "正常",
    lastUpdateTime: "2024-06-11 15:20:00",
  },
  {
    id: "4",
    deviceId: "D002",
    deviceName: "检测柜A-02",
    boxName: "回收箱B2",
    currentCount: 60,
    capacity: 60,
    status: "已满箱",
    lastUpdateTime: "2024-06-11 14:00:00",
  },
  {
    id: "5",
    deviceId: "D003",
    deviceName: "检测柜B-01",
    boxName: "回收箱C1",
    currentCount: 18,
    capacity: 60,
    status: "正常",
    lastUpdateTime: "2024-06-11 10:00:00",
  },
  {
    id: "6",
    deviceId: "D004",
    deviceName: "检测柜B-02",
    boxName: "回收箱D1",
    currentCount: 5,
    capacity: 60,
    status: "正常",
    lastUpdateTime: "2024-06-10 18:00:00",
  },
];

// ========== 设备管理相关 ==========

// 传感器状态
export interface SensorStatus {
  id: string;
  deviceId: string;
  sensorName: string;
  sensorType: "温度" | "湿度" | "流量" | "压力" | "光栅" | "红外";
  value: number;
  unit: string;
  status: "正常" | "异常" | "离线";
  lastUpdateTime: string;
}

export const mockSensorStatuses: SensorStatus[] = [
  { id: "1", deviceId: "D001", sensorName: "温度传感器A1", sensorType: "温度", value: 25.5, unit: "°C", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "2", deviceId: "D001", sensorName: "流量传感器A1", sensorType: "流量", value: 85, unit: "L/min", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "3", deviceId: "D001", sensorName: "压力传感器A1", sensorType: "压力", value: 180, unit: "Pa", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "4", deviceId: "D001", sensorName: "光栅传感器A1", sensorType: "光栅", value: 1, unit: "", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "5", deviceId: "D002", sensorName: "温度传感器B1", sensorType: "温度", value: 26.2, unit: "°C", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "6", deviceId: "D002", sensorName: "流量传感器B1", sensorType: "流量", value: 82, unit: "L/min", status: "正常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "7", deviceId: "D002", sensorName: "压力传感器B1", sensorType: "压力", value: 195, unit: "Pa", status: "异常", lastUpdateTime: "2024-06-11 15:30:00" },
  { id: "8", deviceId: "D003", sensorName: "温度传感器C1", sensorType: "温度", value: 24.8, unit: "°C", status: "正常", lastUpdateTime: "2024-06-11 10:00:00" },
  { id: "9", deviceId: "D003", sensorName: "光栅传感器C1", sensorType: "光栅", value: 0, unit: "", status: "离线", lastUpdateTime: "2024-06-11 10:00:00" },
  { id: "10", deviceId: "D004", sensorName: "温度传感器D1", sensorType: "温度", value: 0, unit: "°C", status: "离线", lastUpdateTime: "2024-06-10 18:00:00" },
];

// 指示灯状态
export interface IndicatorLight {
  id: string;
  deviceId: string;
  lightName: string;
  color: "红" | "黄" | "绿";
  status: "亮" | "灭" | "闪烁";
  mode: "自动" | "手动";
}

export const mockIndicatorLights: IndicatorLight[] = [
  { id: "1", deviceId: "D001", lightName: "运行指示灯", color: "绿", status: "亮", mode: "自动" },
  { id: "2", deviceId: "D001", lightName: "故障指示灯", color: "红", status: "灭", mode: "自动" },
  { id: "3", deviceId: "D001", lightName: "满箱指示灯", color: "黄", status: "闪烁", mode: "自动" },
  { id: "4", deviceId: "D002", lightName: "运行指示灯", color: "绿", status: "亮", mode: "自动" },
  { id: "5", deviceId: "D002", lightName: "故障指示灯", color: "红", status: "亮", mode: "自动" },
  { id: "6", deviceId: "D002", lightName: "满箱指示灯", color: "黄", status: "灭", mode: "自动" },
  { id: "7", deviceId: "D003", lightName: "运行指示灯", color: "黄", status: "闪烁", mode: "手动" },
  { id: "8", deviceId: "D003", lightName: "故障指示灯", color: "红", status: "灭", mode: "自动" },
  { id: "9", deviceId: "D004", lightName: "运行指示灯", color: "红", status: "亮", mode: "自动" },
];

// 检测回收柜
export interface DetectorDevice {
  id: string;
  code: string;
  name: string;
  location: string;
  status: "在线" | "离线" | "维护中";
  ipAddress: string;
  lastHeartbeat: string;
  detectionCount: number;
  recycleCount: number;
  createdAt: string;
}

export const mockDetectorDevices: DetectorDevice[] = [
  {
    id: "D001",
    code: "JC-A01",
    name: "检测柜A-01",
    location: "采煤区一楼",
    status: "在线",
    ipAddress: "192.168.1.101",
    lastHeartbeat: "2024-06-11 15:30:00",
    detectionCount: 1256,
    recycleCount: 432,
    createdAt: "2024-01-15",
  },
  {
    id: "D002",
    code: "JC-A02",
    name: "检测柜A-02",
    location: "采煤区一楼",
    status: "在线",
    ipAddress: "192.168.1.102",
    lastHeartbeat: "2024-06-11 15:30:00",
    detectionCount: 987,
    recycleCount: 321,
    createdAt: "2024-01-15",
  },
  {
    id: "D003",
    code: "JC-B01",
    name: "检测柜B-01",
    location: "掘进区一楼",
    status: "维护中",
    ipAddress: "192.168.1.103",
    lastHeartbeat: "2024-06-11 10:00:00",
    detectionCount: 856,
    recycleCount: 278,
    createdAt: "2024-02-01",
  },
  {
    id: "D004",
    code: "JC-B02",
    name: "检测柜B-02",
    location: "掘进区一楼",
    status: "离线",
    ipAddress: "192.168.1.104",
    lastHeartbeat: "2024-06-10 18:00:00",
    detectionCount: 654,
    recycleCount: 189,
    createdAt: "2024-02-01",
  },
];

// 自助发放柜
export interface DispenserDevice {
  id: string;
  code: string;
  name: string;
  location: string;
  status: "在线" | "离线" | "维护中";
  ipAddress: string;
  lastHeartbeat: string;
  stockCount: number;
  capacity: number;
  dispenseCount: number;
  createdAt: string;
}

export const mockDispenserDevices: DispenserDevice[] = [
  {
    id: "DP001",
    code: "FF-A01",
    name: "发放柜A-01",
    location: "采煤区一楼",
    status: "在线",
    ipAddress: "192.168.1.111",
    lastHeartbeat: "2024-06-11 15:30:00",
    stockCount: 45,
    capacity: 100,
    dispenseCount: 567,
    createdAt: "2024-01-15",
  },
  {
    id: "DP002",
    code: "FF-A02",
    name: "发放柜A-02",
    location: "采煤区一楼",
    status: "在线",
    ipAddress: "192.168.1.112",
    lastHeartbeat: "2024-06-11 15:30:00",
    stockCount: 78,
    capacity: 100,
    dispenseCount: 432,
    createdAt: "2024-01-15",
  },
  {
    id: "DP003",
    code: "FF-B01",
    name: "发放柜B-01",
    location: "掘进区一楼",
    status: "在线",
    ipAddress: "192.168.1.113",
    lastHeartbeat: "2024-06-11 15:30:00",
    stockCount: 23,
    capacity: 100,
    dispenseCount: 298,
    createdAt: "2024-02-01",
  },
  {
    id: "DP004",
    code: "FF-B02",
    name: "发放柜B-02",
    location: "掘进区一楼",
    status: "离线",
    ipAddress: "192.168.1.114",
    lastHeartbeat: "2024-06-10 20:00:00",
    stockCount: 0,
    capacity: 100,
    dispenseCount: 156,
    createdAt: "2024-02-01",
  },
];

// WMS同步记录
export interface WMSSyncRecord {
  id: string;
  syncType: "入库同步" | "出库同步" | "库存同步";
  syncTime: string;
  status: "成功" | "失败";
  itemCount: number;
  errorMessage?: string;
}

export const mockWMSSyncRecords: WMSSyncRecord[] = [
  {
    id: "1",
    syncType: "入库同步",
    syncTime: "2024-06-11 08:00:00",
    status: "成功",
    itemCount: 50,
  },
  {
    id: "2",
    syncType: "库存同步",
    syncTime: "2024-06-11 08:00:00",
    status: "成功",
    itemCount: 234,
  },
  {
    id: "3",
    syncType: "出库同步",
    syncTime: "2024-06-10 18:00:00",
    status: "成功",
    itemCount: 32,
  },
  {
    id: "4",
    syncType: "入库同步",
    syncTime: "2024-06-10 08:00:00",
    status: "失败",
    itemCount: 0,
    errorMessage: "WMS服务器连接超时",
  },
  {
    id: "5",
    syncType: "库存同步",
    syncTime: "2024-06-10 08:00:00",
    status: "成功",
    itemCount: 198,
  },
  {
    id: "6",
    syncType: "出库同步",
    syncTime: "2024-06-09 18:00:00",
    status: "成功",
    itemCount: 45,
  },
  {
    id: "7",
    syncType: "入库同步",
    syncTime: "2024-06-09 08:00:00",
    status: "成功",
    itemCount: 100,
  },
];

// 设备状态列表
export const deviceStatuses = ["在线", "离线", "维护中"];

// ========== 报表统计相关 ==========

// 检测统计数据
export interface DetectionStats {
  date: string;
  totalCount: number;
  qualifiedCount: number;
  unqualifiedCount: number;
  recycleCount: number;
  dispenseCount: number;
}

export const mockDetectionStats: DetectionStats[] = [
  { date: "2024-06-11", totalCount: 156, qualifiedCount: 142, unqualifiedCount: 14, recycleCount: 45, dispenseCount: 50 },
  { date: "2024-06-10", totalCount: 189, qualifiedCount: 175, unqualifiedCount: 14, recycleCount: 52, dispenseCount: 48 },
  { date: "2024-06-09", totalCount: 167, qualifiedCount: 158, unqualifiedCount: 9, recycleCount: 38, dispenseCount: 55 },
  { date: "2024-06-08", totalCount: 145, qualifiedCount: 132, unqualifiedCount: 13, recycleCount: 41, dispenseCount: 42 },
  { date: "2024-06-07", totalCount: 178, qualifiedCount: 165, unqualifiedCount: 13, recycleCount: 48, dispenseCount: 60 },
  { date: "2024-06-06", totalCount: 134, qualifiedCount: 125, unqualifiedCount: 9, recycleCount: 35, dispenseCount: 38 },
  { date: "2024-06-05", totalCount: 198, qualifiedCount: 180, unqualifiedCount: 18, recycleCount: 55, dispenseCount: 65 },
];

// 区队不合格率排名
export interface TeamRanking {
  rank: number;
  teamId: string;
  teamName: string;
  totalCount: number;
  unqualifiedCount: number;
  unqualifiedRate: number;
}

export const mockTeamRankings: TeamRanking[] = [
  { rank: 1, teamId: "4", teamName: "掘进二队", totalCount: 45, unqualifiedCount: 8, unqualifiedRate: 17.8 },
  { rank: 2, teamId: "2", teamName: "采煤二队", totalCount: 68, unqualifiedCount: 10, unqualifiedRate: 14.7 },
  { rank: 3, teamId: "3", teamName: "掘进一队", totalCount: 52, unqualifiedCount: 6, unqualifiedRate: 11.5 },
  { rank: 4, teamId: "1", teamName: "采煤一队", totalCount: 85, unqualifiedCount: 8, unqualifiedRate: 9.4 },
  { rank: 5, teamId: "6", teamName: "通风队", totalCount: 38, unqualifiedCount: 3, unqualifiedRate: 7.9 },
  { rank: 6, teamId: "5", teamName: "机电队", totalCount: 32, unqualifiedCount: 2, unqualifiedRate: 6.3 },
];

// 大屏配置
export interface ScreenConfig {
  id: string;
  name: string;
  enabled: boolean;
  refreshInterval: number;
  showItems: string[];
  createdAt: string;
}

export const mockScreenConfigs: ScreenConfig[] = [
  {
    id: "1",
    name: "主入口大屏",
    enabled: true,
    refreshInterval: 30,
    showItems: ["detectionStats", "teamRanking", "realtimeStatus"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "检测区大屏",
    enabled: true,
    refreshInterval: 10,
    showItems: ["detectionStats", "deviceStatus"],
    createdAt: "2024-02-01",
  },
];

// ========== 日志管理相关 ==========

// 系统操作日志
export interface SystemLog {
  id: string;
  operator: string;
  operatorRole: string;
  operationType: string;
  operationModule: string;
  operationContent: string;
  operationTime: string;
  ipAddress: string;
  browser?: string;
}

export const mockSystemLogs: SystemLog[] = [
  {
    id: "1",
    operator: "admin",
    operatorRole: "超级管理员",
    operationType: "登录",
    operationModule: "系统",
    operationContent: "登录系统成功",
    operationTime: "2024-06-11 10:30:00",
    ipAddress: "192.168.1.1",
    browser: "Chrome 125",
  },
  {
    id: "2",
    operator: "user01",
    operatorRole: "普通管理员",
    operationType: "导出",
    operationModule: "检测管理",
    operationContent: "导出检测记录Excel，共156条",
    operationTime: "2024-06-11 09:15:00",
    ipAddress: "192.168.1.2",
    browser: "Chrome 125",
  },
  {
    id: "3",
    operator: "admin",
    operatorRole: "超级管理员",
    operationType: "编辑",
    operationModule: "设备管理",
    operationContent: "修改检测柜A-01参数配置",
    operationTime: "2024-06-10 16:45:00",
    ipAddress: "192.168.1.1",
    browser: "Chrome 125",
  },
  {
    id: "4",
    operator: "user02",
    operatorRole: "数据查看员",
    operationType: "查看",
    operationModule: "报表统计",
    operationContent: "查看区队不合格率排名报表",
    operationTime: "2024-06-10 14:30:00",
    ipAddress: "192.168.1.3",
    browser: "Firefox 126",
  },
  {
    id: "5",
    operator: "admin",
    operatorRole: "超级管理员",
    operationType: "新增",
    operationModule: "员工管理",
    operationContent: "新增员工：郑十五",
    operationTime: "2024-06-10 11:00:00",
    ipAddress: "192.168.1.1",
    browser: "Chrome 125",
  },
];

// AI推荐面罩日志
export interface AIRecommendLog {
  id: string;
  employeeId: string;
  employeeName: string;
  teamName: string;
  faceShape: string;
  faceSize: string;
  recommendedMask: string;
  confidence: number;
  recommendTime: string;
  deviceId: string;
  deviceName: string;
}

export const mockAIRecommendLogs: AIRecommendLog[] = [
  {
    id: "1",
    employeeId: "E001",
    employeeName: "张三",
    teamName: "采煤一队",
    faceShape: "椭圆型",
    faceSize: "中号",
    recommendedMask: "3M 6200 M号",
    confidence: 95.6,
    recommendTime: "2024-06-11 08:35:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
  },
  {
    id: "2",
    employeeId: "E002",
    employeeName: "李四",
    teamName: "采煤一队",
    faceShape: "方型",
    faceSize: "大号",
    recommendedMask: "3M 6200 L号",
    confidence: 92.3,
    recommendTime: "2024-06-11 08:40:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
  },
  {
    id: "3",
    employeeId: "E006",
    employeeName: "孙八",
    teamName: "掘进一队",
    faceShape: "圆型",
    faceSize: "小号",
    recommendedMask: "3M 6200 S号",
    confidence: 88.7,
    recommendTime: "2024-06-11 09:15:00",
    deviceId: "D003",
    deviceName: "检测柜B-01",
  },
  {
    id: "4",
    employeeId: "E008",
    employeeName: "吴十",
    teamName: "掘进二队",
    faceShape: "长型",
    faceSize: "中号",
    recommendedMask: "3M 6200 M号",
    confidence: 91.2,
    recommendTime: "2024-06-11 09:30:00",
    deviceId: "D002",
    deviceName: "检测柜A-02",
  },
  {
    id: "5",
    employeeId: "E011",
    employeeName: "陈十三",
    teamName: "通风队",
    faceShape: "椭圆型",
    faceSize: "中号",
    recommendedMask: "3M 6200 M号",
    confidence: 94.1,
    recommendTime: "2024-06-11 10:30:00",
    deviceId: "D001",
    deviceName: "检测柜A-01",
  },
];

// ========== 系统设置相关 ==========

// 设备参数配置
export interface DeviceParamConfig {
  id: string;
  paramName: string;
  paramKey: string;
  paramValue: string;
  description: string;
  updatedAt: string;
}

export const mockDeviceParamConfigs: DeviceParamConfig[] = [
  {
    id: "1",
    paramName: "检测超时时间",
    paramKey: "detection_timeout",
    paramValue: "30",
    description: "单次检测最大等待时间（秒）",
    updatedAt: "2024-06-01 10:00:00",
  },
  {
    id: "2",
    paramName: "心跳检测间隔",
    paramKey: "heartbeat_interval",
    paramValue: "60",
    description: "设备心跳检测间隔（秒）",
    updatedAt: "2024-06-01 10:00:00",
  },
  {
    id: "3",
    paramName: "库存预警阈值",
    paramKey: "stock_warning_threshold",
    paramValue: "20",
    description: "发放柜库存低于此值时预警",
    updatedAt: "2024-05-15 14:30:00",
  },
  {
    id: "4",
    paramName: "滤盒使用周期",
    paramKey: "filter_box_cycle",
    paramValue: "30",
    description: "滤盒标准使用周期（天）",
    updatedAt: "2024-05-15 14:30:00",
  },
  {
    id: "5",
    paramName: "数据同步时间",
    paramKey: "sync_schedule",
    paramValue: "08:00,18:00",
    description: "每日自动同步WMS时间点",
    updatedAt: "2024-05-20 09:00:00",
  },
  {
    id: "6",
    paramName: "光栅计数器灵敏度",
    paramKey: "grating_sensitivity",
    paramValue: "80",
    description: "光栅传感器计数触发灵敏度（0-100），值越高灵敏度越高",
    updatedAt: "2024-06-10 14:00:00",
  },
  {
    id: "7",
    paramName: "回收箱满箱阈值",
    paramKey: "recycle_box_full_threshold",
    paramValue: "90",
    description: "回收箱容量达到此百分比时触发满箱预警",
    updatedAt: "2024-06-10 15:00:00",
  },
];

// 界面与通知配置
export interface UIConfig {
  id: string;
  configName: string;
  configKey: string;
  configValue: string;
  description: string;
}

export const mockUIConfigs: UIConfig[] = [
  {
    id: "1",
    configName: "系统名称",
    configKey: "system_name",
    configValue: "滤盒全生命周期管理系统",
    description: "显示在页面标题和登录页",
  },
  {
    id: "2",
    configName: "登录验证码",
    configKey: "login_captcha",
    configValue: "true",
    description: "是否启用登录验证码",
  },
  {
    id: "3",
    configName: "新消息通知",
    configKey: "notification_new_message",
    configValue: "true",
    description: "接收新消息时推送通知",
  },
  {
    id: "4",
    configName: "回收提醒通知",
    configKey: "notification_recycle",
    configValue: "true",
    description: "滤盒到期回收提醒通知",
  },
  {
    id: "5",
    configName: "回收提醒天数",
    configKey: "recycle_remind_days",
    configValue: "3",
    description: "提前多少天发送回收提醒",
  },
  {
    id: "6",
    configName: "报警提示音",
    configKey: "alarm_sound",
    configValue: "true",
    description: "设备故障或异常时播放提示音",
  },
  {
    id: "7",
    configName: "大屏待机视频",
    configKey: "screen_saver_video",
    configValue: "/media/screen-saver.mp4",
    description: "大屏待机时播放的视频文件",
  },
  {
    id: "8",
    configName: "大屏待机图片",
    configKey: "screen_saver_image",
    configValue: "/media/screen-saver.jpg",
    description: "大屏待机时显示的图片（无视频时）",
  },
];
