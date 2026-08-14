import { useMemo } from 'react'
import { useAuth } from '@/context/auth-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
import type { NavGroup as NavGroupType } from './types'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  const filteredNavGroups = useMemo(() => {
    return sidebarData.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          // If item requires a role, check if user has it
          if (item.requiredRole) {
            return user?.roleName === item.requiredRole
          }
          // Otherwise, show the item
          return true
        }),
      }))
      .filter((group) => group.items.length > 0) // Remove empty groups
  }, [user?.roleName]) as NavGroupType[]

  return (
    <Sidebar collapsible='icon' variant='sidebar' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
