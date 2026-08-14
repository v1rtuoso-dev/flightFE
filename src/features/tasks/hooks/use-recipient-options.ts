import { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import $queryClient from '@/api'
import { LiteralUnion } from 'type-fest'
import { useAuth } from '@/context/auth-context'
import { PERMISSION_KEYS } from '@/features/users/constants'

export function useRecipientOptions() {
  const { hasRole, hasPermission } = useAuth()

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
        value: team.id!,
        label: team.teamName!,
      })) ?? []
    )
  }, [getTeamQuery.data?.data])

  const unitOptions = useMemo(() => {
    return (
      (getUnitsQuery.data?.data ?? []).map((unit) => ({
        value: unit.id!,
        label: unit.unitName!,
      })) ?? []
    )
  }, [getUnitsQuery.data?.data])

  const userOptions = useMemo(() => {
    return (
      (getUsersQuery.data?.data?.users ?? []).map((user) => ({
        value: user.id,
        label: user.name,
      })) ?? []
    )
  }, [getUsersQuery.data?.data])

  const getRecipientOptions = (
    type: LiteralUnion<'TEAM' | 'UNIT' | 'USER', string>
  ) => {
    if (type === 'TEAM') {
      return (
        (getTeamQuery.data?.data ?? []).map((team) => ({
          value: team.id!,
          label: team.teamName!,
        })) ?? []
      )
    }
    if (type === 'UNIT') {
      return (
        (getUnitsQuery.data?.data ?? []).map((unit) => ({
          value: unit.id!,
          label: unit.unitName!,
        })) ?? []
      )
    }
    if (type === 'USER') {
      return (
        (getUsersQuery.data?.data?.users ?? []).map((user) => ({
          value: user.id,
          label: user.name,
        })) ?? []
      )
    }
    // Return empty array for invalid/empty type
    return []
  }

  const deriveRecipientOptions = useMemo(() => {
    const userOption = { label: 'Cá nhân', value: 'USER' }
    const teamOption = { label: 'Đội', value: 'TEAM' }
    const unitOption = { label: 'Tổ', value: 'UNIT' }

    const higherRoles = ['ADMIN', 'DIRECTOR', 'VICE_DIRECTOR']
    const canAssignToAll = hasPermission(PERMISSION_KEYS.ASSIGN_TO_ALL_USERS)
    if (higherRoles.some((role) => hasRole(role)) || canAssignToAll)
      return [userOption, teamOption, unitOption]
    const mediumRoles = ['TEAM_VICE_LEAD', 'TEAM_LEAD']
    if (mediumRoles.some((role) => hasRole(role)))
      return [userOption, unitOption]
    return [userOption]
  }, [hasRole, hasPermission])

  return {
    getTeamQuery,
    getUnitsQuery,
    getUsersQuery,
    getRecipientOptions,
    deriveRecipientOptions,
    teamOptions,
    unitOptions,
    userOptions,
  }
}
