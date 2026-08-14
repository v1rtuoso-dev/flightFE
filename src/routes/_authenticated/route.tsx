/* eslint-disable @typescript-eslint/only-throw-error */
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { CommandSearchProvider } from '@/context/command-search-context'
import { TourProviderWrapper } from '@/context/tour-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import SkipToMain from '@/components/skip-to-main'
import { useStartTour } from '@/features/auth/hooks/use-start-tour'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }

    // Check if user needs to change password
    if (context.auth.requiresPasswordChange) {
      throw redirect({
        to: '/change-password',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TourProviderWrapper>
      <TourInitializer>
        <CommandSearchProvider>
          <SidebarProvider defaultOpen={true}>
            <SkipToMain />
            <AppSidebar />
            <div
              id='content'
              className={cn(
                'w-full max-w-full flex-1',
                'transition-all duration-200 ease-in-out',
                // Sidebar responsive width calculations - only on desktop
                'lg:peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'lg:peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'lg:transition-[width] lg:duration-200 lg:ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh',
                // Mobile-first padding
                'px-1 sm:px-2 lg:px-3'
              )}
            >
              <Header />
              <Outlet />
            </div>
          </SidebarProvider>
        </CommandSearchProvider>
      </TourInitializer>
    </TourProviderWrapper>
  )
}

function TourInitializer({ children }: { children: React.ReactNode }) {
  // Initialize tour for first-time users - this runs inside TourProviderWrapper
  useStartTour()
  return <>{children}</>
}
