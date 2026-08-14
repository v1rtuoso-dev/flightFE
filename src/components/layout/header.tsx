import React from 'react'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { BellIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NavigationBreadcrumb } from '@/components/navigation-breadcrumb'
import { ThemeSwitch } from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        // Base mobile-first layout
        'bg-background flex h-14 items-center sm:h-16',
        // Responsive gaps and padding
        'gap-2 px-2 py-2 sm:gap-3 sm:px-4 sm:py-4',
        // Fixed positioning
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger
            variant='outline'
            className='scale-110 sm:scale-100'
            size='sm'
            data-tour='sidebar-trigger'
          />
        </TooltipTrigger>
        <TooltipContent side='bottom'>
          <p>Ẩn/hiện menu điều hướng</p>
        </TooltipContent>
      </Tooltip>
      <Separator orientation='vertical' className='h-4 sm:h-6' />
      {children}

      {/* Breadcrumb - hidden on very small screens */}
      <div className='hidden min-w-0 flex-1 sm:block'>
        <NavigationBreadcrumb />
      </div>

      {/* Actions - responsive layout */}
      <div className='ml-auto flex items-center gap-1 sm:gap-2 md:gap-4'>
        {/* Notification - show icon only on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center'>
              <div className='relative'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 sm:h-9 sm:w-9'
                >
                  <BellIcon className='h-4 w-4 sm:h-5 sm:w-5' />
                </Button>
                <span className='ring-background bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium shadow-sm ring-1 sm:h-5 sm:w-5 sm:ring-2'>
                  2
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* Theme Switch - smaller on mobile */}
        <div className='hidden sm:block'>
          <ThemeSwitch />
        </div>

        {/* User Nav */}
        <UserNav />
      </div>
    </header>
  )
}

Header.displayName = 'Header'
