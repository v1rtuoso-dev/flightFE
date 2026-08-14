import { useRef } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Eye, Trash, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_COUNT,
  MAX_TOTAL_FILES_SIZE,
} from '@/constants/file'
import { Button } from '@/components/ui/button'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
} from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useUploadAttachments } from '../../attachments/hooks/use-upload-attachments'
import { CreateSubTaskFormOutput } from '../types'
import { taskPriorityOptions } from '../utils'
import { AvailableAttachmentsPicker } from './available-attachments-picker'
import { TaskAssignmentsField } from './task-assignments-field'

interface CreateSubTaskFormProps {
  form: UseFormReturn<CreateSubTaskFormOutput>
  formId: string
  onSubmit: (data: CreateSubTaskFormOutput) => Promise<void>
  parentTaskId: number
  selectedAvailableAttachments: number[]
  onAvailableAttachmentsChange: (attachmentIds: number[]) => void
}

export function CreateSubTaskForm({
  form,
  formId,
  onSubmit,
  parentTaskId,
  selectedAvailableAttachments,
  onAvailableAttachmentsChange,
}: CreateSubTaskFormProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const uploadAttachments = useUploadAttachments()

  const handleFilesUpload = async (files: File[]) => {
    try {
      const uploadedFiles = await uploadAttachments(files, {
        onProgress: () => {},
        onError: () => {},
      })
      const currentAttachmentIds = form.getValues('attachmentIds') || []
      const newAttachmentIds = uploadedFiles.attachmentIds || []

      form.setValue('attachmentIds', [
        ...currentAttachmentIds,
        ...newAttachmentIds,
      ])

      toast.success(`Đã tải lên ${files.length} tệp`)
    } catch {
      toast.error('Không thể tải lên tệp')
    }
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4'
      >
        {/* Content Field */}
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Nội dung công việc</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='min-h-32'
                  placeholder='Nhập mô tả chi tiết nội dung công việc'
                  ref={contentRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions Field */}
        <FormField
          control={form.control}
          name='instructions'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Hướng dẫn thực hiện</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='min-h-20'
                  placeholder='Nhập hướng dẫn chi tiết để thực hiện công việc'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority Field */}
        <FormField
          control={form.control}
          name='priority'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Mức độ ưu tiên</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn mức độ ưu tiên' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {taskPriorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className='flex items-center gap-2'>
                          <div
                            className={cn(
                              'size-2 rounded-full',
                              option.className
                            )}
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Assignments Field */}
        <TaskAssignmentsField form={form} name='assignments' />

        {/* Available Attachments Picker - Nằm giữa assignments và file upload */}
        <div className='space-y-3'>
          <h3 className='text-sm font-medium'>Kế thừa file từ công việc cha</h3>
          <AvailableAttachmentsPicker
            parentTaskId={parentTaskId}
            selectedAttachmentIds={selectedAvailableAttachments}
            onSelectionChange={onAvailableAttachmentsChange}
          />
        </div>

        {/* Notes Field */}
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className='min-h-20'
                  placeholder='Nhập ghi chú bổ sung (tùy chọn)'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Upload Field */}
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel>Tệp đính kèm</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value || []}
                  onValueChange={field.onChange}
                  onAccept={handleFilesUpload}
                  maxFiles={MAX_FILES_COUNT}
                  maxSize={MAX_FILE_SIZE}
                  maxTotalSize={MAX_TOTAL_FILES_SIZE}
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                >
                  <FileUploadDropzone className='p-4'>
                    <div className='flex flex-col items-center gap-2 text-center'>
                      <div className='bg-muted flex size-10 items-center justify-center rounded-lg'>
                        <Upload className='size-4' />
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        <span className='font-semibold'>Nhấp để tải lên</span>{' '}
                        hoặc kéo thả tệp vào đây
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        Hỗ trợ: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (tối đa{' '}
                        {MAX_FILES_COUNT} tệp, mỗi tệp &lt; 10MB)
                      </div>
                    </div>
                  </FileUploadDropzone>
                  <FileUploadList className='w-full max-w-full space-y-2'>
                    {(field.value || []).map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className='flex max-w-full flex-col gap-2 overflow-hidden rounded-lg border p-3'
                      >
                        <div className='flex w-full max-w-full items-center gap-3 overflow-hidden'>
                          <FileUploadItemPreview className='shrink-0' />
                          <div className='min-w-0 flex-1 overflow-hidden'>
                            <FileUploadItemMetadata />
                          </div>
                          <div className='flex shrink-0 items-center gap-1 sm:gap-2'>
                            <Button
                              type='button'
                              variant='secondary'
                              size='sm'
                              className='px-2 sm:px-3'
                              onClick={() => {
                                const url = URL.createObjectURL(file)
                                window.open(url, '_blank')
                              }}
                            >
                              <Eye className='h-4 w-4' />
                              <span className='hidden sm:inline'>
                                Xem trước
                              </span>
                            </Button>
                            <FileUploadItemDelete type='button' asChild>
                              <Button
                                type='button'
                                variant='destructive'
                                size='sm'
                                className='px-2 sm:px-3'
                                onClick={() => {
                                  const newFiles = [...(field.value || [])]
                                  newFiles.splice(index, 1)
                                  field.onChange(newFiles)
                                }}
                              >
                                <Trash className='h-4 w-4' />
                                <span className='hidden sm:inline'>Xóa</span>
                              </Button>
                            </FileUploadItemDelete>
                          </div>
                        </div>
                        <FileUploadItemProgress />
                      </FileUploadItem>
                    ))}
                  </FileUploadList>
                </FileUpload>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
