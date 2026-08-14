import * as React from 'react'
import { Input } from '@/components/ui/input'
import { FilterRendererProps } from './types'

export const TextFilter: React.FC<FilterRendererProps> = ({
  filter,
  value,
  onChange,
}) => {
  return (
    <Input
      placeholder={filter.placeholder || filter.label}
      value={value || ''}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      className='w-full'
    />
  )
}
