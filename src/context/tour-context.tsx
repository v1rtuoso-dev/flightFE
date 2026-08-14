import { createContext, useState, ReactNode } from 'react'
import { TourProvider, useTour } from '@reactour/tour'
import type { StepType } from '@reactour/tour'
import { X } from 'lucide-react'

interface TourContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  startTour: () => void
  endTour: () => void
}

export const TourContext = createContext<TourContextType | null>(null)

const tourSteps: StepType[] = [
  {
    selector: '[data-tour="sidebar-trigger"]',
    content: ({ setIsOpen }) => (
      <div className='space-y-4 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg'>
              <svg
                className='h-5 w-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900'>Menu điều hướng</h3>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('tour-completed', 'true')
              setIsOpen(false)
            }}
            className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        <p className='mb-4 text-sm leading-relaxed text-gray-700'>
          Nhấp vào đây để{' '}
          <span className='font-semibold text-blue-600'>
            ẩn/hiện menu bên trái
          </span>
          .
        </p>

        <div className='flex items-center gap-3 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3'>
          <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100'>
            <span className='text-sm'>💡</span>
          </div>
          <div className='text-sm text-blue-800'>
            <span className='font-medium'>Mẹo: </span>
            Sử dụng phím tắt{' '}
            <kbd className='rounded border bg-white px-2 py-1 font-mono text-xs shadow-sm'>
              Ctrl+B
            </kbd>{' '}
            (hoặc{' '}
            <kbd className='rounded border bg-white px-2 py-1 font-mono text-xs shadow-sm'>
              ⌘+B
            </kbd>{' '}
            trên Mac)
          </div>
        </div>

        <div className='flex justify-center pt-2'>
          <div className='h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500'></div>
        </div>
      </div>
    ),
    position: 'bottom' as const,
  },
]

interface TourProviderWrapperProps {
  children: ReactNode
}

function TourProviderInner({ children }: { children: ReactNode }) {
  const { setIsOpen, setCurrentStep } = useTour()
  const [contextState, setContextState] = useState({
    isOpen: false,
    currentStep: 0,
  })

  const startTour = () => {
    setContextState({ isOpen: true, currentStep: 0 })
    setIsOpen(true)
    setCurrentStep(0)
  }

  const endTour = () => {
    setContextState({ isOpen: false, currentStep: 0 })
    setIsOpen(false)
    setCurrentStep(0)

    // Only mark as completed when explicitly called (not on close)
    // localStorage.setItem('tour-completed', 'true')
  }

  const contextValue: TourContextType = {
    isOpen: contextState.isOpen,
    setIsOpen: (open: boolean) => {
      setContextState((prev) => ({ ...prev, isOpen: open }))
      setIsOpen(open)
      // Don't auto-mark as completed when closing
      // if (!open) {
      //   localStorage.setItem('tour-completed', 'true')
      // }
    },
    currentStep: contextState.currentStep,
    setCurrentStep: (step: number) => {
      setContextState((prev) => ({ ...prev, currentStep: step }))
      setCurrentStep(step)
    },
    startTour,
    endTour,
  }

  return (
    <TourContext.Provider value={contextValue}>{children}</TourContext.Provider>
  )
}

export function TourProviderWrapper({ children }: TourProviderWrapperProps) {
  return (
    <TourProvider
      steps={tourSteps}
      showCloseButton={true}
      disableDotsNavigation={true}
      disableKeyboardNavigation={false}
      showBadge={true}
      showNavigation={false}
      afterOpen={() => {
        // Tour opened
      }}
      beforeClose={() => {
        // Don't auto-mark as completed when closing
        // localStorage.setItem('tour-completed', 'true')
      }}
      onClickMask={() => {
        // Mark as completed when user clicks outside (dismisses tour)
        localStorage.setItem('tour-completed', 'true')
      }}
      onClickClose={() => {
        // Mark as completed when user clicks close button
        localStorage.setItem('tour-completed', 'true')
      }}
      styles={{
        popover: (base) => ({
          ...base,
          '--reactour-accent': '#3b82f6',
          borderRadius: '16px',
          padding: 0,
          backgroundColor: 'white',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          border: 'none',
          maxWidth: '400px',
          minWidth: '320px',
        }),
        maskArea: (base) => ({
          ...base,
          rx: 12,
        }),
        maskWrapper: (base) => ({
          ...base,
          opacity: 0.85,
          backdropFilter: 'blur(2px)',
        }),
        badge: (base) => ({
          ...base,
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '12px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
        }),
        controls: (base) => ({
          ...base,
          marginTop: '16px',
        }),
        close: (base) => ({
          ...base,
          color: '#6b7280',
          fontSize: '18px',
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          ':hover': {
            backgroundColor: '#f3f4f6',
            color: '#374151',
          },
        }),
      }}
      padding={{ mask: 8, popover: [10, 16] }}
      className='tour-overlay'
    >
      <TourProviderInner>{children}</TourProviderInner>
    </TourProvider>
  )
}
