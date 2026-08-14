import { FileUpIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AttachmentItem } from '@/features/attachments/types'
import { TaskFilterTypes } from '../types'
import { TaskAttachmentsFileList } from './task-attachments-file-list'
import { TaskAttachmentsUploader } from './task-attachments-uploader'

interface TaskAttachmentsDisplayProps {
  attachments: AttachmentItem[]
  taskId: number
  filterType: TaskFilterTypes
  level?: number
  allowCellEditing: boolean
  createdByUserId?: number // ID của user tạo task - dùng để kiểm tra quyền thêm/xóa file
}

export function TaskAttachmentsDisplay({
  attachments,
  taskId,
  filterType,
  level = 0,
  allowCellEditing,
  createdByUserId, // ID của user tạo task
}: TaskAttachmentsDisplayProps) {
  const { user } = useAuth() // Lấy thông tin user hiện tại đang login
  const count = attachments.length // Số lượng file đính kèm
  // Kiểm tra quyền: chỉ cho phép user tạo task có thể thêm/xóa file đính kèm
  const isTaskCreator = user?.id === createdByUserId // So sánh ID user hiện tại với ID user tạo task
  const isDisabled = !allowCellEditing || level > 0 || !isTaskCreator // Disable nếu không phải creator

  return (
    <div className='group flex items-center gap-2'>
      {/* Hiển thị nút thêm file chỉ khi user là creator của task */}
      {!isDisabled && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn('transition-all duration-200 ease-out')}>
              <TaskAttachmentsUploader taskId={taskId} filterType={filterType}>
                <Button
                  size='icon'
                  variant='outline'
                  className='hover:border-primary hover:bg-primary/5 size-8 rounded-full border-2 border-dashed transition-all duration-200 hover:border-solid'
                >
                  <FileUpIcon className='size-4' />
                  <span className='sr-only'>Thêm tệp đính kèm</span>
                </Button>
              </TaskAttachmentsUploader>
            </div>
          </TooltipTrigger>
          <TooltipContent className='px-2 py-1 text-xs'>
            Thêm tệp đính kèm
          </TooltipContent>
        </Tooltip>
      )}

      {/* Hiển thị avatar số lượng file nếu có file đính kèm */}
      {count > 0 && (
        <div className='flex items-center -space-x-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Avatar className='ring-background hover:ring-primary/20 cursor-pointer ring-2 transition-all duration-200 ease-out hover:shadow-lg'>
                <AvatarFallback className='bg-muted text-xs font-medium'>
                  +{count}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>

            <PopoverContent className='w-80 p-2 pr-0'>
              {/* Truyền ID creator để TaskAttachmentsFileList kiểm tra quyền xóa */}
              <TaskAttachmentsFileList
                attachments={attachments}
                taskId={taskId}
                filterType={filterType}
                isDisabled={isDisabled}
                createdByUserId={createdByUserId} // Truyền ID creator để kiểm tra quyền xóa file
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}
