import React from 'react'
import { isMatch, Link, useMatches } from '@tanstack/react-router'
import { SlashIcon, HomeIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const NavigationBreadcrumb = () => {
  const matches = useMatches()
  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, 'loaderData.crumb')
  )
  const items = matchesWithCrumbs.map(({ pathname, loaderData }) => {
    return {
      href: pathname,
      label: loaderData?.crumb,
    }
  })
  return (
    <Breadcrumb className='hidden min-w-0 flex-shrink sm:block'>
      <BreadcrumbList className='flex-nowrap'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const content =
            item.label === 'index' ? (
              <HomeIcon className='h-3 w-3 sm:h-4 sm:w-4' />
            ) : (
              <span className='truncate text-xs sm:text-sm'>{item.label}</span>
            )

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className='min-w-0'>
                {isLast ? (
                  <BreadcrumbPage className='min-w-0'>{content}</BreadcrumbPage>
                ) : (
                  <Link to={item.href} className='min-w-0'>
                    {content}
                  </Link>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator className='flex-shrink-0'>
                  <SlashIcon className='h-3 w-3 sm:h-4 sm:w-4' />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
