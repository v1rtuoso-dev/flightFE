import $queryClient from '@/api'

/**
 * Hook to fetch all available permissions that can be granted to users
 * @returns {Object} Object containing permissions data and query states
 */
export function useAvailablePermissions() {
  const getPermissionsQuery = $queryClient.useQuery(
    'get',
    '/api/permissions/available'
  )

  return {
    permissions: (getPermissionsQuery.data?.data ?? []) as string[],
    isLoading: getPermissionsQuery.isLoading,
    isError: getPermissionsQuery.isError,
    error: getPermissionsQuery.error,
  }
}

/**
 * Query options for available permissions - can be used with queryClient.prefetchQuery
 */
export const availablePermissionsQueryOptions = () => {
  return $queryClient.queryOptions('get', '/api/permissions/available')
}
