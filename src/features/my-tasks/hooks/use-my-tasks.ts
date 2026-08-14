import $queryClient from '@/api'
import { MyTasksQueryParams } from '@/features/tasks/types'

export const myTasksQueryOptions = (queryParams: MyTasksQueryParams) => {
  const params = { ...queryParams }

  return $queryClient.queryOptions('get', '/api/tasks/my', {
    params: {
      query: params,
    },
  })
}
