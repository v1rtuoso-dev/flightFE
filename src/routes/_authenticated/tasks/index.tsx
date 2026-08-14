import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tasks/')({
  beforeLoad: () => {
    /* eslint-disable no-console */
    console.log(
      'Tasks index beforeLoad - redirecting to /tasks/my (changed from /tasks/all)'
    )
    console.log('Current URL:', globalThis.location.href)
    /* eslint-enable no-console */
    return redirect({
      to: '/tasks/my',
      search: {
        type: 'received',
        page: 1,
      },
    })
  },
})
