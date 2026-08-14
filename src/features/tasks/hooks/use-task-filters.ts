import * as React from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { dateFormatPatterns } from '@/config/date'
import { taskTypesQueryOptions } from '@/features/tasks/components/use-task-types'
import { useRecipientOptions } from '@/features/tasks/hooks/use-recipient-options'
import {
  taskPriorityOptions,
  taskStatusFilterOptions,
} from '@/features/tasks/utils'
import { FilterConfig } from '../components/filters'

export interface FilterValues {
  startTime?: string
  endTime?: string
  teamIds?: string[]
  unitIds?: string[]
  userIds?: string[]
  taskTypeIds?: string[]
  status?: string[]
  priority?: string[]
  keyword?: string
  [key: string]: any // Allow string indexing
}

export interface FilterGroup {
  title: string
  filters: FilterConfig[]
}

export const useTaskFilters = (filterType?: string) => {
  const { teamOptions, unitOptions, userOptions } = useRecipientOptions()
  const { data: taskTypesResponse } = useQuery({
    ...taskTypesQueryOptions(),
  })

  const taskTypeOptions = (taskTypesResponse?.data ?? []).map((type) => ({
    label: type.name,
    value: type.id!.toString(),
  }))

  const filterGroups: FilterGroup[] = React.useMemo(() => {
    const baseGroups: FilterGroup[] = [
      {
        title: 'Tìm kiếm',
        filters: [
          {
            id: 'keyword',
            label: 'Từ khóa',
            type: 'text',
            placeholder: 'Mã công việc, tên công việc...',
          },
        ],
      },
      {
        title: 'Thời gian',
        filters: [
          {
            id: 'startTime',
            label: 'Thời gian bắt đầu',
            type: 'date',
            placeholder: 'Chọn ngày bắt đầu',
          },
          {
            id: 'endTime',
            label: 'Thời gian kết thúc',
            type: 'date',
            placeholder: 'Chọn ngày kết thúc',
          },
        ],
      },
    ]

    // Chỉ hiển thị "Đối tượng phân công" cho type khác "received"
    if (filterType !== 'received') {
      baseGroups.push({
        title: 'Đối tượng phân công',
        filters: [
          {
            id: 'teamIds',
            label: 'Đội',
            type: 'multiSelect',
            options: teamOptions.map((option) => ({
              ...option,
              value: String(option.value),
            })),
          },
          {
            id: 'unitIds',
            label: 'Tổ',
            type: 'multiSelect',
            options: unitOptions.map((option) => ({
              ...option,
              value: String(option.value),
            })),
          },
          {
            id: 'userIds',
            label: 'Cá nhân thực hiện',
            type: 'multiSelect',
            options: userOptions.map((option) => ({
              ...option,
              value: String(option.value),
            })),
          },
        ],
      })
    }

    baseGroups.push({
      title: 'Thuộc tính công việc',
      filters: [
        {
          id: 'taskTypeIds',
          label: 'Loại công việc',
          type: 'multiSelect',
          options: taskTypeOptions,
        },
        {
          id: 'status',
          label: 'Trạng thái',
          type: 'multiSelect',
          options: taskStatusFilterOptions,
        },
        {
          id: 'priority',
          label: 'Mức độ ưu tiên',
          type: 'multiSelect',
          options: taskPriorityOptions,
        },
      ],
    })

    return baseGroups
  }, [taskTypeOptions, teamOptions, unitOptions, userOptions, filterType])

  return {
    filterGroups,
  }
}

export const useFilterState = (searchParams: any) => {
  // Initialize filters from URL search params
  const initialFilters = React.useMemo(
    (): FilterValues => ({
      startTime: searchParams?.startTime
        ? format(new Date(searchParams.startTime), dateFormatPatterns.fullDate)
        : undefined,
      endTime: searchParams?.endTime
        ? format(new Date(searchParams.endTime), dateFormatPatterns.fullDate)
        : undefined,
      teamIds: searchParams?.teamIds,
      unitIds: searchParams?.unitIds,
      userIds: searchParams?.userIds,
      taskTypeIds: searchParams?.taskTypeIds,
      status: searchParams?.status ? [searchParams.status] : undefined,
      priority: searchParams?.priorities as string[],
      keyword: searchParams?.keyword,
    }),
    [searchParams]
  )

  const [filters, setFilters] = React.useState<FilterValues>(initialFilters)

  // Sync filters when search params change
  React.useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const isFiltered = React.useMemo(() => {
    return Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== ''
    })
  }, [filters])

  const handleFilterChange = React.useCallback(
    (filterId: string, value: any) => {
      const newFilters = { ...filters, [filterId]: value }
      setFilters(newFilters)
    },
    [filters]
  )

  const resetFilters = React.useCallback(() => {
    const resetFilters: FilterValues = {}
    setFilters(resetFilters)
  }, [])

  return {
    filters,
    isFiltered,
    handleFilterChange,
    resetFilters,
  }
}
