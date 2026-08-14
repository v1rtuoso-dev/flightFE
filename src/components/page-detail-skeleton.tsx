export default function PageDetailSkeleton() {
  return (
    <div className='px-2 py-2 sm:px-4'>
      <div className='animate-pulse space-y-3 sm:space-y-4'>
        <div className='bg-muted h-5 w-1/3 rounded sm:h-6'></div>
        <div className='bg-muted h-3 w-1/4 rounded sm:h-4'></div>
        <div className='bg-muted h-3 w-1/2 rounded sm:h-4'></div>
        <div className='bg-muted h-3 w-full rounded sm:h-4'></div>
        <div className='bg-muted h-3 w-full rounded sm:h-4'></div>
      </div>
    </div>
  )
}
