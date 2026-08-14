import { Link } from '@tanstack/react-router'
import { ChevronRight, PackagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CreateSubTaskSheet } from './create-sub-task-sheet'

interface TaskHierarchyCellProps {
  taskId: number
  level: number
  isLastChild: boolean
  className?: string
  hasSubtask: boolean
  onToggleSubtasks?: (taskId: number) => void
  filterType?: string
}

export function TaskHierarchyCell({
  taskId,
  level,
  isLastChild,
  className,
  onToggleSubtasks,
  hasSubtask,
  filterType,
}: TaskHierarchyCellProps) {
  const dialogs = useDialogs()

  const handleViewSubtask = () => {
    if (onToggleSubtasks) {
      onToggleSubtasks(taskId)
    }
  }

  const handleOpenSubtaskSheet = () => {
    void dialogs.sheet(CreateSubTaskSheet, {
      parentTaskId: taskId,
    })
  }

  return (
    <div className={cn('relative flex items-start', className)}>
      {level > 0 && (
        <>
          {/* Vertical line từ parent xuống */}
          <div
            className='border-primary absolute border-l-2 border-dashed'
            style={{
              left: `${(level - 1) * 12 + 4}px`,
              top: '-24px',
              height: isLastChild ? 'calc(50% + 12px)' : '100%',
            }}
          />

          {/* Horizontal line kết nối đến item */}
          <div
            className='absolute top-1/2 h-4 w-4 -translate-y-4'
            style={{
              left: `${(level - 1) * 12 + 4}px`,
            }}
          >
            <div className='border-primary h-full w-full rounded-bl border-b-2 border-l-2' />
          </div>
        </>
      )}

      <div
        className='relative flex items-center gap-0.5 sm:gap-1'
        style={{ marginLeft: level > 0 ? `${level * 12 + 12}px` : undefined }}
      >
        <Button
          variant='link'
          size='sm'
          className={cn(
            'h-auto p-0 text-xs sm:text-sm',
            level > 0 && 'text-muted-foreground'
          )}
        >
          <Link to='/tasks/$task-id' params={{ 'task-id': String(taskId) }}>
            <span className='sm:hidden'>#{taskId ?? 'N/A'}</span>
            <span className='hidden sm:inline'>#{taskId ?? 'N/A'}</span>
          </Link>
        </Button>
        {filterType === 'assigned' && hasSubtask && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 ml-1 size-6 rounded-full p-0 shadow-sm transition-all duration-200 hover:shadow-md sm:size-8'
                onClick={handleViewSubtask}
              >
                <ChevronRight className='text-primary h-3 w-3 sm:h-4 sm:w-4' />
                <span className='sr-only'>Hiện thị công việc con</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className='px-2 py-1 text-xs'>
              Hiện thị công việc con
            </TooltipContent>
          </Tooltip>
        )}
        {filterType === 'received' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 ml-1 size-6 rounded-full p-0 shadow-sm transition-all duration-200 hover:shadow-md sm:size-8'
                onClick={handleOpenSubtaskSheet}
              >
                <PackagePlus className='text-primary h-3 w-3 sm:h-4 sm:w-4' />
                <span className='sr-only'>Thêm công việc con</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className='px-2 py-1 text-xs'>
              Thêm công việc con
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
