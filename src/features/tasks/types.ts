import { z } from 'zod'
import { paths } from '@/generated/api-schema'
import {
  createTaskAssignmentsSchema,
  createTaskSchema,
  createSubTaskSchema,
  updateTaskSchema,
} from './schema'

export type TaskResponse = NonNullable<
  NonNullable<
    paths['/api/tasks/my']['get']['responses']['200']['content']['*/*']['data']
  >
>

export type Task = NonNullable<TaskResponse['tasks']>[number]

export type HierarchicalTask = Task & {
  level: number
  isLastChild: boolean
}
export type TaskFilters = Omit<Task, 'assignments' | 'documents'>

export type TaskAssignment = Required<Task>['assignments'][number] & {
  isUrgent?: boolean | null
  isApproaching?: boolean | null
}

export type TaskStatus = NonNullable<Task['status']> | 'COMPLETED_LATE'

export type TaskFilterStatus = Exclude<TaskStatus, 'OPEN'>

export type TaskPriority = NonNullable<Task['priority']>

export type TaskAttachment = NonNullable<Task['attachments']>[number]

export type TaskAssignmentStatus =
  | NonNullable<TaskAssignment['status']>
  | 'DONE_LATE'

export type CreateTaskAssignments = z.infer<typeof createTaskAssignmentsSchema>

export type TaskAssignmentComment = Required<
  NonNullable<
    paths['/api/assignments/{id}/comments']['get']['responses']['200']['content']['*/*']['data']
  >
>[number]

export type TaskFilterTypes = 'assigned' | 'received'

export type CreateTaskFormOutput = z.input<typeof createTaskSchema>

export type UpdateTaskFormOutput = z.input<typeof updateTaskSchema>

export type CreateSubTaskFormOutput = z.input<typeof createSubTaskSchema>

export type MyTasksQueryParams =
  paths['/api/tasks/my']['get']['parameters']['query']

export type AllTasksQueryParams =
  paths['/api/tasks/company']['get']['parameters']['query']
