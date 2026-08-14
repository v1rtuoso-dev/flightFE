import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { createSubTaskSchema } from '@/features/tasks/schema'

interface UseCreateSubtaskFormProps {
  open: boolean
  onReset?: () => void
}

export const useCreateSubtaskForm = ({
  open,
  onReset,
}: UseCreateSubtaskFormProps) => {
  const form = useForm({
    resolver: standardSchemaResolver(createSubTaskSchema),
  })

  useEffect(() => {
    if (open) {
      form.reset({
        content: '',
        instructions: '',
        notes: '',
        assignments: [],
        attachmentIds: [],
        files: [],
      })
    }

    return () => {
      onReset?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onReset])

  return { form }
}
