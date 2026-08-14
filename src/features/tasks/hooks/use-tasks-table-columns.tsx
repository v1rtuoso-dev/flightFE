import { useMemo } from 'react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { CheckCircle, Flag } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AttachmentItem } from '@/features/attachments/types'
import {
  HierarchicalTask,
  Task,
  TaskAssignment,
  TaskFilterTypes,
  TaskStatus,
} from '@/features/tasks/types'
import { EditableCellSelect } from '../components/editable-cell-select'
import { EditableCellTextarea } from '../components/editable-cell-textarea'
import { TaskAssignmentsDisplay } from '../components/task-assignments-display'
import { TaskAttachmentsDisplay } from '../components/task-attachments-display'
import { TaskHierarchyCell } from '../components/task-hierarchy-cell'
import { TaskStatusBadge } from '../components/task-status-badge'
import { taskPriorityOptions, taskStatusFilterOptions } from '../utils'

interface UseTasksTableColumnsOptions {
  onToggleSubtasks?: (taskId: number) => void
  allowCellEditing: boolean
  filterType: TaskFilterTypes
}

export function useTasksTableColumns(options: UseTasksTableColumnsOptions) {
  const { onToggleSubtasks, allowCellEditing, filterType } = options

  const columns = useMemo(
    (): ColumnDef<HierarchicalTask>[] => [
      {
        id: 'select',
        header: ({ table }) => {
          const mainTaskRows = table.getRowModel().rows.filter((row) => {
            const task = row.original
            const level = ('level' in task && task.level) || 0
            return level === 0
          })

          const selectedMainTaskRows = mainTaskRows.filter((row) =>
            row.getIsSelected()
          )
          const isAllMainTasksSelected =
            mainTaskRows.length > 0 &&
            selectedMainTaskRows.length === mainTaskRows.length
          const isSomeMainTasksSelected =
            selectedMainTaskRows.length > 0 &&
            selectedMainTaskRows.length < mainTaskRows.length

          return (
            <Checkbox
              checked={
                isSomeMainTasksSelected
                  ? 'indeterminate'
                  : isAllMainTasksSelected
              }
              onCheckedChange={(value) => {
                for (const row of mainTaskRows) {
                  row.toggleSelected(!!value)
                }
              }}
              aria-label='Chọn tất cả'
            />
          )
        },
        cell: ({ row }) => {
          const task = row.original
          const level = ('level' in task && task.level) || 0

          return level === 0 ? (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label='Chọn dòng'
            />
          ) : null
        },
        maxSize: 20,
        enableSorting: false,
        enableResizing: false,
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Mã công việc' />
        ),
        cell: ({ cell, row }) => {
          const taskId = cell.getValue<number>()
          const task = row.original
          const level = ('level' in task && task.level) || 0
          const isLastChild =
            ('isLastChild' in task && task.isLastChild) || false
          const hasSubtask = !!task.hasSubtask

          return (
            <TaskHierarchyCell
              taskId={taskId}
              level={level}
              isLastChild={isLastChild}
              hasSubtask={hasSubtask}
              onToggleSubtasks={onToggleSubtasks}
              filterType={filterType}
            />
          )
        },
        meta: {
          label: 'Mã công việc',
        },
        minSize: 35,
        size: 45,
        maxSize: 70,
        enableColumnFilter: false,
        enableHiding: false,
        enableSorting: false,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Trạng thái' />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<TaskStatus>()

          return (
            <div className='flex items-center justify-center'>
              {status ? (
                <TaskStatusBadge status={status} size='sm' />
              ) : (
                <span className='text-muted-foreground'>N/A</span>
              )}
            </div>
          )
        },
        meta: {
          label: 'Trạng thái',
          placeholder: 'Tìm kiếm trạng thái...',
          variant: 'select',
          options: taskStatusFilterOptions,
          icon: CheckCircle,
        },
        enableSorting: false,
        maxSize: 68,
        enableResizing: false,
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Độ ưu tiên' />
        ),
        cell: (cellContext) => (
          <EditableCellSelect
            {...cellContext}
            options={taskPriorityOptions}
            filterType={filterType}
            allowCellEditing={allowCellEditing}
          />
        ),
        meta: {
          label: 'Độ ưu tiên',
          placeholder: 'Tìm kiếm độ ưu tiên...',
          variant: 'multiSelect',
          options: taskPriorityOptions,
          icon: Flag,
        },
        maxSize: 80,
        enableResizing: false,
        enableSorting: false,
        enableHiding: true,
      },
      {
        id: 'completedAt',
        accessorKey: 'completedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Ngày hoàn thành' />
        ),
        cell: ({ getValue }) => {
          const completeAt = getValue<Date>()
          return completeAt
            ? format(completeAt, dateFormatPatterns.fullDateTime)
            : 'Chưa hoàn thành'
        },
        maxSize: 90,
        enableResizing: false,
        enableSorting: false,
        enableHiding: true,
        visibilityMode: 'column',
        meta: {
          label: 'Ngày hoàn thành',
        },
      },
      {
        id: 'content',
        accessorKey: 'content',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Nội dung' />
        ),
        cell: (cellContext) => (
          <EditableCellTextarea
            {...cellContext}
            maxLength={1000}
            filterType={filterType}
            allowCellEditing={allowCellEditing}
          />
        ),
        meta: {
          label: 'Nội dung',
        },
        maxSize: 160,
        enableSorting: false,
      },
      {
        id: 'instructions',
        accessorKey: 'instructions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Hướng dẫn' />
        ),
        cell: (cellContext) => (
          <EditableCellTextarea
            {...cellContext}
            maxLength={1000}
            filterType={filterType}
            allowCellEditing={allowCellEditing}
          />
        ),
        meta: {
          label: 'Hướng dẫn',
        },
        enableSorting: false,
      },
      {
        id: 'notes',
        accessorKey: 'notes',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Ghi chú' />
        ),
        cell: (cellContext) => (
          <EditableCellTextarea
            {...cellContext}
            maxLength={1000}
            filterType={filterType}
            allowCellEditing={allowCellEditing}
          />
        ),
        enableSorting: false,
        meta: {
          label: 'Ghi chú',
        },
      },
      {
        id: 'assignees',
        accessorFn: (row) => row.assignments,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Phân công' />
        ),
        cell: ({ cell, row }) => {
          const taskAssignments = cell.getValue<TaskAssignment[]>()
          const task = row.original as Task

          return (
            <div className='flex items-center justify-center'>
              <TaskAssignmentsDisplay
                assignments={taskAssignments}
                maxVisible={3}
                task={task}
                filterType={filterType}
                allowCellEditing={allowCellEditing}
              />
            </div>
          )
        },
        enableSorting: false,
        enableResizing: false,
        meta: {
          label: 'Phân công',
        },
        maxSize: 50,
      },
      {
        id: 'attachments',
        accessorKey: 'attachments',
        accessorFn: (row) => row.attachments,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Tệp đính kèm' />
        ),
        cell: ({ cell }) => {
          const attachments = cell.getValue<AttachmentItem[]>() || []
          const taskId = cell.row.original.id
          const level = cell.row.original.level || 0
          const createdByUserId = cell.row.original.createdByUser?.id // Lấy ID của user tạo task

          return (
            <div className='flex items-center justify-center'>
              <TaskAttachmentsDisplay
                attachments={attachments}
                taskId={taskId!}
                filterType={filterType}
                level={level}
                allowCellEditing={allowCellEditing}
                createdByUserId={createdByUserId} // Truyền ID creator để kiểm tra quyền
              />
            </div>
          )
        },
        enableSorting: false,
        enableResizing: false,
        meta: {
          label: 'Tệp đính kèm',
        },
        maxSize: 54,
        visibilityMode: 'column',
      },
    ],
    [filterType, onToggleSubtasks, allowCellEditing]
  )

  return columns
}
