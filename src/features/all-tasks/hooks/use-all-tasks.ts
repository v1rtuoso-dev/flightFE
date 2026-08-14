import $queryClient from '@/api'
import { AllTasksQueryParams } from '@/features/tasks/types'

export const allTasksQueryOptions = (queryParams: AllTasksQueryParams) => {
  const params = { ...queryParams }

  return $queryClient.queryOptions('get', '/api/tasks/company', {
    params: {
      query: params,
    },
  })
}
