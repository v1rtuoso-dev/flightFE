import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
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

export interface SearchableSelectOption {
  value: number | string
  label: string
}

interface SearchableSelectProps {
  value?: number | string | null
  onChange: (value: number | string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn một mục',
  searchPlaceholder = 'Tìm kiếm...',
  emptyText = 'Không tìm thấy kết quả',
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'border-input bg-background hover:bg-background w-full justify-between px-3 font-normal outline-offset-0 focus-visible:outline-[3px]',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className='truncate'>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className='text-muted-foreground/80 shrink-0'
            size={16}
            aria-hidden='true'
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={String(option.value)}
                  keywords={[option.label]}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  {value === option.value && (
                    <Check size={16} className='ml-auto' />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
