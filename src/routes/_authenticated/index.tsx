/* eslint-disable @typescript-eslint/only-throw-error, no-console */
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  loader: ({ context }) => {
    console.log('=== AUTH LOADER START ===')
    console.log('Auth loader - isAuthenticated:', context.auth.isAuthenticated)
    console.log('Current location:', globalThis.location.href)
    console.log('Context auth:', context.auth)

    const error = context.auth.isAuthenticated
      ? (() => {
          console.log('Redirecting to /tasks/my with type=received')
          console.log('Current URL before redirect:', globalThis.location.href)
          const redirectResult = redirect({
            to: '/tasks/my',
            search: {
              type: 'received',
              page: 1,
            },
          })
          console.log('Redirect result:', redirectResult)
          return redirectResult
        })()
      : (() => {
          console.log('Not authenticated, redirecting to sign-in')
          return redirect({
            to: '/sign-in',
            search: {
              redirect: location.href,
            },
          })
        })()
    throw error
  },
})
