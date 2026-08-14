import {
  TaskAssignmentStatus,
  TaskFilterTypes,
  TaskPriority,
  TaskStatus,
} from './types'

export const TASK_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
] as const satisfies readonly TaskPriority[]

export const TASK_FILTER_TYPES = [
  'assigned',
  'received',
] as const satisfies readonly TaskFilterTypes[]

export const TASK_STATUS_FILTER = [
  'IN_PROGRESS',
  'COMPLETED',
  'OVERDUE',
] as const satisfies readonly TaskStatus[]

export const ASSIGNMENT_STATUSES = [
  'WORKING',
  'DONE',
  'DONE_LATE',
  'CANCELLED',
  'OVERDUE',
] as const satisfies readonly TaskAssignmentStatus[]

export const TASK_TYPES_KEYS = {
  textProcessing: 4,
}
