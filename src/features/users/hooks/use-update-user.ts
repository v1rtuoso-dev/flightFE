import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { userKeysFactory } from '@/api/query-key-factory'
import { UsersResponse } from '../types'

interface OptimisticUpdateUserContext {
  previousUsers?: BaseApiResponse<UsersResponse>
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('put', '/api/users/{id}', {
    onMutate: async (variables) => {
      const userId = variables.params.path.id

      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: userKeysFactory.list(),
      })

      // Snapshot the current value
      const previousUsers = queryClient.getQueryData<
        BaseApiResponse<UsersResponse>
      >(userKeysFactory.list())

      // Optimistically update the user in the list
      queryClient.setQueryData<BaseApiResponse<UsersResponse>>(
        userKeysFactory.list(),
        (old) => {
          if (!old?.data?.users) return old

          return {
            ...old,
            data: {
              users: old.data.users.map((user) =>
                user.id === userId
                  ? {
                      ...user,
                      ...variables.body,
                      updatedAt: new Date().toISOString(),
                    }
                  : user
              ),
              pagination: old.data.pagination,
            },
          }
        }
      )

      return { previousUsers }
    },
    onError: (_, __, context) => {
      const optimisticContext = context as OptimisticUpdateUserContext
      // Restore the previous state if available
      if (optimisticContext?.previousUsers) {
        queryClient.setQueryData(
          userKeysFactory.list(),
          optimisticContext.previousUsers
        )
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      void queryClient.invalidateQueries({
        queryKey: userKeysFactory.list(),
      })
    },
  })
}
