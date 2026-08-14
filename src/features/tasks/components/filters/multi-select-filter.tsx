import * as React from 'react'
import { Check, PlusCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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

export const MultiSelectFilter: React.FC<FilterRendererProps> = ({
  filter,
  value,
  onChange,
}) => {
  const [multiSelectOpen, setMultiSelectOpen] = React.useState(false)
  const selectedValues = Array.isArray(value) ? value : []

  const onItemSelect = (optionValue: string, isSelected: boolean) => {
    if (isSelected) {
      onChange(selectedValues.filter((v) => v !== optionValue))
    } else {
      onChange([...selectedValues, optionValue])
    }
  }

  const onReset = (event?: React.MouseEvent) => {
    event?.stopPropagation()
    onChange([])
  }

  return (
    <Popover open={multiSelectOpen} onOpenChange={setMultiSelectOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='h-auto w-full flex-wrap justify-start border-dashed p-2'
        >
          <div className='flex w-full flex-wrap items-center gap-2'>
            {selectedValues.length > 0 ? (
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
                    <p>Xóa bộ lọc {filter.label.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <PlusCircle className='h-4 w-4' />
            )}
            <span className='font-medium'>{filter.label}</span>
            {selectedValues.length > 0 && (
              <>
                <Separator
                  orientation='vertical'
                  className='mx-0.5 data-[orientation=vertical]:h-4'
                />
                <div className='flex flex-wrap items-center gap-1'>
                  {filter.options
                    ?.filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))}
                </div>
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Command>
          <CommandInput placeholder={filter.label} />
          <CommandList>
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup className='overflow-y-auto'>
              {filter.options?.map((option) => {
                const isSelected = selectedValues.includes(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onItemSelect(option.value, isSelected)
                    }}
                  >
                    <div
                      className={cn(
                        'border-primary text-primary-foreground flex size-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className='text-current' />
                    </div>
                    <span className='flex-1'>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
