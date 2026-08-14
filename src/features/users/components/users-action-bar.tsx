import { Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserItem } from '../types'
import { ExportExcelButton } from './export-excel-button'

interface UsersActionBarProps {
  selectedUsers: UserItem[]
  onClearSelection: () => void
  onDeleteSelected?: () => void
}

export function UsersActionBar({
  selectedUsers,
  onClearSelection,
  onDeleteSelected,
}: UsersActionBarProps) {
  const selectedCount = selectedUsers.length

  return (
    <div className='border-border bg-muted/50 flex items-center justify-between rounded-lg border p-2'>
      <div className='flex items-center gap-3'>
        <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
          {selectedCount}
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>
            {selectedCount} người dùng đã chọn
          </span>
          <span className='text-muted-foreground text-xs'>
            Bạn có thể thực hiện các hành động trên những người dùng này
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <ExportExcelButton
          users={[]}
          selectedUsers={selectedUsers}
          variant='secondary'
          size='sm'
        />

        {onDeleteSelected && (
          <Button
            variant='destructive'
            size='sm'
            onClick={onDeleteSelected}
            className='gap-2'
          >
            <Trash2 className='h-4 w-4' />
            <span className='hidden sm:inline'>Xóa đã chọn</span>
          </Button>
        )}

        <Button
          variant='outline'
          size='sm'
          onClick={onClearSelection}
          className='gap-2'
        >
          <X className='h-4 w-4' />
          <span className='hidden sm:inline'>Bỏ chọn</span>
        </Button>
      </div>
    </div>
  )
}
