import React, { useCallback, useRef, useState } from 'react'
import { ChevronLeftIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCreateSubtask } from '../hooks/use-create-subtask'
import { useCreateSubtaskForm } from '../hooks/use-create-subtask-form'
import { CreateSubTaskFormOutput } from '../types'
import { AvailableAttachmentsPicker } from './available-attachments-picker'
import { CreateTaskForm } from './create-task-form'

interface CreateSubTaskSheetPayload {
  parentTaskId: number
}

export const CreateSubTaskSheet: React.FC<
  DialogProps<CreateSubTaskSheetPayload>
> = ({ payload, open, onClose }) => {
  const { parentTaskId } = payload
  const createSubtaskMutation = useCreateSubtask()
  const abortControllerRef = useRef<AbortController | null>(null)
  const [selectedAvailableAttachments, setSelectedAvailableAttachments] =
    useState<number[]>([])

  const onReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const { form } = useCreateSubtaskForm({
    open,
    onReset,
  })

  const onSubmit = useCallback(
    async ({ files, ...rest }: CreateSubTaskFormOutput): Promise<void> => {
      try {
        // TODO: Implement inherited attachments after API is updated
        // For now, we'll create the subtask first, then handle inherited attachments separately
        // Combine form attachments with selected available attachments
        const allAttachmentIds = [
          ...(rest.attachmentIds || []),
          ...selectedAvailableAttachments,
        ]

        const createTaskPromise = createSubtaskMutation.mutateAsync({
          body: {
            // Follow backend API - only send what backend expects
            content: rest.content,
            instructions: rest.instructions,
            notes: rest.notes,
            priority: rest.priority,
            assignments: rest.assignments,
            attachmentIds: allAttachmentIds,
          } as any, // Type assertion to bypass incorrect generated types
          params: {
            path: {
              parentId: parentTaskId,
            },
          },
        })

        // TODO: After successful subtask creation, call an endpoint to link inherited attachments
        // if (selectedAvailableAttachments.length > 0) {
        //   await linkInheritedAttachments(createdTaskId, selectedAvailableAttachments)
        // }

        toast.promise(createTaskPromise, {
          loading: `Đang tạo công việc con...`,
          success: () => {
            void onClose()
            return `Tạo công việc con thành công!`
          },
          error: `Không thể tạo công việc con. Vui lòng thử lại.`,
          finally: () => {
            form.reset()
          },
        })

        await createTaskPromise
      } catch {
        toast.error('Có lỗi xảy ra khi tạo công việc con')
      }
    },
    [
      createSubtaskMutation,
      onClose,
      form,
      parentTaskId,
      selectedAvailableAttachments,
    ]
  )

  return (
    <Sheet open={open} onOpenChange={() => void onClose()}>
      <SheetContent
        className='flex w-full flex-col sm:max-w-4xl lg:max-w-5xl'
        onPointerDownOutside={(e) => {
          e.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className='shadow-sm backdrop-blur-sm'>
          <SheetTitle>Tạo công việc con</SheetTitle>
          <SheetDescription>
            Tạo công việc con cho công việc #{parentTaskId}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='min-h-0 flex-1'>
          <div className='flex flex-col gap-6 px-6 py-4'>
            <CreateTaskForm
              form={form}
              formId='create-sub-tasks-form'
              onSubmit={onSubmit}
              hideTaskType
              availableAttachmentsSlot={
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium'>
                    Kế thừa file từ công việc cha
                  </h3>
                  <AvailableAttachmentsPicker
                    parentTaskId={parentTaskId}
                    selectedAttachmentIds={selectedAvailableAttachments}
                    onSelectionChange={setSelectedAvailableAttachments}
                  />
                </div>
              }
            />
          </div>
        </ScrollArea>

        <SheetFooter className='flex-row justify-end shadow-sm backdrop-blur-sm'>
          <SheetClose asChild>
            <Button variant='outline' size='lg' onClick={() => void onClose()}>
              <ChevronLeftIcon />
              Hủy
            </Button>
          </SheetClose>
          <Button form='create-sub-tasks-form' type='submit' size='lg'>
            Tạo công việc con
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
