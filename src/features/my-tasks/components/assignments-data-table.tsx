import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { toast } from 'sonner'
import { taskKeysFactory } from '@/api/query-key-factory'
import { useAuth } from '@/context/auth-context'
import { useDataTable } from '@/hooks/use-data-table'
import { useDialogs } from '@/hooks/use-dialogs'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { CreateSubTaskSheet } from '@/features/tasks/components/create-sub-task-sheet'
import { TaskAssignmentCommentsSheet } from '@/features/tasks/components/task-assignment-comments-sheet'
import { myTasksQueryOptions } from '../hooks/use-my-tasks'
import {
  AssignmentRowData,
  useAssignmentTableColumns,
} from './assignment-table-columns'
import { TaskAttachmentsDialog } from './task-attachments-dialog'

interface AssignmentsDataTableProps {
  searchParams: any
  children?: React.ReactNode
  className?: string
  isLoading?: boolean
}

export function AssignmentsDataTable({
  searchParams,
  children,
  className,
  isLoading: externalLoading = false,
}: AssignmentsDataTableProps) {
  const { user: currentUser } = useAuth()
  const dialogs = useDialogs()
  const queryClient = useQueryClient()

  // Initialize update assignment mutation for completing assignments
  const updateAssignmentMutation = $queryClient.useMutation(
    'put',
    '/api/assignments/{id}',
    {
      onMutate: async (variables) => {
        const assignmentId = variables.params.path.id
        const queryKey = taskKeysFactory.listAssignees(
          searchParams.type || 'assigned'
        )

        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey })

        // Snapshot the previous value
        const previousData = queryClient.getQueryData(queryKey)

        // Optimistically update the cache
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.data?.tasks) return old

          return {
            ...old,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((task: any) => ({
                ...task,
                assignments: task.assignments?.map((assignment: any) =>
                  assignment.assignmentId === assignmentId
                    ? { ...assignment, ...variables.body }
                    : assignment
                ),
              })),
            },
          }
        })

        return { previousData, queryKey }
      },
      onError: (_error, _variables, context: any) => {
        // Rollback on error
        if (context?.previousData) {
          queryClient.setQueryData(context.queryKey, context.previousData)
        }
      },
      onSettled: () => {
        // Invalidate my tasks query to refresh the data
        void queryClient.invalidateQueries({
          queryKey: taskKeysFactory.listAssignees(
            searchParams.type || 'assigned'
          ),
        })
      },
    }
  )

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

  // Transform tasks to assignments for "received" type
  const assignmentData = useMemo((): AssignmentRowData[] => {
    if (!tasksResponse?.data?.tasks || searchParams.type !== 'received') {
      return []
    }

    const assignments: AssignmentRowData[] = []

    for (const task of tasksResponse.data.tasks) {
      if (task.assignments && task.assignments.length > 0) {
        for (const assignment of task.assignments) {
          // Only include assignments for current user based on recipient type
          let shouldInclude = false

          if (assignment.recipientType === 'USER' && currentUser) {
            shouldInclude = assignment.recipientUser?.id === currentUser.id
          } else if (assignment.recipientType === 'TEAM' && currentUser) {
            shouldInclude = currentUser.teamId === assignment.recipientId
          } else if (assignment.recipientType === 'UNIT' && currentUser) {
            shouldInclude = currentUser.unitId === assignment.recipientId
          }

          if (shouldInclude) {
            assignments.push({
              ...assignment,
              // Add task properties
              taskId: task.id!,
              taskTitle: task.title || '',
              taskContent: task.content || '',
              taskPriority: task.priority || 'NORMAL',
              taskAttachments: (task.attachments || [])
                .filter(
                  (attachment) =>
                    attachment.id &&
                    attachment.fileName &&
                    attachment.filePath &&
                    attachment.fileSize
                )
                .map((attachment) => ({
                  id: attachment.id!,
                  fileName: attachment.fileName!,
                  filePath: attachment.filePath!,
                  fileSize: attachment.fileSize!,
                })),
            })
          }
        }
      }
    }

    return assignments
  }, [tasksResponse?.data?.tasks, searchParams.type, currentUser])

  // Handle complete assignment using the same business logic as tasks
  const handleCompleteAssignment = (assignment: AssignmentRowData) => {
    if (!assignment.assignmentId) {
      toast.error('Không tìm thấy thông tin phân công')
      return
    }

    // Check if assignment is overdue
    const now = new Date()
    const dueDate = assignment.dueAt ? new Date(assignment.dueAt) : null
    const isOverdue = dueDate && dueDate < now

    // For API, we always send 'DONE' - the frontend handles DONE_LATE display logic
    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignment.assignmentId },
      },
      body: {
        status: 'DONE',
      },
    })

    toast.promise(updatePromise, {
      loading: 'Đang cập nhật trạng thái phân công...',
      success: isOverdue
        ? 'Trạng thái phân công đã được cập nhật thành Hoàn thành trễ!'
        : 'Trạng thái phân công đã được cập nhật thành Hoàn thành!',
      error: 'Không thể cập nhật trạng thái phân công. Vui lòng thử lại.',
    })
  }

  // Handle revert assignment back to WORKING status
  const handleRevertAssignment = (assignment: AssignmentRowData) => {
    if (!assignment.assignmentId) {
      toast.error('Không tìm thấy thông tin phân công')
      return
    }

    // Check if assignment is overdue when reverting
    const now = new Date()
    const dueDate = assignment.dueAt ? new Date(assignment.dueAt) : null
    const isOverdue = dueDate && dueDate < now

    // Set appropriate status based on deadline
    const newStatus = isOverdue ? 'OVERDUE' : 'WORKING'

    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignment.assignmentId },
      },
      body: {
        status: newStatus,
      },
    })

    toast.promise(updatePromise, {
      loading: 'Đang hoàn tác trạng thái phân công...',
      success: isOverdue
        ? 'Đã hoàn tác về trạng thái quá hạn!'
        : 'Đã hoàn tác về trạng thái đang làm!',
      error: 'Không thể hoàn tác trạng thái phân công. Vui lòng thử lại.',
    })
  }

  // Handle open comments
  const handleOpenComments = (assignment: AssignmentRowData) => {
    void dialogs.sheet(TaskAssignmentCommentsSheet, {
      assignmentId: assignment.assignmentId || 1, // Use assignmentId from TaskAssignment
      allowCellEditing: true, // Allow comment input for my-tasks view
    })
  }

  // Handle create sub task
  const handleCreateSubTask = (assignment: AssignmentRowData) => {
    void dialogs.sheet(CreateSubTaskSheet, {
      parentTaskId: assignment.taskId,
    })
  }

  // Handle view attachments
  const handleViewAttachments = (assignment: AssignmentRowData) => {
    void dialogs.open(TaskAttachmentsDialog, {
      assignment,
    })
  }

  const columns = useAssignmentTableColumns({
    onCompleteAssignment: handleCompleteAssignment,
    onRevertAssignment: handleRevertAssignment,
    onOpenComments: handleOpenComments,
    onCreateSubTask: handleCreateSubTask,
    onViewAttachments: handleViewAttachments,
  })

  const { table } = useDataTable<AssignmentRowData>({
    data: assignmentData,
    columns,
    pageCount: tasksResponse?.data?.pagination?.totalPages ?? 1,
    initialState: {
      columnVisibility: {
        // Hide priority column for received assignments
        taskPriority: false,
      },
      sorting: [{ id: 'assignedAt', desc: true }],
      columnPinning: { left: ['taskId'] },
      pagination: {
        pageIndex: tasksResponse?.data?.pagination?.currentPage ?? 1,
        pageSize: tasksResponse?.data?.pagination?.pageSize ?? 20,
      },
    },
    getRowId: (row) => String(row.assignmentId ?? 'unknown'), // Use assignmentId
    shallow: false,
    clearOnDefault: true,
    enableBordered: true,
    enableHeaderPinning: true,
  })

  const loading = isLoading || externalLoading

  if (loading) {
    return <PageTableSkeleton />
  }

  return (
    <div className={className}>
      <DataTable table={table} isLoading={isFetching}>
        {children && (
          <DataTableToolbar table={table}>{children}</DataTableToolbar>
        )}
      </DataTable>
    </div>
  )
}
