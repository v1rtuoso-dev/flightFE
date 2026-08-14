import type * as React from 'react'
import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import { LoaderIcon } from 'lucide-react'
import { getCommonPinningStyles } from '@/lib/data-table'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  selectedRowId?: string | null
  pageSizeOptions?: number[]
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  isLoading = false,
  onRowClick,
  selectedRowId,
  pageSizeOptions,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn('flex h-full w-full flex-col gap-2 sm:gap-2.5', className)}
      {...props}
    >
      {children}
      <div className='relative overflow-hidden rounded-md border'>
        {/* Horizontal scroll wrapper for mobile */}
        <div className='max-h-full overflow-auto'>
          <Table>
            <TableHeader className='bg-background sticky top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const {
                      columnDef: { visibilityMode = 'both' },
                    } = header.column

                    // Skip rendering filter-only columns in table header
                    if (visibilityMode === 'filter') return null

                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getCommonPinningStyles({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={(e) => {
                      // Prevent row click when clicking on interactive elements
                      if (
                        e.target instanceof Element &&
                        (e.target.closest('button') ||
                          e.target.closest('input') ||
                          e.target.closest('select') ||
                          e.target.closest('[role="checkbox"]') ||
                          e.target.closest('[role="menu"]') ||
                          e.target.closest('[role="menuitem"]') ||
                          e.target.closest('a'))
                      ) {
                        return
                      }

                      // Prevent default behavior and stop propagation to avoid unwanted scrolling
                      e.preventDefault()
                      e.stopPropagation()

                      onRowClick?.(row.original)
                    }}
                    className={cn(
                      onRowClick &&
                        'hover:bg-muted/50 cursor-pointer transition-colors',
                      selectedRowId === row.id && 'bg-muted'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const {
                        columnDef: { visibilityMode = 'both' },
                      } = cell.column

                      // Skip rendering filter-only columns in table body
                      if (visibilityMode === 'filter') return null

                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            ...getCommonPinningStyles({ column: cell.column }),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      table
                        .getAllColumns()
                        .filter(
                          (col) => col.columnDef.visibilityMode !== 'filter'
                        ).length
                    }
                    className='h-24 text-center'
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <>
            {/* Overlay background */}
            <div className='bg-background/50 absolute inset-0 z-40' />

            {/* Loading indicator */}
            <div className='absolute inset-0 z-50 flex items-center justify-center'>
              <div className='bg-background flex items-center gap-2 rounded-lg border px-4 py-2 shadow-lg'>
                <LoaderIcon className='animate-spin' />
                <span className='text-muted-foreground text-sm'>
                  Đang tải...
                </span>
              </div>
            </div>
          </>
        )}
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  )
}
