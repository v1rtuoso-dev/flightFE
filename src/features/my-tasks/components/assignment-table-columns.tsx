import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { vi } from 'date-fns/locale'
import {
  CheckCheck,
  PlusCircle,
  Paperclip,
  MessageSquare,
  Undo2,
} from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { TaskAssignmentStatusBadge } from '@/features/tasks/components/task-assignment-status-badge'
import { TaskAssignment } from '@/features/tasks/types'
import {
  priorityLabels,
  priorityStyles,
  priorityIcons,
} from '@/features/tasks/utils'

// Extended type combining task and assignment data
export interface AssignmentRowData extends Omit<TaskAssignment, 'status'> {
  // Override status to include DONE_LATE
  status?: 'WORKING' | 'DONE' | 'DONE_LATE' | 'CANCELLED' | 'OVERDUE'
  // Task properties
  taskId: number
  taskTitle: string
  taskContent: string
  taskPriority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  taskAttachments?: Array<{
    id: number
    fileName: string
    filePath: string
    fileSize: number
  }>
}

interface AssignmentTableColumnsProps {
  onCompleteAssignment: (assignment: AssignmentRowData) => void
  onRevertAssignment: (assignment: AssignmentRowData) => void
  onOpenComments: (assignment: AssignmentRowData) => void
  onCreateSubTask: (assignment: AssignmentRowData) => void
  onViewAttachments: (assignment: AssignmentRowData) => void
}

export function useAssignmentTableColumns({
  onCompleteAssignment,
  onRevertAssignment,
  onOpenComments,
  onCreateSubTask,
  onViewAttachments,
}: AssignmentTableColumnsProps): ColumnDef<AssignmentRowData>[] {
  const { user: currentUser } = useAuth()

  // Business logic: Check if current user can complete this assignment
  const canCompleteAssignment = (assignment: AssignmentRowData): boolean => {
    if (!currentUser) return false

    // USER assignment: only recipient can complete
    if (assignment.recipientType === 'USER') {
      return assignment.recipientUser?.id === currentUser.id
    }

    // TEAM assignment: team members and team lead can complete
    if (assignment.recipientType === 'TEAM') {
      return (
        currentUser.teamId === assignment.recipientId ||
        assignment.recipientTeamLead?.id === currentUser.id
      )
    }

    // UNIT assignment: unit members and unit lead can complete
    if (assignment.recipientType === 'UNIT') {
      return (
        currentUser.unitId === assignment.recipientId ||
        assignment.recipientUnitLead?.id === currentUser.id
      )
    }

    return false
  }

  // Business logic: Check if current user can comment on this assignment
  const canCommentOnAssignment = (assignment: AssignmentRowData): boolean => {
    if (!currentUser) return false

    // All authenticated users can comment on assignments they can see
    // USER assignment: only recipient can comment
    if (assignment.recipientType === 'USER') {
      return assignment.recipientUser?.id === currentUser.id
    }

    // TEAM assignment: team members and team lead can comment
    if (assignment.recipientType === 'TEAM') {
      return (
        currentUser.teamId === assignment.recipientId ||
        assignment.recipientTeamLead?.id === currentUser.id
      )
    }

    // UNIT assignment: unit members and unit lead can comment
    if (assignment.recipientType === 'UNIT') {
      return (
        currentUser.unitId === assignment.recipientId ||
        assignment.recipientUnitLead?.id === currentUser.id
      )
    }

    return false
  }

  // Business logic: Check if current user can create sub task for this assignment
  const canCreateSubTaskForAssignment = (
    assignment: AssignmentRowData
  ): boolean => {
    if (!currentUser) return false

    // Similar logic as completing assignment - users who can work on assignment can create sub tasks
    // USER assignment: only recipient can create sub tasks
    if (assignment.recipientType === 'USER') {
      return assignment.recipientUser?.id === currentUser.id
    }

    // TEAM assignment: team members and team lead can create sub tasks
    if (assignment.recipientType === 'TEAM') {
      return (
        currentUser.teamId === assignment.recipientId ||
        assignment.recipientTeamLead?.id === currentUser.id
      )
    }

    // UNIT assignment: unit members and unit lead can create sub tasks
    if (assignment.recipientType === 'UNIT') {
      return (
        currentUser.unitId === assignment.recipientId ||
        assignment.recipientUnitLead?.id === currentUser.id
      )
    }

    return false
  }

  return [
    // Mã công việc với link và nút tạo công việc con
    {
      id: 'taskId',
      accessorKey: 'taskId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Mã công việc' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const taskId = assignment.taskId
        const canCreateSubTask = canCreateSubTaskForAssignment(assignment)

        return (
          <div className='flex items-center gap-1.5 border-r border-gray-300 pr-3'>
            <Link
              to='/tasks/$task-id'
              params={{ 'task-id': String(taskId) }}
              className='group inline-flex items-center rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-bold text-blue-700 ring-1 ring-blue-200 transition-all duration-300 hover:scale-105 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md active:scale-95'
            >
              <span className='font-mono tracking-wide'>#{String(taskId)}</span>
            </Link>

            {canCreateSubTask && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={(e) => {
                      e.stopPropagation()
                      onCreateSubTask(assignment)
                    }}
                    className='group rounded-full p-0 text-emerald-600 transition-all duration-300 hover:scale-110 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-lg'
                    style={{ width: '40px', height: '40px' }}
                  >
                    <PlusCircle
                      className='transition-all duration-300 group-hover:scale-110 group-hover:rotate-180'
                      style={{ width: '24px', height: '24px' }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side='top'
                  className='border-0 bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-xl'
                >
                  <p className='font-medium'>✨ Tạo công việc con</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
      size: 100,
      enableSorting: false,
      enableHiding: false,
    },

    // Trạng thái assignment
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng thái' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        return (
          <div className='border-r border-gray-300 pr-3'>
            <TaskAssignmentStatusBadge
              status={assignment.status || 'WORKING'}
            />
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

    // Độ ưu tiên
    {
      id: 'taskPriority',
      accessorKey: 'taskPriority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Độ ưu tiên' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const priority = assignment.taskPriority || 'NORMAL'
        const PriorityIcon = priorityIcons[priority]

        return (
          <div className='border-r border-gray-300 pr-3'>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${priorityStyles[priority]}`}
            >
              <PriorityIcon className='h-3 w-3' />
              {priorityLabels[priority]}
            </div>
          </div>
        )
      },
      size: 90,
      enableSorting: false,
      enableHiding: true,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },

    // Nội dung công việc
    {
      id: 'taskContent',
      accessorKey: 'taskContent',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nội dung công việc' />
      ),
      cell: ({ row }) => {
        const content = row.getValue('taskContent')

        // Hiển thị label default nếu không có nội dung
        if (
          !content ||
          (typeof content === 'string' && content.trim() === '')
        ) {
          return (
            <div className='max-w-[450px] min-w-[300px] border-r border-gray-300 pr-3'>
              <span className='text-muted-foreground italic'>
                Chưa có nội dung
              </span>
            </div>
          )
        }

        // Chuyển đổi an toàn content thành string
        const displayContent =
          typeof content === 'string' ? content : JSON.stringify(content)

        return (
          <div className='max-w-[450px] min-w-[300px] border-r border-gray-300 pr-3'>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className='truncate text-sm leading-relaxed font-medium'>
                  {displayContent}
                </p>
              </TooltipTrigger>
              <TooltipContent className='max-w-[500px]' side='top'>
                <p className='wrap-break-word whitespace-normal'>
                  {displayContent}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
      size: 350,
      enableSorting: false,
      enableHiding: false,
    },

    // Hạn hoàn thành
    {
      id: 'dueAt',
      accessorKey: 'dueAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hạn hoàn thành' />
      ),
      cell: ({ row }) => {
        const dueAt = row.getValue('dueAt')
        if (!dueAt)
          return (
            <div className='w-32 max-w-36 min-w-28 border-r border-gray-300 pr-3'>
              <span className='text-muted-foreground'>-</span>
            </div>
          )

        const dueDate = new Date(dueAt as string)
        const now = new Date()
        const isOverdue = dueDate < now
        const isUrgent = dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000 // 24 hours

        return (
          <div className='w-32 max-w-36 min-w-28 border-r border-gray-300 pr-3'>
            <div className='flex flex-col gap-0.5'>
              <span
                className={`text-sm font-semibold ${
                  isOverdue
                    ? 'text-destructive'
                    : isUrgent
                      ? 'text-orange-600'
                      : 'text-slate-800'
                }`}
              >
                {format(dueDate, 'dd/MM/yyyy', { locale: vi })}
              </span>
              <span
                className={`text-sm font-medium ${
                  isOverdue
                    ? 'text-red-500'
                    : isUrgent
                      ? 'text-amber-600'
                      : 'text-blue-600'
                }`}
              >
                {format(dueDate, 'HH:mm', { locale: vi })}
              </span>
            </div>
          </div>
        )
      },
      size: 140,
      maxSize: 160,
      minSize: 120,
      enableSorting: false,
      enableHiding: false,
    },

    // Tệp đính kèm
    {
      id: 'taskAttachments',
      accessorKey: 'taskAttachments',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tệp đính kèm' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const attachments = assignment.taskAttachments || []

        if (attachments.length === 0) {
          return (
            <div className='border-r border-gray-300 pr-3'>
              <span className='text-muted-foreground text-sm italic'>
                Không có tệp
              </span>
            </div>
          )
        }

        return (
          <div className='border-r border-gray-300 pr-3'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    onViewAttachments(assignment)
                  }}
                  className='h-8 px-2 hover:bg-gray-50'
                >
                  <div className='flex items-center gap-1'>
                    <Paperclip className='h-3.5 w-3.5' />
                    <Badge variant='secondary' className='h-5 px-1.5 text-xs'>
                      {attachments.length}
                    </Badge>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>
                <div className='space-y-1'>
                  <p className='font-medium'>
                    Tệp đính kèm ({attachments.length}):
                  </p>
                  {attachments.slice(0, 3).map((attachment) => (
                    <p key={attachment.id} className='text-sm'>
                      • {attachment.fileName}
                    </p>
                  ))}
                  {attachments.length > 3 && (
                    <p className='text-muted-foreground text-sm'>
                      ... và {attachments.length - 3} tệp khác
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
      size: 100,
      enableSorting: false,
      enableHiding: false,
    },

    // Hành động
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hành động' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const canComplete = canCompleteAssignment(assignment)
        const canComment = canCommentOnAssignment(assignment)
        const canShowCompleteButton =
          canComplete &&
          assignment.status !== 'DONE' &&
          assignment.status !== 'DONE_LATE' &&
          assignment.status !== 'CANCELLED'

        const canShowRevertButton =
          canComplete &&
          (assignment.status === 'DONE' || assignment.status === 'DONE_LATE')

        return (
          <div className='flex items-center gap-1'>
            {/* Hoàn thành công việc */}
            {canShowCompleteButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      onCompleteAssignment(assignment)
                    }}
                    className='h-8 w-8 p-0 transition-colors hover:bg-green-50 hover:text-green-700'
                  >
                    <CheckCheck className='h-4 w-4' />
                    <span className='sr-only'>Hoàn thành công việc</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Hoàn thành công việc</TooltipContent>
              </Tooltip>
            )}

            {/* Hoàn tác công việc */}
            {canShowRevertButton && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      onRevertAssignment(assignment)
                    }}
                    className='h-8 w-8 p-0 transition-colors hover:bg-orange-50 hover:text-orange-700'
                  >
                    <Undo2 className='h-4 w-4' />
                    <span className='sr-only'>
                      Hoàn tác về trạng thái đang làm
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  Hoàn tác về trạng thái đang làm
                </TooltipContent>
              </Tooltip>
            )}

            {/* Comment/Chat */}
            {canComment && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      onOpenComments(assignment)
                    }}
                    className='h-8 w-8 p-0 transition-colors hover:bg-purple-50 hover:text-purple-700'
                  >
                    <MessageSquare className='h-4 w-4' />
                    <span className='sr-only'>Mở khung chat để comment</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  Mở khung chat để comment
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        )
      },
      size: 100,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
