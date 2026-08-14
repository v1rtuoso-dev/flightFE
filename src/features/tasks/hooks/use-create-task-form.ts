import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema } from '@/features/tasks/schema'

interface UseCreateTaskFormProps {
  open: boolean
  onReset?: () => void
}

export const useCreateTaskForm = ({
  open,
  onReset,
}: UseCreateTaskFormProps) => {
  const form = useForm({
    resolver: zodResolver(createTaskSchema),
  })

  useEffect(() => {
    if (open) {
      form.reset({
        content: '',
        instructions: '',
        taskTypeId: '',
        notes: '',
        assignments: [
          {
            recipientId: undefined,
            recipientType: undefined,
          },
        ],
        attachmentIds: [],
        files: [],
      })
    }

    return () => {
      onReset?.()
    }
  }, [open, onReset, form])

  return { form }
}
