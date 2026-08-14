import $queryClient from '@/api'
import { UsersQueryParams } from '../types'

export const usersQueryOptions = (queryParams: UsersQueryParams) => {
  return $queryClient.queryOptions('get', '/api/users', {
    params: {
      query: queryParams,
    },
  })
}
