import { useEffect, useRef } from 'react'
import { useTour } from '@/hooks/use-tour'

const TOUR_SHOWN_SESSION_KEY = 'tour-shown-this-session'
const TOUR_COMPLETED_KEY = 'tour-completed'

export function useStartTour() {
  const { startTour, setIsOpen } = useTour()
  const hasShownThisSession = useRef(false)

  // Check if permanently completed
  const hasCompletedTour = localStorage.getItem(TOUR_COMPLETED_KEY) === 'true'

  useEffect(() => {
    // Don't show if permanently completed
    if (hasCompletedTour) return

    // Don't show if already shown this session
    if (hasShownThisSession.current) return

    // Don't show if already shown this session (check sessionStorage too)
    if (sessionStorage.getItem(TOUR_SHOWN_SESSION_KEY) === 'true') return

    // Show tour after delay
    const timer = setTimeout(() => {
      startTour()
      hasShownThisSession.current = true
      sessionStorage.setItem(TOUR_SHOWN_SESSION_KEY, 'true')
    }, 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [startTour, hasCompletedTour])

  const markTourCompleted = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true')
    setIsOpen(false)
  }

  const resetTour = () => {
    localStorage.removeItem(TOUR_COMPLETED_KEY)
    sessionStorage.removeItem(TOUR_SHOWN_SESSION_KEY)
    hasShownThisSession.current = false
  }

  return {
    hasCompletedTour,
    markTourCompleted,
    resetTour,
    startTour,
  }
}
