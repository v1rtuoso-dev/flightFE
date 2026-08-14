import { Link } from '@tanstack/react-router'
import { Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { useDeleteTasksConfirm } from '@/features/tasks/hooks/use-delete-tasks-confirm'
import { Task } from '@/features/tasks/types'

interface TaskDetailHeaderProps {
  task: Task
}

export function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  const { onDeleteTasks } = useDeleteTasksConfirm('assigned')
  const { user } = useAuth()
  const isTaskOwner = task?.createdByUser?.id === user?.id

  return (
    <div className='mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-end'>
      {isTaskOwner && (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Button
            variant='outline'
            asChild
            className='gap-1 sm:gap-2'
            size='sm'
          >
            <Link
              to='/tasks/$task-id/edit'
              params={{
                'task-id': task.id!.toString(),
              }}
            >
              <Edit className='h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
              <span className='text-xs sm:text-sm'>Chỉnh sửa</span>
            </Link>
          </Button>
          <Button
            variant='destructive'
            className='gap-1 sm:gap-2'
            onClick={() => onDeleteTasks([task])}
            size='sm'
          >
            <Trash2 className='h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
            <span className='text-xs sm:text-sm'>Xóa</span>
          </Button>
        </div>
      )}
    </div>
  )
}
