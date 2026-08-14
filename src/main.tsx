/* eslint-disable unused-imports/no-unused-vars */
import ReactDOM from 'react-dom/client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Column, Row, RowData } from '@tanstack/react-table'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { toast } from 'sonner'
import { Toaster } from './components/ui/sonner'
import { AuthProvider, useAuth } from './context/auth-context'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import { loadEnvVariables } from './lib/env'
import { FetchError } from './models/fetch-error'
import { routeTree } from './routeTree.gen'

loadEnvVariables()

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    // onSettled: (_data, _error, _variables, _context, mutation) => {
    //   {
    //     if (mutation.meta?.invalidatesQuery) {
    //       queryClient.invalidateQueries({
    //         queryKey: mutation.meta?.invalidatesQuery,
    //       })
    //     }
    //   }
    // },
  }),
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof FetchError) {
        if (FetchError.isHttpError(error, 401)) {
          toast.error('Phiên đăng nhập đã hết hạn!')
          const redirect = router.history.location.href
          void router.navigate({ to: '/sign-out', search: { redirect } })
        } else if (FetchError.isServerError(error)) {
          toast.error('Lỗi máy chủ nội bộ!')
          void router.navigate({ to: '/500' })
        } else if (FetchError.isNetworkError(error)) {
          toast.error('Lỗi kết nối mạng!')
        } else if (FetchError.isTimeoutError(error)) {
          toast.error('Hết thời gian chờ yêu cầu!')
        }
      }
    },
  }),
})

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

export function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.querySelector('#root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    // <StrictMode>
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
            <FontProvider>
              <App />
              <Toaster richColors className='pointer-events-auto' />
            </FontProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </NuqsAdapter>

    // </StrictMode>
  )
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey
    }
  }
}

declare module '@tanstack/table-core' {
  export interface CoreOptions<TData extends RowData> {
    enableBordered?: boolean
    enableHeaderPinning?: boolean
  }
}

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateCellValue: <TValue = unknown>({
      column,
      row,
      value,
    }: {
      column: Column<TData, TValue>
      row: Row<TData>
      value: string | number
    }) => void
  }

  export interface ColumnFiltersColumnDef<TData extends RowData> {
    visibilityMode?: 'filter' | 'column' | 'both'
  }
}
