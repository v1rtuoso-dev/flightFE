import * as z from 'zod'
import { fileSchema } from '../attachments/schema'
import {
  ASSIGNMENT_STATUSES,
  TASK_PRIORITIES,
  TASK_TYPES_KEYS,
} from './constants'

export const assignmentsSchema = z.array(
  z.object({
    recipientType: z.enum(['USER', 'TEAM', 'UNIT'], {
      error: 'Vui lòng chọn loại người nhận',
    }),
    recipientId: z
      .union([z.number().int().positive(), z.null(), z.undefined()])
      .refine((val) => val != null && val > 0, {
        message: 'Vui lòng chọn người nhận',
      }),
    dueAt: z.string().optional(),
    note: z.string().optional(),
  })
)

function postprocess<T extends z.ZodType>(
  baseSchema: T,
  callback: z.core.CheckFn<z.core.output<T>>,
  when: z.core.$ZodCheckDef['when'] = () => true
) {
  const newCheck = z.check(callback)
  newCheck._zod.def.when = when
  return baseSchema.check(newCheck)
}

export const createTaskSchema = postprocess(
  z.object({
    content: z.string().min(1, { error: 'Vui lòng nhập nội dung công việc' }),
    instructions: z.string().optional(),
    taskTypeId: z
      .union([z.number(), z.string()])
      .transform((val) => {
        if (typeof val === 'string') return Number(val)
        return val
      })
      .refine((val) => val > 0, 'Vui lòng chọn loại công việc hợp lệ'),
    notes: z.string().optional(),
    assignments: assignmentsSchema,
    attachmentIds: z.array(z.number()),
    priority: z.enum(TASK_PRIORITIES, {
      error: 'Vui lòng chọn mức độ ưu tiên',
    }),
    files: z.array(fileSchema).optional(),
  }),
  ({ issues, value }) => {
    if (value.taskTypeId !== TASK_TYPES_KEYS.textProcessing) {
      if (!value.instructions || value.instructions.trim() === '') {
        issues.push({
          code: 'custom',
          message: 'Vui lòng điền hướng dẫn cho loại công việc này',
          path: ['instructions'],
          input: value.instructions,
        })
      }
      const dueAtIndex = value.assignments.findIndex((a) => !a.dueAt)
      if (dueAtIndex !== -1) {
        issues.push({
          code: 'custom',
          message: 'Vui lòng chọn hạn hoành thành',
          path: ['assignments', dueAtIndex, 'dueAt'],
          input: value.assignments,
        })
      }
    }
  }
)

export const createSubTaskSchema = z.object({
  content: z.string().min(1, { error: 'Vui lòng nhập nội dung công việc' }),
  instructions: z.string().optional(),
  notes: z.string().optional(),
  assignments: assignmentsSchema,
  attachmentIds: z.array(z.number()).default([]),
  priority: z.enum(TASK_PRIORITIES, {
    error: 'Vui lòng chọn mức độ ưu tiên',
  }),
  files: z.array(fileSchema).optional(),
})

export const updateTaskAssignmentSchema = z.object({
  recipientId: z.number({ error: 'Vui lòng chọn người nhận' }),
  recipientType: z.string().min(1, { error: 'Vui lòng chọn loại người nhận' }),
  dueAt: z.string({ error: 'Vui lòng chọn ngày hạn' }).optional(),
  note: z.string().optional(),
  status: z.enum(ASSIGNMENT_STATUSES),
})

export const updateTaskSchema = postprocess(
  z.object({
    content: z.string().min(1, { error: 'Vui lòng nhập nội dung công việc' }),
    instructions: z.string().optional(),
    taskTypeId: z
      .union([z.number(), z.string()])
      .transform((val) => {
        if (typeof val === 'string') return Number(val)
        return val
      })
      .refine((val) => val > 0, 'Vui lòng chọn loại công việc hợp lệ'),
    notes: z.string().optional(),
    priority: z.enum(TASK_PRIORITIES, {
      error: 'Vui lòng chọn mức độ ưu tiên',
    }),
  }),
  ({ issues, value }) => {
    if (
      value.taskTypeId !== TASK_TYPES_KEYS.textProcessing &&
      (!value.instructions || value.instructions.trim() === '')
    ) {
      issues.push({
        code: 'custom',
        message: 'Vui lòng điền hướng dẫn cho loại công việc này',
        path: ['instructions'],
        input: value.instructions,
      })
    }
  }
)

export const createTaskAssignmentsSchema = z.object({
  assignments: assignmentsSchema,
})
