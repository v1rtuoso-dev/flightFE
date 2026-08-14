import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilterRendererProps } from './types'

export const SelectFilter: React.FC<FilterRendererProps> = ({
  filter,
  value,
  onChange,
}) => {
  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger className='w-full'>
        <SelectValue
          placeholder={
            filter.placeholder || `Chọn ${filter.label.toLowerCase()}`
          }
        />
      </SelectTrigger>
      <SelectContent>
        {filter.options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
