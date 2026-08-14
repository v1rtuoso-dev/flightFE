import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PERMISSION_LABELS } from '../constants'
import { UserItem } from '../types'

interface SelectedUserCardProps {
  user: UserItem
  onClose: () => void
}

export function SelectedUserCard({ user, onClose }: SelectedUserCardProps) {
  return (
    <Card className='sticky top-4 w-full max-w-sm'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className='text-lg'>Thông tin người dùng</CardTitle>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={onClose}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Đóng</span>
        </Button>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* User Avatar & Basic Info */}
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-lg font-medium'>
            {user.name?.slice(0, 2).toUpperCase() || 'U'}
          </div>
          <div className='flex flex-col'>
            <h3 className='font-semibold'>{user.name}</h3>
            <p className='text-muted-foreground text-sm'>{user.email}</p>
          </div>
        </div>

        <Separator />

        {/* Organization Info */}
        <div className='space-y-3'>
          <div>
            <label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              ID
            </label>
            <p className='font-mono text-sm'>#{user.id}</p>
          </div>

          {user.teamName && (
            <div>
              <label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                Đội nhóm
              </label>
              <p className='text-sm'>{user.teamName}</p>
            </div>
          )}

          {user.unitName && (
            <div>
              <label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                Tổ
              </label>
              <p className='text-sm'>{user.unitName}</p>
            </div>
          )}

          {user.roleName && (
            <div>
              <label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                Vai trò
              </label>
              <div className='mt-1 flex flex-wrap gap-1'>
                <Badge variant='outline' className='text-xs'>
                  {user.roleName}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Permissions */}
        <div>
          <label className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
            Quyền hạn ({user.permissions?.length || 0})
          </label>
          {user.permissions && user.permissions.length > 0 ? (
            <div className='mt-2 space-y-1'>
              {user.permissions.map((permission) => (
                <div
                  key={permission}
                  className='text-muted-foreground flex items-center gap-2 text-xs'
                >
                  <div className='bg-muted h-1 w-1 rounded-full' />
                  <span>{PERMISSION_LABELS[permission] || permission}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground mt-1 text-sm'>
              Không có quyền nào
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
