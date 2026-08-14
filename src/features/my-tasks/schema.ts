import z from 'zod'
import { TASK_FILTER_TYPES, TASK_STATUS_FILTER } from '../tasks/constants'

export const searchMyTaskParamsSchema = z.object({
  type: z.enum(TASK_FILTER_TYPES).catch('received'),
  page: z.number().nonnegative().optional(),
  size: z.number().min(1).max(500).optional(),
  keyword: z.any().optional(),
  priorities: z
    .array(z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const))
    .optional(),
  status: z.enum(TASK_STATUS_FILTER).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  teamIds: z.any().optional(),
  userIds: z.any().optional(),
  unitIds: z.any().optional(),
  taskTypeIds: z.any().optional(),
})
