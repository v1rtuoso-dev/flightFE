import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  Building2,
  Mail,
  Users,
  UserSearch,
  AlertTriangle,
  Clock4,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDialogs } from '@/hooks/use-dialogs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Task, TaskAssignment, TaskFilterTypes } from '../types'
import { TaskAssignmentStatusBadge } from './task-assignment-status-badge'
import { TaskAssignmentsDialog } from './task-assignments-dialog'

interface TaskAssignmentsDisplayProps {
  assignments: TaskAssignment[]
  maxVisible?: number
  task: Task
  filterType: TaskFilterTypes
  allowCellEditing: boolean
}

export function TaskAssignmentsDisplay({
  assignments,
  task,
  filterType,
  allowCellEditing,
}: TaskAssignmentsDisplayProps) {
  const dialogs = useDialogs()

  const handleViewAssignments = async () => {
    await dialogs.open(TaskAssignmentsDialog, {
      task,
      filterType,
      allowCellEditing,
    })
  }

  // Kiểm tra có assignment urgent hoặc approaching không
  const hasUrgent = assignments?.some((assignment) => assignment?.isUrgent)
  const hasApproaching = assignments?.some(
    (assignment) => assignment?.isApproaching && !assignment?.isUrgent
  )

  // Xác định màu cho button chính
  const getButtonClasses = () => {
    if (hasUrgent) {
      return 'bg-red-100 border-red-500 hover:bg-red-200 shadow-red-200 shadow-lg ring-2 ring-red-300/50'
    }
    if (hasApproaching) {
      return 'bg-green-50 border-green-300 hover:bg-green-100 shadow-green-100 shadow-md ring-2 ring-green-200/50'
    }
    return 'hover:border-primary hover:bg-primary/5'
  }

  // Xác định màu cho avatar
  const getAvatarClasses = () => {
    if (hasUrgent) {
      return 'ring-red-300 bg-red-100 hover:ring-red-400'
    }
    if (hasApproaching) {
      return 'ring-green-300 bg-green-50 hover:ring-green-400'
    }
    return 'ring-background hover:ring-primary/20'
  }

  return (
    <div className='flex items-center -space-x-2'>
      <Popover>
        <PopoverTrigger asChild>
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn('transition-all duration-300 ease-in-out')}>
                  <Button
                    size='icon'
                    variant='outline'
                    className={cn(
                      'size-8 rounded-full border-2 border-dashed transition-all duration-200 hover:border-solid',
                      getButtonClasses()
                    )}
                    onClick={handleViewAssignments}
                  >
                    <UserSearch className='size-4' />
                    <span className='sr-only'> Danh sách phân công</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className='px-2 py-1 text-xs'>
                Danh sách phân công
              </TooltipContent>
            </Tooltip>
            {assignments && assignments.length > 0 && (
              <Avatar
                className={cn(
                  'cursor-pointer ring-2 transition-all duration-200 ease-out hover:shadow-lg',
                  getAvatarClasses()
                )}
              >
                <AvatarFallback className='text-xs font-medium'>
                  +{assignments.length}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </PopoverTrigger>

        {assignments && assignments.length > 0 && (
          <PopoverContent className='w-80 p-2 pr-0'>
            <ScrollArea className='max-h-72 w-full overflow-y-auto'>
              <div className='space-y-3'>
                {assignments.map((assignment, index) => {
                  const user =
                    assignment.recipientUser ||
                    assignment.recipientTeamLead ||
                    assignment.recipientUnitLead
                  const name =
                    user?.name ||
                    assignment.recipientTeamName ||
                    assignment.recipientUnitName ||
                    'Người dùng không xác định'
                  // Xác định màu nền dựa trên isUrgent và isApproaching
                  const getBackgroundClasses = () => {
                    if (assignment?.isUrgent) {
                      return 'bg-red-100 border-red-400 rounded-lg p-2 shadow-red-100 shadow-md'
                    }
                    if (assignment?.isApproaching) {
                      return 'bg-green-50 border-green-200 rounded-lg p-2'
                    }
                    return ''
                  }

                  return (
                    <div
                      key={assignment.assignmentId || index}
                      className={cn(
                        'space-y-1 border-b pb-2 last:border-b-0',
                        getBackgroundClasses()
                      )}
                    >
                      <div className='flex items-center gap-2'>
                        <p className='truncate text-sm font-medium'>{name}</p>
                        {assignment?.isUrgent && (
                          <Badge variant='destructive' className='text-xs'>
                            <AlertTriangle className='mr-1 h-3 w-3' />
                            Khẩn cấp
                          </Badge>
                        )}
                        {assignment?.isApproaching && !assignment?.isUrgent && (
                          <Badge
                            variant='secondary'
                            className='bg-green-100 text-xs text-green-800'
                          >
                            <Clock4 className='mr-1 h-3 w-3' />
                            Sắp tới hạn
                          </Badge>
                        )}
                      </div>
                      {user?.email && (
                        <p className='text-muted-foreground flex min-w-0 items-center gap-1 text-sm'>
                          <Mail className='h-3 w-3 flex-shrink-0' />
                          <span className='truncate'>{user.email}</span>
                        </p>
                      )}
                      {user?.teamName && (
                        <p className='text-muted-foreground flex min-w-0 items-center gap-1 text-sm'>
                          <Users className='h-3 w-3 flex-shrink-0' />
                          <span className='truncate'>{user.teamName}</span>
                        </p>
                      )}
                      {user?.unitName && (
                        <p className='text-muted-foreground flex min-w-0 items-center gap-1 text-sm'>
                          <Building2 className='h-3 w-3 flex-shrink-0' />
                          <span className='truncate'>{user.unitName}</span>
                        </p>
                      )}
                      {assignment && assignment.status && (
                        <div className='space-y-1 pt-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-muted-foreground text-xs'>
                              Trạng thái:
                            </span>
                            <TaskAssignmentStatusBadge
                              status={assignment.status}
                              size='sm'
                            />
                          </div>
                          {assignment.dueAt && (
                            <div className='flex items-center gap-2'>
                              <span className='text-muted-foreground text-xs'>
                                Hạn:
                              </span>
                              <span className='text-xs'>
                                {format(
                                  new Date(assignment.dueAt),
                                  'dd/MM/yyyy HH:mm',
                                  { locale: vi }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
