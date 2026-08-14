import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useExportUsersExcel } from '../hooks/use-export-users-excel'
import { UserItem } from '../types'

interface ExportExcelButtonProps {
  users: UserItem[]
  selectedUsers?: UserItem[]
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function ExportExcelButton({
  users,
  selectedUsers = [],
  variant = 'outline',
  size = 'default',
  className,
}: ExportExcelButtonProps) {
  const exportExcelMutation = useExportUsersExcel()

  const handleExportAll = () => {
    exportExcelMutation.mutate({
      users,
      filename: 'tat-ca-nguoi-dung',
    })
  }

  const handleExportSelected = () => {
    if (selectedUsers.length === 0) {
      return
    }

    exportExcelMutation.mutate({
      users: selectedUsers,
      filename: 'nguoi-dung-da-chon',
    })
  }

  const hasSelectedUsers = selectedUsers.length > 0
  const isLoading = exportExcelMutation.isPending

  // If no selected users, show simple button
  if (!hasSelectedUsers) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={handleExportAll}
              disabled={isLoading || users.length === 0}
              className={className}
            >
              {isLoading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <FileSpreadsheet className='mr-2 h-4 w-4' />
              )}
              <span className='hidden sm:inline'>
                {isLoading ? 'Đang xuất...' : 'Xuất Excel'}
              </span>
              <span className='sm:hidden'>
                {isLoading ? 'Xuất...' : 'Excel'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xuất tất cả {users.length} người dùng ra file Excel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // If has selected users, show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={isLoading || users.length === 0}
          className={className}
        >
          {isLoading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <FileSpreadsheet className='mr-2 h-4 w-4' />
          )}
          <span className='hidden sm:inline'>
            {isLoading ? 'Đang xuất...' : 'Xuất Excel'}
          </span>
          <span className='sm:hidden'>{isLoading ? 'Xuất...' : 'Excel'}</span>
          <Download className='ml-1 h-3 w-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2'>
          <FileSpreadsheet className='h-4 w-4' />
          Xuất dữ liệu Excel
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleExportSelected}
          disabled={isLoading}
          className='cursor-pointer'
        >
          <div className='flex items-center gap-2'>
            <div className='bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded text-xs font-medium'>
              {selectedUsers.length}
            </div>
            <div className='flex flex-col'>
              <span className='font-medium'>Xuất đã chọn</span>
              <span className='text-muted-foreground text-xs'>
                {selectedUsers.length} người dùng đã chọn
              </span>
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleExportAll}
          disabled={isLoading}
          className='cursor-pointer'
        >
          <div className='flex items-center gap-2'>
            <div className='bg-secondary/80 text-secondary-foreground flex h-6 w-6 items-center justify-center rounded text-xs font-medium'>
              {users.length}
            </div>
            <div className='flex flex-col'>
              <span className='font-medium'>Xuất tất cả</span>
              <span className='text-muted-foreground text-xs'>
                Toàn bộ {users.length} người dùng
              </span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
