import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import GeneralError from '@/features/errors/general-error'
import { MyTasksPage } from '@/features/my-tasks'
import { searchMyTaskParamsSchema } from '@/features/my-tasks/schema'

export const Route = createFileRoute('/_authenticated/tasks/my/')({
  validateSearch: (search) => {
    return searchMyTaskParamsSchema.parse(search)
  },
  component: MyTasksPage,
  errorComponent: GeneralError,
  pendingComponent: PageTableSkeleton,
})

export { Route as MyTasksRoute }
