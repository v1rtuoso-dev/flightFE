import { z } from 'zod'
import { format } from 'date-fns'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dateFormatPatterns } from '@/config/date'
import { PlusCircle, UserPlus2, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/datetime-picker'
import { SearchableSelect } from '@/components/searchable-select'
import { useCreateTaskAssignmentsMutation } from '../hooks/use-create-task-assignments'
import { useRecipientOptions } from '../hooks/use-recipient-options'
import { createTaskAssignmentsSchema } from '../schema'
import { Task } from '../types'

type TaskSheetFormValues = z.infer<typeof createTaskAssignmentsSchema>

interface TaskAssignmentFormSheetPayload {
  task: Task
}

export const TaskAssignmentFormSheet = ({
  payload,
  open,
  onClose,
}: DialogProps<TaskAssignmentFormSheetPayload>) => {
  const { id: taskId } = payload.task
  const taskAssignmentsMutation = useCreateTaskAssignmentsMutation()
  const { getRecipientOptions, deriveRecipientOptions } = useRecipientOptions()

  const form = useForm<TaskSheetFormValues>({
    resolver: zodResolver(createTaskAssignmentsSchema),
    defaultValues: {
      assignments: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'assignments',
  })

  const assignmentValues = useWatch({
    control: form.control,
    name: 'assignments',
  })

  const handleAddAssignment = () => {
    append({
      recipientId: null,
      recipientType: 'USER',
      note: '',
    } as any)
  }

  const handleSubmit = (data: TaskSheetFormValues) => {
    const promise = taskAssignmentsMutation.mutateAsync({
      body: {
        assignments: data.assignments,
        taskId: taskId,
      },
    })

    toast.promise(promise, {
      loading: 'Đang tạo phân công...',
      success: async () => {
        await onClose()
        form.reset()
        return `Tạo phân công công việc thành công!`
      },
      error: `Không thể tạo phân công công việc. Vui lòng thử lại.`,
    })
  }

  return (
    <Sheet open={open} onOpenChange={() => void onClose()}>
      <SheetContent className='flex h-full w-full flex-col sm:max-w-4xl lg:max-w-5xl'>
        <SheetHeader className='flex-shrink-0 border-b'>
          <SheetTitle>Tạo phân công công việc</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex min-h-0 flex-1 flex-col'
          >
            <div className='min-h-0 flex-1 overflow-y-auto px-4 pb-2'>
              <div className='space-y-4'>
                <FormLabel>Đối tượng phân công</FormLabel>

                {fields.length === 0 && (
                  <Card className='border-2 border-dashed'>
                    <CardContent className='flex flex-col items-center justify-center py-12'>
                      <Button
                        type='button'
                        variant='outline'
                        className='h-12 rounded-full px-2.5'
                        onClick={handleAddAssignment}
                      >
                        <span className='bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full'>
                          <UserPlus2 />
                        </span>
                        Thêm phân công
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className='space-y-6'>
                  {fields.map((field, index) => (
                    <Card key={field.id} className='border-l-4 p-4 shadow-sm'>
                      <div className='mb-6 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-bold'>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className='text-foreground text-lg font-semibold'>
                              Đối tượng phân công {index + 1}
                            </h4>
                            <p className='text-muted-foreground text-sm'>
                              Chỉ định đối tượng thực hiện và thời hạn hoàn
                              thành
                            </p>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            remove(index)
                          }}
                          className='border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2'
                          disabled={fields.length === 1}
                        >
                          <UserX className='size-4' />
                          Xóa phân công
                        </Button>
                      </div>

                      <div className='space-y-6'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                          <FormField
                            control={form.control}
                            name={`assignments.${index}.recipientType`}
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-foreground/80 text-sm font-medium'>
                                  Loại đối tượng nhận
                                </FormLabel>
                                <Select
                                  onValueChange={(value) => {
                                    field.onChange(value)
                                    form.setValue(
                                      `assignments.${index}.recipientId`,
                                      null as any,
                                      {
                                        shouldDirty: true,
                                        shouldTouch: false,
                                        shouldValidate: false,
                                      }
                                    )
                                  }}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className='w-full overflow-hidden'>
                                      <SelectValue placeholder='Chọn loại đối tượng nhận' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {deriveRecipientOptions.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`assignments.${index}.recipientId`}
                            render={({ field }) => {
                              const currentRecipientType =
                                assignmentValues?.[index]?.recipientType
                              const options = getRecipientOptions(
                                currentRecipientType || ''
                              )

                              return (
                                <FormItem className='w-full'>
                                  <FormLabel className='text-foreground/80 text-sm font-medium'>
                                    Đối tượng nhận
                                  </FormLabel>
                                  <FormControl>
                                    <SearchableSelect
                                      value={field.value}
                                      onChange={(value) => {
                                        field.onChange(Number(value))
                                      }}
                                      options={options}
                                      placeholder='Chọn đối tượng nhận'
                                      searchPlaceholder='Tìm kiếm đối tượng nhận...'
                                      emptyText={
                                        options.length === 0
                                          ? 'Vui lòng chọn loại người nhận'
                                          : 'Không tìm thấy đối tượng nhận'
                                      }
                                      disabled={!currentRecipientType}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )
                            }}
                          />

                          <FormField
                            control={form.control}
                            name={`assignments.${index}.dueAt`}
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel className='text-foreground/80 text-sm font-medium'>
                                  Thời hạn hoàn thành
                                </FormLabel>
                                <FormControl>
                                  <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder='Chọn thời hạn hoàn thành'
                                    startHour={7}
                                    endHour={18}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`assignments.${index}.note`}
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              <FormLabel className='text-foreground/80 text-sm font-medium'>
                                Ghi chú phân công
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Nhập ghi chú phân công'
                                  className='min-h-24'
                                  value={field.value as string}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Assignment Summary Badge */}
                        {assignmentValues?.[index]?.recipientId &&
                          assignmentValues?.[index]?.recipientType && (
                            <div className='border-primary/20 bg-primary/5 rounded-lg border p-3'>
                              <div className='flex items-center gap-2'>
                                <span className='text-sm font-medium'>
                                  Tóm tắt phân công
                                </span>
                              </div>
                              <p className='mt-1 text-sm'>
                                {(() => {
                                  const recipientTypeName =
                                    deriveRecipientOptions.find(
                                      (t) =>
                                        t.value ===
                                        assignmentValues?.[index]?.recipientType
                                    )?.label

                                  const recipientType =
                                    assignmentValues?.[index]?.recipientType
                                  const recipientId =
                                    assignmentValues?.[index]?.recipientId
                                  const dueDate =
                                    assignmentValues?.[index]?.dueAt

                                  const recipientLabel =
                                    getRecipientOptions(recipientType).find(
                                      (r: { value: number; label: string }) =>
                                        r.value === recipientId
                                    )?.label || ''

                                  const dueDateText = dueDate
                                    ? ` - Thời hạn hoàn thành: ${format(new Date(dueDate), dateFormatPatterns.fullDate)}`
                                    : ''

                                  return `${recipientTypeName}: ${recipientLabel}${dueDateText}`
                                })()}
                              </p>
                            </div>
                          )}
                      </div>
                    </Card>
                  ))}
                </div>

                {fields.length > 0 && (
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full border-2 border-dashed'
                    onClick={handleAddAssignment}
                  >
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Thêm phân công khác
                  </Button>
                )}
              </div>
            </div>
            <div className='flex-shrink-0 border-t p-4'>
              <Button type='submit' size='lg' className='w-full'>
                Lưu phân công
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
