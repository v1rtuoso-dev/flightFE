import React from 'react'
import { cn } from '@/lib/utils'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Main = ({ fixed, className, ...props }: MainProps) => {
  return (
    <main
      className={cn(
        // Base mobile-first styles
        'min-h-0 w-full',
        // Header spacing
        'peer-[.header-fixed]/header:mt-16',
        // Fixed layout for complex layouts (data tables, etc.)
        fixed && 'fixed-main flex flex-col overflow-hidden',
        // Responsive padding - mobile first
        'p-2 sm:p-4 md:p-6',
        // Responsive gap for flex children
        'space-y-2 sm:space-y-4',
        className
      )}
      {...props}
    />
  )
}

Main.displayName = 'Main'
