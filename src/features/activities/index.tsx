import { Suspense } from 'react'
import { CalendarBody } from '../calendar/calendar-body'
import { CalendarProvider } from '../calendar/contexts/calendar-context'
import { DndProvider } from '../calendar/contexts/dnd-context'
import { CalendarHeader } from '../calendar/header/calendar-header'
import { CalendarSkeleton } from '../calendar/skeletons/calendar-skeleton'

export function ActivitiesPage() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarProvider view='month'>
        <DndProvider showConfirmation={false}>
          <div className='w-full rounded-lg border sm:rounded-xl'>
            <CalendarHeader />
            <CalendarBody />
          </div>
        </DndProvider>
      </CalendarProvider>
    </Suspense>
  )
}
