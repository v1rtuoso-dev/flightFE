import { Send, Inbox } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TaskFilterTypes } from '@/features/tasks/types'

interface TasksTypeFilterProps {
  filterType: TaskFilterTypes
  onTypeChange: (type: TaskFilterTypes) => void
}

export function TasksTypeFilter({
  filterType,
  onTypeChange,
}: TasksTypeFilterProps) {
  const handleTypeChange = (type: TaskFilterTypes) => {
    if (type === filterType) return
    onTypeChange(type)
  }

  return (
    <div className='flex w-fit items-center rounded-xl border-2 border-gray-200/50 bg-gradient-to-r from-white to-gray-50/30 p-1.5 shadow-lg shadow-gray-200/40 backdrop-blur-sm'>
      <ToggleGroup
        type='single'
        variant='outline'
        value={filterType}
        onValueChange={handleTypeChange}
        className='gap-1'
      >
        <ToggleGroupItem
          value='assigned'
          aria-label='Công việc được giao'
          className='flex items-center gap-2.5 rounded-lg border-0 px-5 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50 hover:shadow-md data-[state=on]:bg-gradient-to-r data-[state=on]:from-blue-500 data-[state=on]:to-blue-600 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-blue-200/50'
        >
          <Send className='h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
          Đã giao
        </ToggleGroupItem>
        <ToggleGroupItem
          value='received'
          aria-label='Công việc đã nhận'
          className='flex items-center gap-2.5 rounded-lg border-0 px-5 py-3 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-50 hover:shadow-md data-[state=on]:bg-gradient-to-r data-[state=on]:from-green-500 data-[state=on]:to-green-600 data-[state=on]:text-white data-[state=on]:shadow-lg data-[state=on]:shadow-green-200/50'
        >
          <Inbox className='h-4 w-4 transition-transform duration-300 group-hover:scale-110' />
          Đã nhận
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
