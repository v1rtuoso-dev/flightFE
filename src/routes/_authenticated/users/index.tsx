import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { UsersPage } from '@/features/users'
import { searchUsersParamsSchema } from '@/features/users/schema'

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search) => {
    return searchUsersParamsSchema.parse(search)
  },
  component: UsersPage,
  errorComponent: () => <div>Error loading users</div>,
  pendingComponent: PageTableSkeleton,
})

export { Route as UsersRoute }
