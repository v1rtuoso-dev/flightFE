import { useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconFilter,
  IconCalendar,
  IconUsers,
  IconUserCheck,
} from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
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
import MultipleSelector from '@/components/ui/multiselect'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/datetime-picker'
import { useStatisticsRecipientOptions } from '../hooks/use-recipient-options'
import { statisticsFilterSchema, type StatisticsFilterInput } from '../schema'

interface StatisticsFilterProps {
  onFilter: (data: StatisticsFilterInput) => void
  isLoading?: boolean
}

export function StatisticsFilter({
  onFilter,
  isLoading,
}: StatisticsFilterProps) {
  const [recipientType, setRecipientType] = useState<string>('')

  const { teamOptions, unitOptions, userOptions } =
    useStatisticsRecipientOptions()

  const form = useForm<StatisticsFilterInput>({
    resolver: zodResolver(statisticsFilterSchema),
    defaultValues: {
      recipientType: undefined,
      recipientIds: [],
      dateRange: {
        startDate: format(new Date(), dateFormatPatterns.standardizedDate),
        endDate: format(new Date(), dateFormatPatterns.standardizedDate),
      },
    },
  })

  const handleSubmit = (data: StatisticsFilterInput) => {
    onFilter(data)
  }

  const getRecipientOptions = () => {
    switch (recipientType) {
      case 'USER': {
        return userOptions
      }
      case 'TEAM': {
        return teamOptions
      }
      case 'UNIT': {
        return unitOptions
      }
      default: {
        return []
      }
    }
  }

  const getRecipientIcon = () => {
    switch (recipientType) {
      case 'USER': {
        return <IconUsers className='h-4 w-4' />
      }
      case 'TEAM': {
        return <IconUserCheck className='h-4 w-4' />
      }
      case 'UNIT': {
        return <IconUserCheck className='h-4 w-4' />
      }
      default: {
        return <IconFilter className='h-4 w-4' />
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconFilter className='h-5 w-5' />
          Bộ lọc thống kê
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-6'
          >
            <div className='space-y-6'>
              {/* Row 1: Recipient Type and Selection */}
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='recipientType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại đối tượng</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setRecipientType(value)
                          form.setValue('recipientIds', [])
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn loại đối tượng' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='USER'>Cá nhân</SelectItem>
                          <SelectItem value='TEAM'>Đội</SelectItem>
                          <SelectItem value='UNIT'>Tổ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {recipientType && (
                  <FormField
                    control={form.control}
                    name='recipientIds'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center gap-2'>
                          {getRecipientIcon()}
                          Chọn{' '}
                          {recipientType === 'USER'
                            ? 'cá nhân'
                            : recipientType === 'TEAM'
                              ? 'đội'
                              : 'tổ'}
                        </FormLabel>
                        <FormControl>
                          <MultipleSelector
                            options={getRecipientOptions()}
                            value={
                              field.value?.map((id) => {
                                const option = getRecipientOptions().find(
                                  (opt) => opt.value === String(id)
                                )
                                return (
                                  option || {
                                    value: String(id),
                                    label: String(id),
                                  }
                                )
                              }) || []
                            }
                            onChange={(values: any) => {
                              field.onChange(
                                values.map((v: any) => Number(v.value))
                              )
                            }}
                            placeholder={`Chọn ${
                              recipientType === 'USER'
                                ? 'cá nhân'
                                : recipientType === 'TEAM'
                                  ? 'đội'
                                  : 'tổ'
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Row 2: Date Range */}
              <div className='grid gap-4 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='dateRange.startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <IconCalendar className='h-4 w-4' />
                        Từ ngày
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={(date: string | undefined) => {
                            field.onChange(date || '')
                          }}
                          placeholder='Chọn ngày bắt đầu'
                          allowPastDates={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dateRange.endDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        <IconCalendar className='h-4 w-4' />
                        Đến ngày
                      </FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={(date: string | undefined) => {
                            field.onChange(date || '')
                          }}
                          placeholder='Chọn ngày kết thúc'
                          allowPastDates={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Đang tải...' : 'Áp dụng bộ lọc'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
