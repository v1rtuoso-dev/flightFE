import { Calendar, Clock, FileText, Star, Tag } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@/features/tasks/types'

interface TaskInformationCardProps {
  task: Task
}

const priorityConfig = {
  LOW: {
    label: 'Thấp',
    variant: 'secondary' as const,
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
    icon: 'text-green-500',
  },
  NORMAL: {
    label: 'Bình thường',
    variant: 'outline' as const,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    icon: 'text-blue-500',
  },
  HIGH: {
    label: 'Cao',
    variant: 'default' as const,
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800',
    icon: 'text-orange-500',
  },
  URGENT: {
    label: 'Khẩn cấp',
    variant: 'destructive' as const,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
    icon: 'text-red-500',
  },
}

const statusConfig = {
  OPEN: {
    label: 'Mở',
    color: 'text-gray-600',
    bg: 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-700',
    icon: 'text-gray-500',
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800',
    icon: 'text-blue-500',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800',
    icon: 'text-green-500',
  },
  COMPLETED_LATE: {
    label: 'Hoàn thành trễ',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
    icon: 'text-yellow-500',
  },
  OVERDUE: {
    label: 'Quá hạn',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800',
    icon: 'text-red-500',
  },
}

export function TaskInformationCard({ task }: TaskInformationCardProps) {
  const priorityData = task.priority ? priorityConfig[task.priority] : null
  const statusData = task.status ? statusConfig[task.status] : null

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='bg-gradient-to-r from-blue-50 via-white to-indigo-50 pb-4 dark:from-blue-950/20 dark:via-slate-900/50 dark:to-indigo-950/20'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900/50'>
            <FileText className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          </div>
          <span className='bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-300 dark:to-indigo-300'>
            Thông tin công việc
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className='p-0'>
        {/* Task Header - compact */}
        <div className='border-b bg-gradient-to-r from-slate-50 to-gray-50 px-4 py-4 dark:from-slate-900/30 dark:to-gray-900/30'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Tag className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                <span className='font-mono text-lg font-bold text-blue-700 dark:text-blue-300'>
                  #{task.id}
                </span>
              </div>

              {task.taskType && (
                <div className='flex items-center gap-1.5 rounded-full bg-blue-100 px-2 py-1 dark:bg-blue-900/30'>
                  <div className='h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                  <span className='text-xs font-medium text-blue-700 dark:text-blue-300'>
                    {task.taskType.name}
                  </span>
                </div>
              )}
            </div>

            <div className='flex items-center gap-2'>
              {priorityData && (
                <Badge
                  variant={priorityData.variant}
                  className='flex items-center gap-1 px-2 py-1 text-xs font-medium'
                >
                  <Star className='h-3 w-3' />
                  {priorityData.label}
                </Badge>
              )}

              {statusData && (
                <Badge
                  variant='outline'
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium ${statusData.color} ${statusData.bg}`}
                >
                  <Clock className='h-3 w-3' />
                  {statusData.label}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - compact */}
        <div className='space-y-4 p-4'>
          {/* Content Section */}
          <div className='rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 dark:border-blue-700 dark:from-blue-950/20 dark:via-slate-900/50 dark:to-indigo-950/20'>
            <div className='mb-2 flex items-center gap-2'>
              <div className='rounded-md bg-blue-100 p-1 dark:bg-blue-900/50'>
                <FileText className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-sm font-semibold text-blue-900 dark:text-blue-100'>
                Nội dung công việc
              </h3>
            </div>
            <div className='rounded-md bg-white/50 p-3 dark:bg-slate-800/50'>
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100'>
                {task.content || (
                  <span className='text-gray-500 italic dark:text-gray-400'>
                    Không có nội dung được cung cấp
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Instructions & Notes - compact grid */}
          {(task.instructions || task.notes) && (
            <div className='grid gap-3 md:grid-cols-2'>
              {task.instructions && (
                <div className='rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3 dark:border-amber-700 dark:from-amber-950/20 dark:to-orange-950/20'>
                  <div className='mb-2 flex items-center gap-2'>
                    <div className='rounded-md bg-amber-100 p-1 dark:bg-amber-900/50'>
                      <FileText className='h-3 w-3 text-amber-600 dark:text-amber-400' />
                    </div>
                    <h4 className='text-xs font-semibold text-amber-800 dark:text-amber-200'>
                      Hướng dẫn thực hiện
                    </h4>
                  </div>
                  <div className='rounded-md bg-amber-50/80 p-2 dark:bg-amber-950/30'>
                    <p className='text-xs leading-relaxed whitespace-pre-wrap text-amber-700 dark:text-amber-300'>
                      {task.instructions}
                    </p>
                  </div>
                </div>
              )}

              {task.notes && (
                <div className='rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-3 dark:border-emerald-700 dark:from-emerald-950/20 dark:to-teal-950/20'>
                  <div className='mb-2 flex items-center gap-2'>
                    <div className='rounded-md bg-emerald-100 p-1 dark:bg-emerald-900/50'>
                      <FileText className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                    </div>
                    <h4 className='text-xs font-semibold text-emerald-800 dark:text-emerald-200'>
                      Ghi chú bổ sung
                    </h4>
                  </div>
                  <div className='rounded-md bg-emerald-50/80 p-2 dark:bg-emerald-950/30'>
                    <p className='text-xs leading-relaxed whitespace-pre-wrap text-emerald-700 dark:text-emerald-300'>
                      {task.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Creator Info - compact */}
          {task.createdByUser && (
            <div className='rounded-lg border bg-gradient-to-r from-gray-50 to-slate-50 p-3 dark:from-gray-900/30 dark:to-slate-900/30'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-8 w-8 ring-2 ring-blue-100 dark:ring-blue-800'>
                    <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white'>
                      {task.createdByUser.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                      {task.createdByUser.name}
                    </p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      {task.createdByUser.roleName || 'Người tạo công việc'}
                    </p>
                    {task.createdByUser.email && (
                      <p className='text-xs text-gray-500 dark:text-gray-500'>
                        {task.createdByUser.email}
                      </p>
                    )}
                  </div>
                </div>

                {task.createdAt && (
                  <div className='text-right'>
                    <div className='flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400'>
                      <Calendar className='h-3 w-3' />
                      <span>
                        {new Date(task.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-500'>
                      {new Date(task.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
