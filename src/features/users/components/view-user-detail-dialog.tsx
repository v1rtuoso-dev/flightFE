import { useMemo } from 'react'
import { DialogProps } from '@/hooks/use-dialogs'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PERMISSION_LABELS } from '../constants'
import { UserItem } from '../types'

interface ViewUserDetailDialogPayload {
  user: UserItem
}

export function ViewUserDetailDialog({
  open,
  onClose,
  payload,
}: DialogProps<ViewUserDetailDialogPayload>) {
  const { user } = payload

  // Get permission labels from codes
  const userPermissions = useMemo(
    () => user.permissions || [],
    [user.permissions]
  )

  const permissionLabels = useMemo(
    () =>
      userPermissions
        .map((code) => PERMISSION_LABELS[code] || code)
        .filter(Boolean),
    [userPermissions]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        void onClose()
      }}
    >
      <DialogContent
        className='sm:max-w-2xl'
        onCloseAutoFocus={(e) => {
          // Prevent auto-focus on trigger to avoid unwanted scrolling
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết của người dùng
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* User Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full text-2xl font-medium'>
                {user.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <h3 className='text-lg font-semibold'>{user.name}</h3>
                <p className='text-muted-foreground text-sm'>{user.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>ID</p>
              <p className='font-mono text-sm'>#{user.id}</p>
            </div>

            <div className='space-y-1'>
              <p className='text-muted-foreground text-sm'>Email</p>
              <p className='text-sm'>{user.email}</p>
            </div>

            {user.teamName && (
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Nhóm</p>
                <p className='text-sm'>{user.teamName}</p>
              </div>
            )}

            {user.unitName && (
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>Tổ</p>
                <p className='text-sm'>{user.unitName}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Permissions */}
          <div className='space-y-3'>
            <div>
              <h4 className='text-sm font-semibold'>Quyền hạn</h4>
              <p className='text-muted-foreground text-xs'>
                Tổng: {userPermissions.length} quyền
              </p>
            </div>

            {permissionLabels.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {permissionLabels.map((label, index) => (
                  <Badge key={index} variant='outline'>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className='text-muted-foreground text-sm'>
                Chưa có quyền nào được cấp
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
