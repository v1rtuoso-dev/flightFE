import { AUTH_TOKEN_KEY, REQUIRES_PASSWORD_CHANGE_KEY } from '@/config/auth'
import { paths } from '@/generated/api-schema'
import { FetchError } from '@/models/fetch-error'
import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import { envVariables } from '@/lib/env'

export const fetchClient = createFetchClient<paths>({
  baseUrl: envVariables.viteBaseApi,
})

fetchClient.use({
  onRequest: ({ request }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
  },
  onResponse: ({ response, request }) => {
    if (!navigator.onLine) {
      const error = new FetchError({
        message: 'Network error: You are offline',
        request,
        response,
        status: 0,
      })
      throw FetchError.networkError(error, request)
    }

    // Auto logout on 401 except for login endpoint
    if (response.status === 401) {
      const isLoginRequest = request.url.includes('/api/auth/login')

      if (!isLoginRequest) {
        // Clear auth data
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(REQUIRES_PASSWORD_CHANGE_KEY)

        // Redirect to login page
        globalThis.location.href = '/sign-in'
      }
    }
  },
})

const $queryClient = createClient(fetchClient)

export default $queryClient
