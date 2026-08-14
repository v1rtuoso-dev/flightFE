import { DataTableSkeleton } from './data-table/data-table-skeleton'
import { TaskHeaderSkeleton } from './task-header-skeleton'

export default function PageTableSkeleton() {
  return (
    <div className='px-2 py-2 sm:px-4'>
      <TaskHeaderSkeleton />
      <DataTableSkeleton
        columnCount={10}
        rowCount={10}
        withViewOptions={false}
      />
    </div>
  )
}
