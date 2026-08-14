import { useContext } from 'react'
import { useTour as useReactTour } from '@reactour/tour'
import { TourContext } from '@/context/tour-context'

export function useTour() {
  const context = useContext(TourContext)
  const reactTour = useReactTour()

  if (!context) {
    throw new Error('useTour must be used within a TourProviderWrapper')
  }

  return {
    ...context,
    ...reactTour,
  }
}
