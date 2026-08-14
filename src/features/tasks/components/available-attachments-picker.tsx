import { useRef, useState } from 'react'
import { CheckCircle, Download, Eye, FileText, Info } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { openFileForViewing } from '@/utils/file-viewer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAvailableAttachments } from '../hooks/use-available-attachments'
import { AvailableAttachment } from '../types/available-attachments'

interface AvailableAttachmentsPickerProps {
  parentTaskId: number
  selectedAttachmentIds: number[]
  onSelectionChange: (attachmentIds: number[]) => void
}

export function AvailableAttachmentsPicker({
  parentTaskId,
  selectedAttachmentIds,
  onSelectionChange,
}: AvailableAttachmentsPickerProps) {
  const { data: attachmentsResponse, isLoading } =
    useAvailableAttachments(parentTaskId)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const [showAll, setShowAll] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const attachments = attachmentsResponse?.data || []

  const handleAttachmentToggle = (attachmentId: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedAttachmentIds, attachmentId])
    } else {
      onSelectionChange(
        selectedAttachmentIds.filter((id) => id !== attachmentId)
      )
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const accessibleIds = attachments
        .filter((att) => att.canAccess)
        .map((att) => att.id)
      onSelectionChange(accessibleIds)
    } else {
      onSelectionChange([])
    }
  }

  const toggleExpanded = (attachmentId: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(attachmentId)) {
      newExpanded.delete(attachmentId)
    } else {
      newExpanded.add(attachmentId)
    }
    setExpandedItems(newExpanded)
  }

  const getAccessLevelBadge = (attachment: AvailableAttachment) => {
    const variants = {
      read_only: 'secondary',
      read_write: 'default',
      download_only: 'outline',
    } as const

    const labels = {
      read_only: 'Chỉ xem',
      read_write: 'Đọc/Ghi',
      download_only: 'Chỉ tải',
    }

    return (
      <Badge variant={variants[attachment.accessLevel]} className='text-xs'>
        {labels[attachment.accessLevel]}
      </Badge>
    )
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'parent_task': {
        return <FileText className='h-4 w-4 text-blue-600' />
      }
      default: {
        return <FileText className='h-4 w-4 text-gray-600' />
      }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>Tệp từ công việc cha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='border-primary h-6 w-6 animate-spin rounded-full border-b-2'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>Tệp từ công việc cha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <FileText className='text-muted-foreground/50 mb-2 h-12 w-12' />
            <p className='text-muted-foreground text-sm'>
              Không có tệp nào từ công việc cha
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const accessibleAttachments = attachments.filter((att) => att.canAccess)
  const allSelected =
    accessibleAttachments.length > 0 &&
    accessibleAttachments.every((att) => selectedAttachmentIds.includes(att.id))

  return (
    <Card ref={containerRef}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm'>
            Tệp từ công việc cha ({attachments.length})
          </CardTitle>
          {accessibleAttachments.length > 0 && (
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='select-all-attachments'
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor='select-all-attachments'
                className='cursor-pointer text-xs font-medium'
              >
                Chọn tất cả
              </label>
            </div>
          )}
        </div>
        <p className='text-muted-foreground text-xs'>
          Tệp đính kèm có thể tham chiếu từ công việc cha
        </p>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          {(showAll ? attachments : attachments.slice(0, 1)).map(
            (attachment) => (
              <div
                key={attachment.id}
                className={`max-w-full rounded-lg border p-2 transition-colors ${
                  selectedAttachmentIds.includes(attachment.id)
                    ? 'bg-primary/5 border-primary/20'
                    : 'hover:bg-muted/50'
                } ${attachment.canAccess ? '' : 'opacity-60'}`}
              >
                <div className='flex items-start gap-2'>
                  <div className='flex min-w-0 flex-1 items-center gap-2'>
                    {attachment.canAccess && (
                      <Checkbox
                        checked={selectedAttachmentIds.includes(attachment.id)}
                        onCheckedChange={(checked) => {
                          handleAttachmentToggle(
                            attachment.id,
                            checked === true
                          )
                        }}
                      />
                    )}

                    <div className='flex-shrink-0'>
                      {getSourceIcon(attachment.source)}
                    </div>

                    <div className='min-w-0 flex-1'>
                      <div className='mb-1 flex items-start gap-2'>
                        <p
                          className='max-w-[200px] overflow-hidden text-xs font-medium break-words'
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {attachment.fileName}
                        </p>
                        <div className='flex-shrink-0'>
                          {getAccessLevelBadge(attachment)}
                        </div>
                      </div>

                      <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                        <span className='flex-shrink-0'>
                          {formatFileSize(attachment.fileSize)}
                        </span>
                        <span className='flex-shrink-0'>•</span>
                        <span className='truncate'>
                          {attachment.sourceDescription}
                        </span>
                      </div>

                      {expandedItems.has(attachment.id) && (
                        <div className='border-border/50 mt-2 border-t pt-2'>
                          <div className='text-muted-foreground space-y-1 text-xs'>
                            {attachment.sourceTaskId && (
                              <div>Từ task: #{attachment.sourceTaskId}</div>
                            )}
                            {attachment.sourceAssignmentId && (
                              <div>
                                Assignment ID: {attachment.sourceAssignmentId}
                              </div>
                            )}
                            <div>
                              Ngày tạo:{' '}
                              {new Date(
                                attachment.createdAt
                              ).toLocaleDateString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center gap-0.5'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-5 w-5'
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleExpanded(attachment.id)
                          }}
                        >
                          <Info className='h-3 w-3' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className='text-xs'>
                        {expandedItems.has(attachment.id)
                          ? 'Ẩn chi tiết'
                          : 'Xem chi tiết'}
                      </TooltipContent>
                    </Tooltip>

                    {attachment.canAccess && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-5 w-5'
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()

                                // Enhanced file viewing with Office Online support
                                if (
                                  attachment.filePath &&
                                  attachment.fileName
                                ) {
                                  openFileForViewing(
                                    attachment.filePath,
                                    attachment.fileName
                                  )
                                }
                              }}
                            >
                              <Eye className='h-3 w-3' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className='text-xs'>
                            Xem tệp
                          </TooltipContent>
                        </Tooltip>

                        {attachment.accessLevel !== 'read_only' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-5 w-5'
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const link = document.createElement('a')
                                  link.href = attachment.filePath
                                  link.download = attachment.fileName
                                  document.body.append(link)
                                  link.click()
                                  link.remove()
                                }}
                              >
                                <Download className='h-3 w-3' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className='text-xs'>
                              Tải xuống
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {selectedAttachmentIds.includes(attachment.id) && (
                  <div className='border-primary/20 mt-2 flex items-center gap-1 border-t pt-2'>
                    <CheckCircle className='text-primary h-3 w-3' />
                    <span className='text-primary text-xs font-medium'>
                      Đã chọn để tham chiếu
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          {attachments.length > 1 && (
            <div className='flex justify-center pt-2'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowAll(!showAll)
                }}
                className='text-xs'
              >
                {showAll
                  ? 'Thu gọn'
                  : `Xem thêm ${attachments.length - 1} file`}
              </Button>
            </div>
          )}
        </div>

        {selectedAttachmentIds.length > 0 && (
          <div className='mt-3 border-t pt-3'>
            <div className='flex items-center gap-2 text-sm'>
              <CheckCircle className='text-primary h-4 w-4' />
              <span className='text-primary font-medium'>
                Đã chọn {selectedAttachmentIds.length} tệp để tham chiếu
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
