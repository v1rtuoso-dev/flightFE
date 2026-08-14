import { Download, Eye, FileText } from 'lucide-react'
import { openFileForViewing } from '@/utils/file-viewer'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AssignmentRowData } from './assignment-table-columns'

interface TaskAttachmentsDialogPayload {
  assignment: AssignmentRowData
}

const handleView = (attachment: { filePath?: string; fileName?: string }) => {
  if (attachment.filePath && attachment.fileName) {
    openFileForViewing(attachment.filePath, attachment.fileName)
  }
}

const handleDownload = (attachment: {
  filePath?: string
  fileName?: string
}) => {
  if (attachment.filePath && attachment.fileName) {
    // For downloading: use download attribute to force download
    const link = document.createElement('a')
    link.href = attachment.filePath
    link.download = attachment.fileName
    link.target = '_blank'
    document.body.append(link)
    link.click()
    link.remove()
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

export function TaskAttachmentsDialog({
  open,
  onClose,
  payload,
}: DialogProps<TaskAttachmentsDialogPayload>) {
  const { assignment } = payload
  const attachments = assignment.taskAttachments || []

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) void onClose()
      }}
    >
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            Tệp đính kèm - Công việc #{assignment.taskId}
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 overflow-auto'>
          {attachments.length === 0 ? (
            <div className='text-muted-foreground flex h-32 items-center justify-center'>
              Không có tệp đính kèm nào
            </div>
          ) : (
            <TooltipProvider>
              <div className='space-y-3'>
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className='flex items-start gap-3 rounded-lg border p-4'
                  >
                    <FileText className='text-muted-foreground h-8 w-8 flex-shrink-0' />

                    <div className='min-w-0 flex-1'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className='cursor-help truncate pr-2 text-sm font-medium'>
                            {attachment.fileName}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='max-w-xs break-words'>
                            {attachment.fileName}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <p className='text-muted-foreground text-xs'>
                        {formatFileSize(attachment.fileSize)}
                      </p>
                    </div>

                    <div className='flex flex-shrink-0 items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          handleView(attachment)
                        }}
                        className='gap-1.5 whitespace-nowrap'
                      >
                        <Eye className='h-4 w-4' />
                        Xem
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          handleDownload(attachment)
                        }}
                        className='gap-1.5 whitespace-nowrap'
                      >
                        <Download className='h-4 w-4' />
                        Tải xuống
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
