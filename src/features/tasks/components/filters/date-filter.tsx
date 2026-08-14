import * as React from 'react'
import { format, parse } from 'date-fns'
import { dateFormatPatterns } from '@/config/date'
import { CalendarIcon, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FilterRendererProps } from './types'

export const DateFilter: React.FC<FilterRendererProps> = ({
  filter,
  value,
  onChange,
}) => {
  const [dateOpen, setDateOpen] = React.useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, dateFormatPatterns.fullDate)
      onChange(formattedDate)
    } else {
      onChange('')
    }
    setDateOpen(false)
  }

  const selectedDate = value
    ? parse(value, dateFormatPatterns.fullDate, new Date())
    : undefined

  const onReset = (event?: React.MouseEvent) => {
    event?.stopPropagation()
    onChange('')
  }

  const displayValue = value
    ? format(selectedDate || new Date(), 'dd/MM/yyyy')
    : filter.placeholder || filter.label

  return (
    <Popover open={dateOpen} onOpenChange={setDateOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='h-auto w-full flex-wrap justify-start border-dashed p-2'
        >
          <div className='flex w-full flex-wrap items-center gap-2'>
            {value ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      role='button'
                      aria-label={`Clear ${filter.label} filter`}
                      tabIndex={0}
                      onClick={onReset}
                      className='focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-1 focus-visible:outline-none'
                    >
                      <XCircle className='h-4 w-4' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Xóa {filter.label.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <CalendarIcon className='h-4 w-4' />
            )}
            <span className='font-medium'>{filter.label}</span>
            {value && (
              <>
                <Separator
                  orientation='vertical'
                  className='mx-0.5 data-[orientation=vertical]:h-4'
                />
                <Badge
                  variant='secondary'
                  className='rounded-sm px-1 font-normal'
                >
                  {displayValue}
                </Badge>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleDateSelect}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
