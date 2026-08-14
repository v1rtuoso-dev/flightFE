import React, { useCallback, useRef } from 'react'
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
import { useCreateTask } from '../hooks/use-create-task'
import { useCreateTaskForm } from '../hooks/use-create-task-form'
import {
  CreateSubTaskFormOutput,
  CreateTaskFormOutput,
  TaskFilterTypes,
} from '../types'
import { CreateTaskForm } from './create-task-form'

interface CreateTaskSheetPayload {
  filterType: TaskFilterTypes
}

export const CreateTaskSheet: React.FC<DialogProps<CreateTaskSheetPayload>> = ({
  open,
  onClose,
  payload: { filterType },
}) => {
  const createTaskMutation = useCreateTask(filterType)
  const abortControllerRef = useRef<AbortController | null>(null)

  const onReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const { form } = useCreateTaskForm({
    open,
    onReset,
  })

  const onSubmit = useCallback(
    ({ files, ...rest }: CreateTaskFormOutput | CreateSubTaskFormOutput) => {
      const createTaskPromise = createTaskMutation.mutateAsync({
        body: rest as any,
      })

      toast.promise(createTaskPromise, {
        loading: `Đang tạo công việc...`,
        success: () => {
          form.reset()
          void onClose()
          return `Tạo công việc thành công!`
        },
        error: (error) =>
          error?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.',
      })
    },
    [createTaskMutation, form, onClose]
  )

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
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
          <SheetTitle>Tạo công việc</SheetTitle>
          <SheetDescription>
            Tạo công việc mới và giao cho các thành viên trong đội
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='min-h-0 flex-1'>
          <div className='flex flex-col gap-6 px-6 py-4'>
            <CreateTaskForm
              form={form as any}
              formId='create-tasks-form'
              onSubmit={onSubmit}
            />
          </div>
        </ScrollArea>

        <SheetFooter className='flex-row justify-end shadow-sm backdrop-blur-sm'>
          <SheetClose asChild>
            <Button variant='outline' size='lg'>
              <ChevronLeftIcon />
              Hủy
            </Button>
          </SheetClose>
          <Button form='create-tasks-form' type='submit' size='lg'>
            Tạo công việc
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
