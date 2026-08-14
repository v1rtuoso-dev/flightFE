export const PERMISSION_KEYS = {
  // All Tasks permissions
  ASSIGN_TO_ALL_USERS: 'ASSIGN_TO_ALL_USERS',
  VIEW_ALL_TASKS: 'VIEW_ALL_TASKS',

  // Activity permissions
  CREATE_ACTIVITY: 'CREATE_ACTIVITY',
  EDIT_ACTIVITY: 'EDIT_ACTIVITY',
  DELETE_ACTIVITY: 'DELETE_ACTIVITY',
  PIN_ACTIVITY: 'PIN_ACTIVITY',
}

// Permission labels mapping - Vietnamese translations for permission codes
export const PERMISSION_LABELS: Record<string, string> = {
  // All Tasks permissions
  [PERMISSION_KEYS.ASSIGN_TO_ALL_USERS]: 'Gán cho tất cả người dùng',
  [PERMISSION_KEYS.VIEW_ALL_TASKS]: 'Xem tất cả công việc',

  // Activity permissions
  [PERMISSION_KEYS.CREATE_ACTIVITY]: 'Tạo hoạt động',
  [PERMISSION_KEYS.EDIT_ACTIVITY]: 'Sửa hoạt động',
  [PERMISSION_KEYS.DELETE_ACTIVITY]: 'Xóa hoạt động',
  [PERMISSION_KEYS.PIN_ACTIVITY]: 'Ghim hoạt động',
}

// Group permissions by category for better UX
export const PERMISSION_CATEGORY_CONFIG = {
  tasks: {
    label: 'Quản lý công việc',
    permissions: [
      PERMISSION_KEYS.ASSIGN_TO_ALL_USERS,
      PERMISSION_KEYS.VIEW_ALL_TASKS,
    ],
  },
  activities: {
    label: 'Quản lý hoạt động',
    permissions: [
      PERMISSION_KEYS.CREATE_ACTIVITY,
      PERMISSION_KEYS.EDIT_ACTIVITY,
      PERMISSION_KEYS.DELETE_ACTIVITY,
      PERMISSION_KEYS.PIN_ACTIVITY,
    ],
  },
}
