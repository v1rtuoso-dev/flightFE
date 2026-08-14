import $queryClient from '@/api'
import { MyTasksQueryParams } from '../types'

export const tasksQueryOptions = (queryParams: MyTasksQueryParams) => {
  const params = { ...queryParams }

  return $queryClient.queryOptions('get', '/api/tasks/my', {
    params: {
      query: params,
    },
  })
}
