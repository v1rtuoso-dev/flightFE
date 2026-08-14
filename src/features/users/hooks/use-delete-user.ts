import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { userKeysFactory } from '@/api/query-key-factory'
import { UserItem } from '../types'

interface OptimisticDeleteUserContext {
  previousUsers?: BaseApiResponse<UserItem[]>
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/users/{id}', {
    onMutate: async (variables) => {
      const userId = variables.params.path.id

      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: userKeysFactory.list(),
      })

      // Snapshot the current value
      const previousUsers = queryClient.getQueryData<
        BaseApiResponse<UserItem[]>
      >(userKeysFactory.list())

      // Optimistically remove the user from the list
      queryClient.setQueryData<BaseApiResponse<UserItem[]>>(
        userKeysFactory.list(),
        (old) => {
          if (!old?.data) return old

          return {
            ...old,
            data: old.data.filter((user) => user.id !== userId),
          }
        }
      )

      return { previousUsers }
    },
    onError: (_, __, context) => {
      const optimisticContext = context as OptimisticDeleteUserContext
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
