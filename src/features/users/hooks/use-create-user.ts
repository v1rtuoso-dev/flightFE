import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { userKeysFactory } from '@/api/query-key-factory'
import { UserItem, UsersResponse } from '../types'

interface OptimisticCreateUserContext {
  previousUsers?: BaseApiResponse<UsersResponse>
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/users', {
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: userKeysFactory.list(),
      })

      // Snapshot the current value
      const previousUsers = queryClient.getQueryData<
        BaseApiResponse<UsersResponse>
      >(userKeysFactory.list())

      const { name, email, roleId, teamId, unitId, permissionCodes } =
        variables?.body || {}

      // Optimistically update the list by adding the new user
      queryClient.setQueryData<BaseApiResponse<UsersResponse>>(
        userKeysFactory.list(),
        (old) => {
          if (!old?.data?.users) return old

          const newUser: UserItem = {
            id: Date.now(), // Temporary ID
            name: name || '',
            email: email || '',
            roleId: roleId || 0,
            teamId: teamId || 0,
            unitId: unitId || 0,
            roleName: 'MEMBER', // Default role name
            teamName: '', // Will be filled by server
            unitName: '', // Will be filled by server
            permissions: permissionCodes, // Will be filled by server
          }

          return {
            ...old,
            data: {
              users: [newUser, ...(old.data.users || [])],
              pagination: old.data.pagination,
            },
          }
        }
      )

      return { previousUsers }
    },
    onError: (_, __, context) => {
      const optimisticContext = context as OptimisticCreateUserContext
      // Restore the previous state if available
      if (optimisticContext?.previousUsers) {
        queryClient.setQueryData(
          userKeysFactory.list(),
          optimisticContext.previousUsers
        )
      }
    },
    onSettled: async () => {
      // Always refetch after error or success to get the real data
      await queryClient.invalidateQueries({
        queryKey: userKeysFactory.list(),
      })
    },
  })
}
