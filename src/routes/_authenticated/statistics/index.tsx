import { createFileRoute } from '@tanstack/react-router'
import { Statistics } from '@/features/statistics/components'

export const Route = createFileRoute('/_authenticated/statistics/')({
  component: Statistics,
})
