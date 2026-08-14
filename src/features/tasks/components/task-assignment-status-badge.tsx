import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TaskAssignmentStatus } from '@/features/tasks/types'
import {
  allTaskAssignmentStatusLabels,
  taskAssignmentsStatusIcons,
  taskAssignmentsStatusStyles,
} from '@/features/tasks/utils'

interface TaskAssignmentStatusBadgeProps {
  status: TaskAssignmentStatus
  showIcon?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function TaskAssignmentStatusBadge({
  status,
  showIcon = true,
  className,
  size = 'md',
}: TaskAssignmentStatusBadgeProps) {
  const label = allTaskAssignmentStatusLabels[status] || status
  const Icon = taskAssignmentsStatusIcons[status]
  const statusStyle =
    taskAssignmentsStatusStyles[status] ||
    'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <Badge
      className={cn(
        'border font-medium',
        statusStyle,
        size === 'sm' && 'h-5 px-1.5 py-0.5 text-[10px]',
        size === 'md' && 'h-6 px-2 py-0.5 text-xs',
        className
      )}
    >
      {showIcon && Icon && (
        <Icon
          className={cn('shrink-0', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')}
        />
      )}
      <span className='truncate'>{label}</span>
    </Badge>
  )
}
