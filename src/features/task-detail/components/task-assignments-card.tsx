import { format } from 'date-fns'
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Users,
  Clock4,
  UserCheck,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TaskAssignmentStatusBadge } from '@/features/tasks/components/task-assignment-status-badge'
import { TaskAssignment } from '@/features/tasks/types'

interface TaskAssignmentsCardProps {
  assignments: TaskAssignment[]
  isTaskOwner: boolean
}

interface TaskAssignmentItemProps {
  assignment: TaskAssignment
  index: number

  isTaskOwner: boolean
}

function TaskAssignmentItem({ assignment, index }: TaskAssignmentItemProps) {
  const recipientName =
    assignment.recipientUser?.name ??
    assignment.recipientTeamName ??
    assignment.recipientUnitName ??
    'Người dùng không xác định'

  // Xác định màu nền và style dựa trên trạng thái
  const getCardClasses = () => {
    if (assignment.isUrgent) {
      return 'border-red-300 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-lg ring-2 ring-red-200 dark:border-red-700 dark:from-red-950/20 dark:via-slate-900/50 dark:to-red-950/20'
    }
    if (assignment.isApproaching) {
      return 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-lg ring-2 ring-emerald-200 dark:border-emerald-700 dark:from-emerald-950/20 dark:via-slate-900/50 dark:to-emerald-950/20'
    }
    return 'border-gray-200 bg-gradient-to-br from-gray-50 via-white to-slate-50 shadow-md hover:shadow-lg dark:border-gray-700 dark:from-gray-900/20 dark:via-slate-900/50 dark:to-gray-900/20'
  }

  const getAvatarStyle = () => {
    if (assignment.isUrgent) {
      return 'ring-4 ring-red-200 dark:ring-red-800'
    }
    if (assignment.isApproaching) {
      return 'ring-4 ring-emerald-200 dark:ring-emerald-800'
    }
    return 'ring-2 ring-blue-100 dark:ring-blue-800'
  }

  return (
    <div
      key={assignment.assignmentId || index}
      className={cn(
        'group relative overflow-hidden rounded-md border p-3 transition-all duration-200 hover:shadow-sm',
        getCardClasses()
      )}
    >
      {/* Status indicator bar */}
      <div className='absolute top-0 left-0 z-10 h-full w-0.5'>
        {assignment.isUrgent && (
          <div className='h-full bg-gradient-to-b from-red-500 to-red-600'></div>
        )}
        {assignment.isApproaching && !assignment.isUrgent && (
          <div className='h-full bg-gradient-to-b from-emerald-500 to-emerald-600'></div>
        )}
        {!assignment.isUrgent && !assignment.isApproaching && (
          <div className='h-full bg-gradient-to-b from-blue-500 to-blue-600'></div>
        )}
      </div>

      <div className='relative z-20 flex items-start gap-2.5'>
        <Avatar className={cn('h-8 w-8 shrink-0', getAvatarStyle())}>
          <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white'>
            {recipientName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          {/* Header with name and status - single line */}
          <div className='mb-2 flex items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-1.5'>
              <h4 className='truncate text-sm font-semibold text-gray-900 dark:text-gray-100'>
                {recipientName}
              </h4>

              {assignment.isUrgent && (
                <Badge
                  variant='destructive'
                  className='flex shrink-0 items-center gap-0.5 px-1 py-0.5 text-xs'
                >
                  <Zap className='h-2 w-2' />
                  <span className='hidden sm:inline'>Khẩn</span>
                </Badge>
              )}

              {assignment.isApproaching && !assignment.isUrgent && (
                <Badge className='flex shrink-0 items-center gap-0.5 bg-emerald-100 px-1 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'>
                  <Clock4 className='h-2 w-2' />
                  <span className='hidden sm:inline'>Sắp tới</span>
                </Badge>
              )}
            </div>

            {assignment.status && (
              <div className='shrink-0'>
                <TaskAssignmentStatusBadge status={assignment.status} />
              </div>
            )}
          </div>

          {/* Contact info - inline and compact */}
          {(assignment.recipientUser?.email ||
            assignment.recipientUser?.teamName) && (
            <div className='mb-2 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400'>
              {assignment.recipientUser?.email && (
                <div className='flex items-center gap-1.5'>
                  <Mail className='h-3 w-3 text-blue-500' />
                  <span className='truncate'>
                    {assignment.recipientUser.email}
                  </span>
                </div>
              )}
              {assignment.recipientUser?.teamName && (
                <div className='flex items-center gap-1.5'>
                  <Building className='h-3 w-3 text-purple-500' />
                  <span className='truncate'>
                    {assignment.recipientUser.teamName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Timeline info - horizontal layout */}
          <div className='flex items-center gap-4 text-xs text-gray-500'>
            {assignment.assignedAt && (
              <div className='flex items-center gap-1'>
                <UserCheck className='h-3 w-3' />
                <span className='hidden sm:inline'>Phân công:</span>
                <span className='font-medium'>
                  {format(new Date(assignment.assignedAt), 'dd/MM HH:mm')}
                </span>
              </div>
            )}

            {assignment.dueAt && (
              <div className='flex items-center gap-1'>
                <Calendar className='h-3 w-3 text-orange-500' />
                <span className='hidden sm:inline'>Hạn:</span>
                <span className='font-medium'>
                  {format(new Date(assignment.dueAt), 'dd/MM HH:mm')}
                </span>
              </div>
            )}

            {assignment.completedAt && (
              <div className='flex items-center gap-1'>
                <CheckCircle className='h-3 w-3 text-green-500' />
                <span className='hidden sm:inline'>Hoàn thành:</span>
                <span className='font-medium'>
                  {format(new Date(assignment.completedAt), 'dd/MM HH:mm')}
                </span>
              </div>
            )}
          </div>

          {/* Notes section - compact */}
          {assignment.note && (
            <div className='mt-2 rounded border border-blue-200 bg-blue-50 p-2 dark:border-blue-700 dark:bg-blue-950/20'>
              <div className='mb-1 flex items-center gap-1'>
                <Clock className='h-2.5 w-2.5 text-blue-600 dark:text-blue-400' />
                <span className='text-xs font-medium text-blue-800 dark:text-blue-300'>
                  Ghi chú
                </span>
              </div>
              <p className='line-clamp-2 text-xs leading-relaxed text-blue-700 dark:text-blue-300'>
                {assignment.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TaskAssignmentsCard({
  assignments,
  isTaskOwner,
}: TaskAssignmentsCardProps) {
  if (!assignments || assignments.length === 0) {
    return (
      <Card className='overflow-hidden'>
        <CardHeader className='bg-gradient-to-r from-gray-50 via-white to-slate-50 pb-4 dark:from-gray-950/20 dark:via-slate-900/50 dark:to-gray-950/20'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <div className='rounded-full bg-gray-100 p-2 dark:bg-gray-900/50'>
              <Users className='h-5 w-5 text-gray-600 dark:text-gray-400' />
            </div>
            <span className='bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent dark:from-gray-300 dark:to-slate-300'>
              Đối tượng phân công
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='py-12 text-center'>
          <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800'>
            <Users className='h-12 w-12 text-gray-400' />
          </div>
          <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Chưa có phân công nào
          </h3>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            Công việc này chưa được phân công cho ai.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Separate urgent, approaching, and normal assignments
  const urgentAssignments = assignments.filter((a) => a.isUrgent)
  const approachingAssignments = assignments.filter(
    (a) => a.isApproaching && !a.isUrgent
  )
  const normalAssignments = assignments.filter(
    (a) => !a.isUrgent && !a.isApproaching
  )

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='bg-gradient-to-r from-blue-50 via-white to-indigo-50 pb-4 dark:from-blue-950/20 dark:via-slate-900/50 dark:to-indigo-950/20'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900/50'>
            <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          </div>
          <span className='bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-300'>
            Đối tượng phân công
          </span>
          <div className='ml-auto flex items-center gap-2'>
            <Badge
              variant='outline'
              className='bg-white/80 dark:bg-slate-800/80'
            >
              <span className='text-sm font-medium'>
                {assignments.length} người
              </span>
            </Badge>
            {urgentAssignments.length > 0 && (
              <Badge variant='destructive' className='shadow-sm'>
                <Zap className='mr-1 h-3 w-3' />
                {urgentAssignments.length} khẩn cấp
              </Badge>
            )}
            {approachingAssignments.length > 0 && (
              <Badge className='bg-emerald-100 text-emerald-800 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-300'>
                <Clock4 className='mr-1 h-3 w-3' />
                {approachingAssignments.length} sắp tới hạn
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col p-0'>
        <div className='flex-1 p-6'>
          {assignments.length <= 3 ? (
            /* Show all assignments without scroll for small lists */
            <div className='space-y-3'>
              {/* Urgent assignments first */}
              {urgentAssignments.map((assignment, index) => (
                <TaskAssignmentItem
                  key={assignment.assignmentId || `urgent-${index}`}
                  assignment={assignment}
                  index={index}
                  isTaskOwner={isTaskOwner}
                />
              ))}

              {/* Then approaching assignments */}
              {approachingAssignments.map((assignment, index) => (
                <TaskAssignmentItem
                  key={assignment.assignmentId || `approaching-${index}`}
                  assignment={assignment}
                  index={index}
                  isTaskOwner={isTaskOwner}
                />
              ))}

              {/* Finally normal assignments */}
              {normalAssignments.map((assignment, index) => (
                <TaskAssignmentItem
                  key={assignment.assignmentId || `normal-${index}`}
                  assignment={assignment}
                  index={index}
                  isTaskOwner={isTaskOwner}
                />
              ))}
            </div>
          ) : (
            /* Use scroll area for longer lists */
            <ScrollArea className='max-h-[70vh] min-h-[300px] pr-4'>
              <div className='space-y-3 pb-4'>
                {/* Urgent assignments first */}
                {urgentAssignments.map((assignment, index) => (
                  <TaskAssignmentItem
                    key={assignment.assignmentId || `urgent-${index}`}
                    assignment={assignment}
                    index={index}
                    isTaskOwner={isTaskOwner}
                  />
                ))}

                {/* Then approaching assignments */}
                {approachingAssignments.map((assignment, index) => (
                  <TaskAssignmentItem
                    key={assignment.assignmentId || `approaching-${index}`}
                    assignment={assignment}
                    index={index}
                    isTaskOwner={isTaskOwner}
                  />
                ))}

                {/* Finally normal assignments */}
                {normalAssignments.map((assignment, index) => (
                  <TaskAssignmentItem
                    key={assignment.assignmentId || `normal-${index}`}
                    assignment={assignment}
                    index={index}
                    isTaskOwner={isTaskOwner}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Summary footer for better UX */}
        {assignments.length > 3 && (
          <div className='border-t bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900/50'>
            <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400'>
              <span>Tổng cộng: {assignments.length} đối tượng phân công</span>
              <div className='flex items-center gap-2'>
                {urgentAssignments.length > 0 && (
                  <span className='text-red-600 dark:text-red-400'>
                    {urgentAssignments.length} khẩn cấp
                  </span>
                )}
                {approachingAssignments.length > 0 && (
                  <span className='text-emerald-600 dark:text-emerald-400'>
                    {approachingAssignments.length} sắp tới hạn
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
