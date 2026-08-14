import { useCallback, useMemo, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { MyTasksRoute } from '@/routes/_authenticated/tasks/my'
import { Filter } from 'lucide-react'
import { toast } from 'sonner'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { Main } from '@/components/layout/main'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { TasksAdvancedFilterSheet } from '../tasks/components/all-tasks-filter-sheet'
import { TasksDataTable } from '../tasks/components/tasks-data-table'
import { TasksPrimaryButtons } from '../tasks/components/tasks-primary-buttons'
import { TasksTableActionBar } from '../tasks/components/tasks-table-action-bar'
import { TasksTypeFilter } from '../tasks/components/tasks-type-filter'
import { subtasksQueryOptions } from '../tasks/hooks/use-subtasks'
import { useTasksTableColumns } from '../tasks/hooks/use-tasks-table-columns'
import { useUpdateTask } from '../tasks/hooks/use-update-task'
import { HierarchicalTask, Task } from '../tasks/types'
import { AssignmentsDataTable } from './components/assignments-data-table'
import { myTasksQueryOptions } from './hooks/use-my-tasks'

export function MyTasksPage() {
  const searchParams = MyTasksRoute.useSearch()
  const navigate = MyTasksRoute.useNavigate()
  const filterType = searchParams.type
  const updateTaskMutation = useUpdateTask(filterType)
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

  // Transform searchParams to match API expectations
  const apiParams = useMemo(() => {
    const { priorities, ...otherParams } = searchParams
    return {
      ...otherParams,
      // Convert priorities array to single value (take first priority if array exists)
      priorities: Array.isArray(priorities) ? priorities[0] : priorities,
    }
  }, [searchParams])

  const {
    data: tasksResponse,
    isLoading,
    isFetching,
  } = useQuery({
    ...myTasksQueryOptions(apiParams),
    placeholderData: (prev) => prev,
  })
  const dialogs = useDialogs()

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

  const handleTypeChange = useCallback(
    (type: string) => {
      void navigate({
        search: (prev: any) => {
          // Reset tất cả filter parameters khi chuyển type, chỉ giữ lại page và size
          return {
            type: type as 'assigned' | 'received',
            page: prev?.page,
            size: prev?.size,
          }
        },
      })
    },
    [navigate]
  )

  const columns = useTasksTableColumns({
    onToggleSubtasks: handleToggleSubtasks,
    allowCellEditing: true,
    filterType,
  })

  const { table } = useDataTable<HierarchicalTask>({
    data: tasks,
    columns,
    pageCount: safeTasksResponse.data?.pagination?.totalPages ?? 1,
    initialState: {
      columnVisibility: {
        instructions: false,
        notes: false,
        // Hide priority and completedAt columns for assigned tasks
        ...(filterType === 'assigned' && {
          priority: false,
          completedAt: false,
        }),
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
    meta: {
      updateCellValue: ({ row, column, value }) => {
        const taskId = row.id
        const key = column.id

        const updateTaskPromise = updateTaskMutation.mutateAsync({
          params: {
            path: { id: Number(taskId) },
          },
          body: { [key]: value },
        })

        toast.promise(updateTaskPromise, {
          loading: 'Đang cập nhật công việc...',
          success: 'Cập nhật công việc thành công',
          error: (error) => error.message,
        })
      },
    },
  })

  // Update column visibility when filterType changes
  useEffect(() => {
    if (filterType === 'assigned') {
      table.getColumn('priority')?.toggleVisibility(false)
      table.getColumn('completedAt')?.toggleVisibility(false)
    } else {
      table.getColumn('priority')?.toggleVisibility(true)
      table.getColumn('completedAt')?.toggleVisibility(true)
    }
  }, [filterType, table])

  // Count active filters
  const activeFiltersCount = Object.keys(searchParams || {}).filter(
    (key) => key !== 'page' && key !== 'size' && key !== 'type'
  ).length

  if (isLoading) {
    return (
      <Main fixed>
        <div className='flex flex-wrap items-center space-y-2 gap-x-4'>
          <TasksPrimaryButtons filterType={filterType} />
        </div>
        <PageTableSkeleton />
      </Main>
    )
  }

  return (
    <Main fixed>
      <div className='flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <TasksPrimaryButtons filterType={filterType} />
      </div>
      <div className='flex-1 overflow-hidden py-2'>
        {filterType === 'received' ? (
          // Assignment-based view for received tasks
          <AssignmentsDataTable
            searchParams={searchParams}
            className='h-full'
            isLoading={isFetching}
          >
            <TasksTypeFilter
              filterType={filterType}
              onTypeChange={handleTypeChange}
            />
            <Button
              variant='outline'
              onClick={() =>
                dialogs.sheet(TasksAdvancedFilterSheet, {
                  route: MyTasksRoute,
                })
              }
              className='gap-2'
            >
              <Filter className='h-4 w-4' />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <span className='bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs'>
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </AssignmentsDataTable>
        ) : (
          // Task-based view for assigned tasks
          <TasksDataTable
            table={table}
            className='h-full'
            isLoading={isFetching}
          >
            <TasksTableActionBar table={table} filterType={filterType} />
            <DataTableToolbar table={table}>
              <TasksTypeFilter
                filterType={filterType}
                onTypeChange={handleTypeChange}
              />
              <Button
                variant='outline'
                onClick={() =>
                  dialogs.sheet(TasksAdvancedFilterSheet, {
                    route: MyTasksRoute,
                  })
                }
                className='gap-2'
              >
                <Filter className='h-4 w-4' />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <span className='bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs'>
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DataTableToolbar>
          </TasksDataTable>
        )}
      </div>
    </Main>
  )
}
