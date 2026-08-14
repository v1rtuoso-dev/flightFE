import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import $queryClient from '@/api'

export function useStatisticsRecipientOptions() {
  const [getTeamQuery, getUnitsQuery, getUsersQuery] = useQueries({
    queries: [
      $queryClient.queryOptions('get', '/api/teams/assignable'),
      $queryClient.queryOptions('get', '/api/units/assignable'),
      $queryClient.queryOptions('get', '/api/users/assignable'),
    ],
  })

  const teamOptions = useMemo(() => {
    return (
      (getTeamQuery.data?.data ?? []).map((team) => ({
        value: team.id!.toString(),
        label: team.teamName!,
      })) ?? []
    )
  }, [getTeamQuery.data?.data])

  const unitOptions = useMemo(() => {
    return (
      (getUnitsQuery.data?.data ?? []).map((unit) => ({
        value: unit.id!.toString(),
        label: unit.unitName!,
      })) ?? []
    )
  }, [getUnitsQuery.data?.data])

  const userOptions = useMemo(() => {
    return (
      (getUsersQuery.data?.data?.users ?? []).map((user) => ({
        value: user.id.toString(),
        label: user.name,
      })) ?? []
    )
  }, [getUsersQuery.data?.data])

  return {
    teamOptions,
    unitOptions,
    userOptions,
    isLoading:
      getTeamQuery.isLoading ||
      getUnitsQuery.isLoading ||
      getUsersQuery.isLoading,
    error: getTeamQuery.error || getUnitsQuery.error || getUsersQuery.error,
  }
}
