import {
  IconCalendarEvent,
  IconChecklist,
  IconUsers,
} from '@tabler/icons-react'
import { TicketsPlane } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Flight Admin',
    email: 'admin@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  team: {
    name: 'Flight Admin',
    logo: TicketsPlane,
    plan: '',
  },
  navGroups: [
    {
      title: 'Tổng quan',
      items: [
        // {
        //   title: 'Bảng điều khiển',
        //   url: '/',
        //   icon: IconLayoutDashboard,
        // },
        // {
        //   title: 'Chuyến bay',
        //   url: '/flights',
        //   icon: IconPlaneArrival,
        // },
        {
          title: 'Công việc',
          url: '/tasks',
          icon: IconChecklist,
          isOpen: true, // Mở menu khi load
          items: [
            {
              title: 'Công việc của tôi',
              url: '/tasks/my',
            },
            {
              title: 'Công việc chung',
              url: '/tasks/all',
            },
            {
              title: 'Thống kê',
              url: '/statistics',
            },
          ],
        },
        {
          title: 'Hoạt động',
          url: '/activities',
          icon: IconCalendarEvent,
        },
        {
          title: 'Người dùng',
          url: '/users',
          icon: IconUsers,
          requiredRole: 'ADMIN',
        },
        // {
        //   title: 'Tệp đính kèm',
        //   url: '/attachments',
        //   icon: IconPaperclip,
        //   items: [
        //     {
        //       title: 'Tệp của tôi',
        //       url: '/attachments',
        //     },
        //     {
        //       title: 'Được chia sẻ với tôi',
        //       url: '/attachments/shared-with-me',
        //     },
        //   ],
        // },
      ],
    },
  ],
}
