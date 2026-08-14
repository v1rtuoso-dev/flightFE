import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { EditTaskRoute } from '@/routes/_authenticated/tasks/$task-id/edit'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { updateTaskSchema } from '@/features/tasks/schema'
import { getTaskDetailQueryOptions } from '../task-detail/hooks/use-task-detail'
import { taskTypesQueryOptions } from './components/use-task-types'
import { TASK_TYPES_KEYS } from './constants'
import { useUpdateTask } from './hooks/use-update-task'
import { UpdateTaskFormOutput } from './types'
import { taskPriorityOptions } from './utils'

export default function EditTaskPage() {
  const taskId = EditTaskRoute.useParams()['task-id']
  const searchParams = EditTaskRoute.useSearch()
  const navigate = EditTaskRoute.useNavigate()
  const currentType = searchParams.type || 'assigned'

  const { data: taskDetailsQuery } = useSuspenseQuery(
    getTaskDetailQueryOptions(Number(taskId))
  )
  const { data: taskTypesResponse } = useQuery({
    ...taskTypesQueryOptions(),
  })

  const taskTypeOptions = (taskTypesResponse?.data ?? []).map((type) => ({
    id: type.id,
    name: type.name,
  }))

  const updateTaskMutation = useUpdateTask(currentType)

  const taskData = taskDetailsQuery?.data || {}

  const form = useForm<UpdateTaskFormOutput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      content: taskData.content || '',
      instructions: taskData.instructions || '',
      taskTypeId: taskData.taskType?.id || 0,
      notes: taskData.notes || '',
      priority: taskData.priority || 'LOW',
    },
  })

  const currentTaskTypeId = form.watch('taskTypeId')
  const isTextProcessing =
    Number(currentTaskTypeId) === TASK_TYPES_KEYS.textProcessing

  const onSubmit = (data: UpdateTaskFormOutput) => {
    const { content, instructions, taskTypeId, notes, priority } = data

    const taskUpdatePromise = updateTaskMutation.mutateAsync({
      params: {
        path: {
          id: Number(taskId),
        },
      },
      body: {
        content,
        instructions,
        taskTypeId: Number(taskTypeId),
        notes,
        priority,
      },
    })

    toast.promise(taskUpdatePromise, {
      loading: `Đang cập nhật công việc #${taskId}...`,
      success: () => {
        void navigate({ to: '/tasks', search: { type: currentType } })
        return `Công việc #${taskId} đã được cập nhật thành công!`
      },
      error: `Không thể cập nhật công việc #${taskId}`,
    })
  }

  return (
    <div className='px-4 py-2'>
      <Card className='py-4'>
        <CardHeader>
          <CardTitle>Chỉnh sửa công việc</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              id='tasks-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mức độ ưu tiên</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0'>
                          <SelectValue placeholder='Chọn mức độ ưu tiên' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className='flex flex-col gap-2'>
                            {taskPriorityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={cn(
                                  'cursor-pointer',
                                  option.className
                                )}
                              >
                                <div className='flex items-center gap-2'>
                                  {option.icon && (
                                    <option.icon
                                      className={cn('h-3 w-3 bg-transparent')}
                                    />
                                  )}
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='taskTypeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại công việc</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(event) => {
                          field.onChange(event)
                          if (event !== currentTaskTypeId) {
                            form.setValue('instructions', '')
                          }
                        }}
                        value={field.value?.toString() ?? ''}
                      >
                        <SelectTrigger className='w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0'>
                          <SelectValue placeholder='Chọn loại công việc' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className='flex flex-col gap-2'>
                            {taskTypeOptions.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={option.id!.toString()}
                                className={cn('cursor-pointer')}
                              >
                                <span>{option.name}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isTextProcessing && (
                <FormField
                  control={form.control}
                  name='instructions'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Chỉ đạo</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-32'
                          placeholder='Nhập chỉ đạo công việc'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Ghi chú công việc</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className='min-h-32'
                        placeholder='Nhập ghi chú thêm về công việc'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-2'>
          <Button
            form='tasks-form'
            type='submit'
            size='lg'
            disabled={updateTaskMutation.isPending}
          >
            Lưu công việc
          </Button>
        </div>
      </Card>
    </div>
  )
}
