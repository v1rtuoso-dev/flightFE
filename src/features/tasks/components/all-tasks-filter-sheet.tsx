import * as React from 'react'
import { format, parse } from 'date-fns'
import { dateFormatPatterns } from '@/config/date'
import { AllTasksRoute } from '@/routes/_authenticated/tasks/all'
import { MyTasksRoute } from '@/routes/_authenticated/tasks/my'
import { Filter, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useTaskFilters, useFilterState } from '../hooks/use-task-filters'
import { FilterRenderer } from './filters'

type TaskRoute = typeof AllTasksRoute | typeof MyTasksRoute

interface TasksAdvancedFilterSheetPayload {
  route: TaskRoute
}

export const TasksAdvancedFilterSheet: React.FC<
  DialogProps<TasksAdvancedFilterSheetPayload>
> = ({ open, onClose, payload }) => {
  const { route } = payload
  const searchParams = route.useSearch()
  const navigate = route.useNavigate()

  // Type guard to get the type - safely handle undefined
  const taskType =
    searchParams && 'type' in searchParams ? searchParams.type : 'assigned'

  const { filterGroups } = useTaskFilters(taskType)
  const { filters, isFiltered, handleFilterChange, resetFilters } =
    useFilterState(searchParams)

  const handleResetFilters = React.useCallback(() => {
    resetFilters()
    void navigate({
      search: (prev: any) => ({
        type: taskType,
        page: prev?.page,
        size: prev?.size,
        priorities: undefined,
        taskTypeIds: undefined,
      }),
    })
  }, [navigate, resetFilters, taskType])

  const handleApplyFilters = React.useCallback(() => {
    const searchUpdate: any = {
      type: taskType,
      page: searchParams?.page,
      size: searchParams?.size,
    }

    if (filters.keyword && filters.keyword.trim() !== '') {
      searchUpdate.keyword = filters.keyword
    }
    if (filters.startTime && filters.startTime.trim() !== '') {
      const startDate = parse(
        filters.startTime,
        dateFormatPatterns.fullDate,
        new Date()
      )
      searchUpdate.startTime = format(
        startDate,
        dateFormatPatterns.standardizedDate
      )
    }
    if (filters.endTime && filters.endTime.trim() !== '') {
      const endDate = parse(
        filters.endTime,
        dateFormatPatterns.fullDate,
        new Date()
      )
      searchUpdate.endTime = format(
        endDate,
        dateFormatPatterns.standardizedDate
      )
    }
    if (filters.teamIds && filters.teamIds.length > 0) {
      searchUpdate.teamIds = filters.teamIds
    }
    if (filters.unitIds && filters.unitIds.length > 0) {
      searchUpdate.unitIds = filters.unitIds
    }
    if (filters.userIds && filters.userIds.length > 0) {
      searchUpdate.userIds = filters.userIds
    }
    if (filters.status && filters.status.length > 0) {
      searchUpdate.status = filters.status[0] as
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'OVERDUE'
        | undefined
    }
    if (filters.priority && filters.priority.length > 0) {
      searchUpdate.priorities = filters.priority
    }
    if (filters.taskTypeIds && filters.taskTypeIds.length > 0) {
      searchUpdate.taskTypeIds = filters.taskTypeIds
    }

    void navigate({ search: searchUpdate })
    void onClose()
  }, [filters, navigate, searchParams, onClose, taskType])

  const handleClose = React.useCallback(() => {
    void onClose()
  }, [onClose])

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
      modal
    >
      <SheetContent className='flex h-full w-full flex-col sm:max-w-3xl'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Bộ lọc nâng cao
          </SheetTitle>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto px-4 pb-2'>
          {filterGroups.map((group, groupIndex) => (
            <div key={group.title} className='space-y-4'>
              <div className='flex items-center gap-2'>
                <h3 className='text-sm font-medium text-gray-900'>
                  {group.title}
                </h3>
              </div>

              <div
                className={cn(
                  'grid gap-4',
                  group.title === 'Thời gian' ? 'grid-cols-2' : 'grid-cols-1'
                )}
              >
                {group.filters.map((filter) => (
                  <div key={filter.id} className='space-y-2'>
                    <Label className='text-sm font-medium'>
                      {filter.label}
                    </Label>
                    <FilterRenderer
                      filter={filter}
                      value={filters[filter.id]}
                      onChange={(value) => {
                        handleFilterChange(filter.id, value)
                      }}
                    />
                  </div>
                ))}
              </div>

              {groupIndex < filterGroups.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <SheetFooter className='flex items-center justify-between'>
          <div className='flex w-full justify-between'>
            {isFiltered && (
              <Button
                variant='outline'
                onClick={handleResetFilters}
                className='gap-2'
              >
                <RotateCcw className='h-4 w-4' />
                Đặt lại bộ lọc
              </Button>
            )}
            <div className='ml-auto flex gap-2'>
              <Button variant='outline' onClick={handleClose}>
                Hủy
              </Button>
              <Button onClick={handleApplyFilters}>Áp dụng</Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
