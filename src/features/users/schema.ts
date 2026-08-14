import { z } from 'zod'

export const searchUsersParamsSchema = z.object({
  page: z.coerce.number().nonnegative().optional(),
  size: z.coerce.number().min(1).max(500).optional(),
  keyword: z.string().optional(),
  teamId: z.coerce.number().optional(),
  unitId: z.coerce.number().optional(),
  roleNames: z.array(z.string()).optional(),
})

export const createUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Vui lòng nhập họ tên' }),
    email: z.string().pipe(z.email({ message: 'Email không hợp lệ' })),
    password: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    roleId: z.number({ message: 'Vui lòng chọn vai trò' }),
    teamId: z.number().optional(),
    unitId: z.number().optional(),
    permissionCodes: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  name: z.string().min(1, { message: 'Vui lòng nhập họ tên' }),
  email: z.string().pipe(z.email({ message: 'Email không hợp lệ' })),
  teamId: z.number({ message: 'Vui lòng chọn nhóm' }),
  unitId: z.number({ message: 'Vui lòng chọn tổ' }),
  permissionsCodes: z.array(z.string()),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const upsertUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Vui lòng nhập họ tên' }),
    email: z.string().pipe(z.email({ message: 'Email không hợp lệ' })),
    password: z.string().refine((val) => val === '' || val.length >= 6, {
      message: 'Mật khẩu phải có ít nhất 6 ký tự',
    }),
    confirmPassword: z.string(),
    roleId: z.number({ message: 'Vui lòng chọn vai trò' }).optional(),
    teamId: z.number().optional(),
    unitId: z.number().optional(),
    permissionCodes: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If password is provided, confirmPassword must match
      if (data.password && data.password !== '') {
        return data.password === data.confirmPassword
      }
      // If password is empty, confirmPassword should also be empty
      return data.confirmPassword === '' || data.confirmPassword === undefined
    },
    {
      message: 'Mật khẩu không khớp',
      path: ['confirmPassword'],
    }
  )

export type UpsertUserInput = z.infer<typeof upsertUserSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Vui lòng nhập mật khẩu hiện tại' }),
    newPassword: z
      .string()
      .min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Vui lòng xác nhận mật khẩu mới' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
