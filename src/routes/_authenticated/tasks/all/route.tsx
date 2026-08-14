import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => <Outlet />

export const Route = createFileRoute('/_authenticated/tasks/all')({
  loader: () => {
    return {
      crumb: 'Công việc chung',
    }
  },
  component: RouteComponent,
})
