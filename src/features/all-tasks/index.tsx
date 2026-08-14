import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AllTasksRoute } from '@/routes/_authenticated/tasks/all'
import { Filter } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Main } from '@/components/layout/main'
import { TasksAdvancedFilterSheet } from '../tasks/components/all-tasks-filter-sheet'
import { TasksDataTable } from '../tasks/components/tasks-data-table'
import { TasksTableActionBar } from '../tasks/components/tasks-table-action-bar'
import { subtasksQueryOptions } from '../tasks/hooks/use-subtasks'
import { useTasksTableColumns } from '../tasks/hooks/use-tasks-table-columns'
import { AllTasksQueryParams, HierarchicalTask, Task } from '../tasks/types'
import { allTasksQueryOptions } from './hooks/use-all-tasks'

export function AllTasksPage() {
  const searchParams = AllTasksRoute.useSearch()
  const dialogs = useDialogs()
  const queryClient = useQueryClient()
  const [loadedSubtasks, setLoadedSubtasks] = useState<
    Map<number, HierarchicalTask[]>
  >(new Map())

  // Function to calculate level based on parentId hierarchy
  const calculateLevel = useCallback((task: Task, allTasks: Task[]): number => {
    if (!task.parentId) return 0

    const parent = allTasks.find((t) => t.id === task.parentId)
    if (!parent) return 0

    return calculateLevel(parent, allTasks) + 1
  }, [])

  const { data: tasksResponse, isFetching } = useQuery({
    ...allTasksQueryOptions(searchParams as AllTasksQueryParams),
    placeholderData: (prev) => prev,
  })

  // Fallback for undefined response
  const safeTasksResponse = useMemo(
    () =>
      tasksResponse || {
        data: {
          tasks: [],
          pagination: { totalPages: 1, currentPage: 1, pageSize: 20 },
        },
      },
    [tasksResponse]
  )

  const handleToggleSubtasks = useCallback(
    (taskId: number) => {
      if (!tasksResponse) return

      setLoadedSubtasks((prev) => {
        if (prev.has(taskId)) {
          const newMap = new Map(prev)
          newMap.delete(taskId)
          return newMap
        }
        void queryClient
          .fetchQuery(subtasksQueryOptions(taskId))
          .then((subtasksResponse) => {
            const subtasksArray = subtasksResponse.data?.slice(1) || []

            setLoadedSubtasks((current) => {
              // Lấy tất cả tasks hiện có (bao gồm cả loaded subtasks)
              const currentMainTasks = safeTasksResponse.data?.tasks ?? []
              const allLoadedSubtasks = [...current.values()].flat()
              const allTasks = [
                ...currentMainTasks,
                ...allLoadedSubtasks,
                ...subtasksArray,
              ]

              const hierarchicalSubtasks = subtasksArray.map(
                (subtask, index) => ({
                  ...subtask,
                  level: calculateLevel(subtask, allTasks),
                  isLastChild: index === subtasksArray.length - 1,
                })
              )

              return new Map(current).set(taskId, hierarchicalSubtasks)
            })
            return undefined
          })

        return prev
      })
    },
    [queryClient, calculateLevel, safeTasksResponse, tasksResponse]
  )

  const tasks = useMemo(() => {
    return (safeTasksResponse.data?.tasks ?? []).flatMap((task) => {
      const subtasks = loadedSubtasks.get(task.id!)
      const hierarchicalTask: HierarchicalTask = {
        ...task,
        level: 0,
        isLastChild: false,
      }
      return subtasks ? [hierarchicalTask, ...subtasks] : [hierarchicalTask]
    })
  }, [safeTasksResponse.data?.tasks, loadedSubtasks])

  const columns = useTasksTableColumns({
    onToggleSubtasks: handleToggleSubtasks,
    allowCellEditing: true,
    filterType: 'assigned',
  })

  const { table } = useDataTable<HierarchicalTask>({
    data: tasks,
    columns,
    pageCount: safeTasksResponse.data?.pagination?.totalPages ?? 1,
    enableAdvancedFilter: true,
    initialState: {
      columnVisibility: {
        instructions: false,
        notes: false,
        // Hide priority and completedAt columns for all tasks
        priority: false,
        completedAt: false,
      },
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { left: ['select', 'id'] },
      pagination: {
        pageIndex: safeTasksResponse.data?.pagination?.currentPage ?? 1,
        pageSize: safeTasksResponse.data?.pagination?.pageSize ?? 20,
      },
    },
    getRowId: (row) => String(row.id ?? 'unknown'),
    shallow: false,
    clearOnDefault: true,
    enableBordered: true,
    enableHeaderPinning: true,
  })

  // Count active filters
  const activeFiltersCount = Object.keys(searchParams || {}).filter(
    (key) => key !== 'page' && key !== 'size' && key !== 'type'
  ).length

  return (
    <Main fixed>
      <div className='flex-1 overflow-hidden py-1 sm:py-2'>
        <TasksDataTable table={table} className='h-full' isLoading={isFetching}>
          <TasksTableActionBar table={table} filterType='assigned' />
          <DataTableToolbar table={table}>
            <Button
              variant='outline'
              onClick={() =>
                dialogs.sheet(TasksAdvancedFilterSheet, {
                  route: AllTasksRoute,
                })
              }
              className='gap-1 sm:gap-2'
              size='sm'
            >
              <Filter className='h-3 w-3 sm:h-4 sm:w-4' />
              <span className='text-xs sm:text-sm'>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className='bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs sm:px-2'>
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DataTableToolbar>
        </TasksDataTable>
      </div>
    </Main>
  )
}
