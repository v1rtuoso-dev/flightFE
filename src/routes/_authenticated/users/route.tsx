import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/features/users'

export const Route = createFileRoute('/_authenticated/users')({
  loader: () => {
    return {
      crumb: 'Quản lý người dùng',
    }
  },
  component: UsersPage,
})

export { Route as UsersRoute }
