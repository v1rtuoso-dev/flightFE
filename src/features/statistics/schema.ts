import { z } from 'zod'

export const statisticsFilterSchema = z
  .object({
    recipientType: z.enum(['USER', 'TEAM', 'UNIT']),
    recipientIds: z
      .array(z.number())
      .min(1, 'Vui lòng chọn ít nhất 1 đối tượng'),
    dateRange: z.object({
      startDate: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
      endDate: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
    }),
  })
  .refine(
    (data) => {
      // Nếu có recipientType thì phải có recipientIds
      if (
        data.recipientType &&
        (!data.recipientIds || data.recipientIds.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: 'Vui lòng chọn ít nhất 1 đối tượng',
      path: ['recipientIds'],
    }
  )

export type StatisticsFilterInput = z.infer<typeof statisticsFilterSchema>

// API Request Schema
export const generateReportRequestSchema = z.object({
  recipientType: z.enum(['USER', 'TEAM', 'UNIT']),
  recipientIds: z.array(z.number()),
  startDate: z.string(),
  endDate: z.string(),
})

export type GenerateReportRequest = z.infer<typeof generateReportRequestSchema>

export const searchStatisticsParamsSchema = z.object({
  recipientType: z.enum(['USER', 'TEAM', 'UNIT']).default('USER'),
  recipientIds: z
    .string()
    .optional()
    .transform((val) =>
      val ? val.split(',').map((id) => Number.parseInt(id, 10)) : undefined
    ),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})
