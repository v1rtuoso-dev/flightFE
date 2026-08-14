import { Skeleton } from './ui/skeleton'

export default function PageFormSkeleton() {
  return (
    <div className='px-2 py-2 sm:px-4'>
      <div className='mb-4 sm:mb-6'>
        <Skeleton className='mb-3 h-6 w-1/3 sm:mb-4 sm:h-8' />
        <Skeleton className='mb-4 h-8 w-full sm:mb-6 sm:h-10' />
        <Skeleton className='mb-1 h-4 w-1/4 sm:mb-2 sm:h-6' />
        <Skeleton className='mb-4 h-20 w-full sm:mb-6 sm:h-32' />
        <Skeleton className='mb-1 h-4 w-1/4 sm:mb-2 sm:h-6' />
        <Skeleton className='mb-4 h-20 w-full sm:mb-6 sm:h-32' />
      </div>
      <div className='flex flex-col gap-2 sm:flex-row sm:justify-end sm:space-x-2'>
        <Skeleton className='h-8 w-full sm:h-10 sm:w-32' />
        <Skeleton className='h-8 w-full sm:h-10 sm:w-40' />
      </div>
    </div>
  )
}
