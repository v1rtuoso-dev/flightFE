import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Shield, Trash2 } from 'lucide-react'
import { useDialogs } from '@/hooks/use-dialogs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DeleteUserConfirmDialog } from '../components/delete-user-confirm-dialog'
import { UpsertUserSheet } from '../components/upsert-user-sheet'
import { ViewUserDetailDialog } from '../components/view-user-detail-dialog'
import { PERMISSION_LABELS } from '../constants'
import { UserItem } from '../types'
import { useAvailableOptions } from './use-available-options'

export function useUsersTableColumns() {
  const dialogs = useDialogs()
  const { teamOptions, unitOptions, roleOptions } = useAvailableOptions()

  const roleOptionNames = useMemo(() => {
    return roleOptions.map((role) => ({
      value: role.label,
      label: role.label,
    }))
  }, [roleOptions])

  const columns = useMemo(
    (): ColumnDef<UserItem>[] => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label='Chọn tất cả'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
            }}
            aria-label='Chọn dòng'
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='ID' />
        ),
        cell: ({ cell }) => {
          const id = cell.getValue<number>()
          return (
            <div className='flex items-center'>
              <span className='font-mono text-sm'>#{id}</span>
            </div>
          )
        },
        meta: {
          label: 'ID',
        },
        size: 80,
        enableColumnFilter: false,
      },
      {
        id: 'user',
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Người dùng' />
        ),
        cell: ({ row }) => {
          const user = row.original
          return (
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-medium'>
                {user.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className='flex flex-col'>
                <span className='font-medium'>{user.name}</span>
                <span className='text-muted-foreground text-xs'>
                  {user.email}
                </span>
              </div>
            </div>
          )
        },
        meta: {
          label: 'Người dùng',
        },
        size: 280,
        enableColumnFilter: false,
      },
      {
        id: 'team',
        accessorKey: 'teamName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Đội nhóm' />
        ),
        cell: ({ row }) => {
          const teamName = row.original.teamName
          return (
            <div className='flex flex-col'>
              <span className='font-medium'>{teamName || 'N/A'}</span>
            </div>
          )
        },
        meta: {
          label: 'Đội nhóm',
        },
        size: 160,
        enableColumnFilter: false,
      },
      {
        id: 'unit',
        accessorKey: 'unitName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Tổ' />
        ),
        cell: ({ row }) => {
          const unitName = row.original.unitName
          return (
            <div className='flex flex-col'>
              <span className='font-medium'>{unitName || 'N/A'}</span>
            </div>
          )
        },
        meta: {
          label: 'Tổ',
        },
        size: 160,
        enableColumnFilter: false,
      },
      {
        id: 'permissions',
        accessorKey: 'permissions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Quyền hạn' />
        ),
        cell: ({ row }) => {
          const permissions = row.original.permissions || []

          if (permissions.length === 0) {
            return (
              <div className='flex items-center gap-2'>
                <Badge variant='secondary' className='font-mono'>
                  0
                </Badge>
                <span className='text-muted-foreground text-sm'>quyền</span>
              </div>
            )
          }

          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className='flex cursor-help items-center gap-2'>
                    <Badge variant='secondary' className='font-mono'>
                      {permissions.length}
                    </Badge>
                    <span className='text-muted-foreground text-sm'>quyền</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side='left'
                  align='start'
                  className='max-w-xs'
                  sideOffset={5}
                >
                  <div className='space-y-2'>
                    <ul className='space-y-1'>
                      {permissions.map((permission) => (
                        <li
                          key={permission}
                          className='flex items-center gap-2 text-xs'
                        >
                          <Shield className='size-3 flex-shrink-0' />
                          <span>{PERMISSION_LABELS[permission]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
        meta: {
          label: 'Quyền hạn',
        },
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'roleId',
        accessorKey: 'roleId',
        size: 140,
        enableColumnFilter: true,
        visibilityMode: 'filter',
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original

          const handleViewDetail = () => {
            void dialogs.open(ViewUserDetailDialog, { user })
          }

          const handleEdit = () => {
            void dialogs.sheet(UpsertUserSheet, { user })
          }

          const handleDelete = () => {
            void dialogs.open(DeleteUserConfirmDialog, { user })
          }

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='size-8 p-0'>
                  <span className='sr-only'>Mở menu</span>
                  <MoreHorizontal className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewDetail}>
                  <Eye className='mr-2 size-4' />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className='mr-2 size-4' />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-destructive'
                  onClick={handleDelete}
                >
                  <Trash2 className='mr-2 size-4' />
                  Xóa người dùng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        size: 60,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
      {
        id: 'teamId',
        accessorKey: 'teamId',
        meta: {
          label: 'Đội',
          placeholder: 'Lọc theo đội...',
          variant: 'select',
          options: teamOptions,
        },
        enableColumnFilter: true,
        visibilityMode: 'filter',
      },
      {
        id: 'unitId',
        accessorKey: 'unitId',
        meta: {
          label: 'Tổ',
          placeholder: 'Lọc theo tổ...',
          variant: 'select',
          options: unitOptions,
        },
        enableColumnFilter: true,
        visibilityMode: 'filter',
      },
      {
        id: 'roleNames',
        accessorKey: 'roleNames',
        meta: {
          label: 'Vai trò',
          placeholder: 'Lọc theo vai trò...',
          variant: 'multiSelect',
          options: roleOptionNames,
        },
        enableColumnFilter: true,
        visibilityMode: 'filter',
      },
    ],
    [dialogs, teamOptions, unitOptions, roleOptionNames]
  )

  return columns
}
