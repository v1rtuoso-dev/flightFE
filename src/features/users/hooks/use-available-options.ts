import $queryClient from '@/api'

export function useAvailableOptions() {
  const getRolesQuery = $queryClient.useSuspenseQuery('get', '/api/roles')
  const getTeamsQuery = $queryClient.useSuspenseQuery('get', '/api/teams')
  const getUnitsQuery = $queryClient.useSuspenseQuery('get', '/api/units')
  const getPermissionsQuery = $queryClient.useSuspenseQuery(
    'get',
    '/api/permissions/available'
  )

  const roleOptions =
    getRolesQuery.data?.data?.map((role) => ({
      value: role.id?.toString() ?? '',
      label: role.roleName ?? '',
    })) ?? []

  const teamOptions =
    getTeamsQuery.data?.data?.map((team) => ({
      value: team.id?.toString() ?? '',
      label: team.teamName ?? '',
    })) ?? []

  const unitOptions =
    getUnitsQuery.data?.data?.map((unit) => ({
      value: unit.id?.toString() ?? '',
      label: unit.unitName ?? '',
    })) ?? []

  const permissions = getPermissionsQuery.data?.data ?? []

  return {
    roleOptions,
    teamOptions,
    unitOptions,
    permissions,
    isLoading:
      getRolesQuery.isLoading ||
      getTeamsQuery.isLoading ||
      getUnitsQuery.isLoading ||
      getPermissionsQuery.isLoading,
  }
}
