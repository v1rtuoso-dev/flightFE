import { format } from 'date-fns'
import {
  ArrayPath,
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { dateFormatPatterns } from '@/config/date'
import { PlusCircle, UserPlus2, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
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
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/datetime-picker'
import { SearchableSelect } from '@/components/searchable-select'
import { useRecipientOptions } from '../hooks/use-recipient-options'

type TaskAssignmentsFieldProps<T extends FieldValues = FieldValues> = {
  form: UseFormReturn<T>
  name: ArrayPath<T>
}

export function TaskAssignmentsField<T extends FieldValues = FieldValues>({
  form,
  name,
}: TaskAssignmentsFieldProps<T>) {
  const { getRecipientOptions, deriveRecipientOptions } = useRecipientOptions()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name as ArrayPath<T>,
  })

  const assignmentValues = useWatch({
    control: form.control,
    name: name as Path<T>,
  })

  const handleAddAssignment = () => {
    append({
      recipientId: null,
      recipientType: '',
      dueAt: null,
      note: '',
    } as any)
  }

  return (
    <div className='space-y-4'>
      <FormLabel>Đối tượng phân công</FormLabel>

      {fields.length === 0 && (
        <Card className='border-2 border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Button
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

      <div className='space-y-4'>
        {fields.map((field, index) => (
          <Card key={field.id} className='border-l-4 p-3 shadow-sm sm:p-4'>
            <div className='mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold sm:size-10'>
                  {index + 1}
                </div>
                <div>
                  <h4 className='text-foreground text-base font-semibold sm:text-lg'>
                    Đối tượng phân công {index + 1}
                  </h4>
                  <p className='text-muted-foreground text-xs sm:text-sm'>
                    Chỉ định đối tượng thực hiện và thời hạn hoàn thành
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
                className='border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive flex w-full items-center justify-center gap-2 sm:w-auto'
                disabled={fields.length === 1}
              >
                <UserX className='size-4' />
                <span className='sm:inline'>Xóa phân công</span>
              </Button>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <FormField
                  control={form.control}
                  name={`${name}.${index}.recipientType` as Path<T>}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-foreground/80 text-sm font-medium'>
                        Loại đối tượng nhận
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          // Reset recipientId when recipient type changes
                          form.setValue(
                            `${name}.${index}.recipientId` as Path<T>,
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
                            <SelectItem key={type.value} value={type.value}>
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
                  name={`${name}.${index}.recipientId` as Path<T>}
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
                              field.onChange(value ? Number(value) : null)
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
                  name={`${name}.${index}.dueAt` as Path<T>}
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
                name={`${name}.${index}.note` as Path<T>}
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-foreground/80 text-sm font-medium'>
                      Ghi chú phân công
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Nhập ghi chú phân công'
                        className='min-h-20'
                        {...field}
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
                        const recipientTypeName = deriveRecipientOptions.find(
                          (t) =>
                            t.value === assignmentValues?.[index]?.recipientType
                        )?.label

                        const recipientType =
                          assignmentValues?.[index]?.recipientType
                        const recipientId =
                          assignmentValues?.[index]?.recipientId
                        const dueDate = assignmentValues?.[index]?.dueAt

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
  )
}
