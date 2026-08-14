import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { AUTH_TOKEN_KEY, REQUIRES_PASSWORD_CHANGE_KEY } from '@/config/auth'
import { AuthorizedUser } from '@/types/auth'
import { useLocalStorage } from 'react-use'

export interface AuthContext {
  isAuthenticated: boolean
  user: AuthorizedUser | null
  requiresPasswordChange: boolean
  logout: () => void
  setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>
  setRequiresPasswordChangeState: React.Dispatch<React.SetStateAction<boolean>>
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null,
    { raw: true }
  )

  const [user, setUser] = React.useState<AuthorizedUser | null>(null)
  const [
    requiresPasswordChange = false,
    setRequiresPasswordChangeState,
    _removeRequiresPasswordChange,
  ] = useLocalStorage<boolean>(REQUIRES_PASSWORD_CHANGE_KEY, false) as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    () => void,
  ]

  const isAuthenticated = token != null

  // Debug logging
  /* eslint-disable no-console */
  console.log('AuthContext - token:', token)
  console.log('AuthContext - isAuthenticated:', isAuthenticated)
  console.log('AuthContext - user:', user)
  /* eslint-enable no-console */

  const getMeQuery = $queryClient.useQuery(
    'get',
    '/api/users/me',
    {},
    {
      enabled: isAuthenticated,
      retry: 1,
      retryDelay: 1000,
    }
  )

  const reset = React.useCallback(() => {
    removeToken()

    setUser(null)
    setRequiresPasswordChangeState(false)

    void queryClient.invalidateQueries({ queryKey: ['get', '/api/users/me'] })
    queryClient.clear()
  }, [queryClient, removeToken, setRequiresPasswordChangeState])

  const logout = React.useCallback(() => {
    reset()
  }, [reset])

  React.useEffect(() => {
    if (getMeQuery.data?.data) {
      setUser(getMeQuery.data.data)
    }
  }, [getMeQuery.data])

  const hasRole = React.useCallback(
    (role: string) => {
      return user?.roleName === role
    },
    [user]
  )

  const hasPermission = React.useCallback(
    (permission: string) => {
      return user?.permissions?.includes(permission) ?? false
    },
    [user]
  )

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      user,
      requiresPasswordChange: requiresPasswordChange ?? false,
      setToken,
      logout,
      setRequiresPasswordChangeState,
      hasRole,
      hasPermission,
    }),
    [
      isAuthenticated,
      user,
      requiresPasswordChange,
      setToken,
      logout,
      setRequiresPasswordChangeState,
      hasRole,
      hasPermission,
    ]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

/**
 * Hook to use the auth context
 */
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
