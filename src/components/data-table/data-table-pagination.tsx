import type { Table } from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTablePaginationProps<TData> extends React.ComponentProps<'div'> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-between gap-2 p-1 sm:flex-row sm:gap-4 md:gap-8',
        className
      )}
      {...props}
    >
      {/* Selected rows info - hide on mobile when no selection */}
      <div className='text-muted-foreground flex-1 text-xs sm:text-sm'>
        <span className='hidden sm:inline'>
          {table.getFilteredSelectedRowModel().rows.length} của{' '}
          {table.getFilteredRowModel().rows.length} hàng được chọn.
        </span>
        <span className='sm:hidden'>
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            `${table.getFilteredSelectedRowModel().rows.length} đã chọn`}
        </span>
      </div>

      {/* Controls - stack on mobile */}
      <div className='flex flex-col items-center gap-2 sm:flex-row sm:gap-4 md:gap-6'>
        {/* Page size selector - hide on small mobile */}
        <div className='hidden items-center space-x-2 sm:flex'>
          <p className='text-xs font-medium sm:text-sm'>
            <span className='hidden sm:inline'>Số hàng mỗi trang</span>
            <span className='sm:hidden'>Hiển thị</span>
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-7 w-14 sm:h-8 sm:w-[4.5rem]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info - responsive text */}
        <div className='flex items-center justify-center text-xs font-medium sm:text-sm'>
          <span className='hidden sm:inline'>
            Trang {table.getState().pagination.pageIndex + 1} của{' '}
            {table.getPageCount()}
          </span>
          <span className='sm:hidden'>
            {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Đến trang đầu'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => {
              table.setPageIndex(0)
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            aria-label='Đến trang trước'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => {
              table.previousPage()
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            aria-label='Đến trang tiếp theo'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => {
              table.nextPage()
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            aria-label='Đến trang cuối'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1)
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
