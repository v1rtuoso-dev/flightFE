import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileLoadingIndicatorProps {
  fileName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FileLoadingIndicator({
  fileName,
  className,
  size = 'md',
}: FileLoadingIndicatorProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div
      className={cn('text-muted-foreground flex items-center gap-2', className)}
    >
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      <span className='text-sm'>
        {fileName ? `Đang mở ${fileName}...` : 'Đang mở file...'}
      </span>
    </div>
  )
}
