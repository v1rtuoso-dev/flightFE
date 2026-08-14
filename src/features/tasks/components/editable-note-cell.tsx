import React from 'react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { FormFieldTooltipError } from '@/components/form-field-tooltip-error'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import { TaskAssignment } from '@/features/tasks/types'

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface EditableNoteCellProps {
  assignment: TaskAssignment
  assignmentId: number
  form: UseFormReturn<TaskAssignmentUpdateForm>
}

export const EditableNoteCell = React.memo(
  ({ assignment, assignmentId, form }: EditableNoteCellProps) => {
    if (assignmentId === assignment.assignmentId) {
      return (
        <FormField
          control={form.control}
          name='note'
          render={({ field, fieldState }) => (
            <FormItem className='flex flex-col'>
              <FormControl>
                <FormFieldTooltipError
                  message={fieldState.error?.message || ''}
                  showError={!!fieldState.error}
                >
                  <Textarea
                    {...field}
                    placeholder='Thêm ghi chú'
                    className={cn(
                      'max-w-[200px] text-sm',
                      fieldState.error && 'border-destructive'
                    )}
                  />
                </FormFieldTooltipError>
              </FormControl>
            </FormItem>
          )}
        />
      )
    }
    const noteText = assignment.note || 'Không có ghi chú'
    const hasLongNote = noteText.length > 50
    const hasNote = assignment.note && assignment.note.trim().length > 0

    if (hasLongNote) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='hover:text-foreground max-w-[200px] cursor-pointer truncate text-sm'>
              {noteText}
            </div>
          </TooltipTrigger>
          <TooltipContent
            className='max-w-md border border-slate-700 bg-slate-800 p-3 shadow-lg'
            side='top'
          >
            <div className='space-y-2'>
              <p className='text-sm font-medium text-white'>Ghi chú</p>
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-slate-100'>
                {noteText}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      )
    }

    if (hasNote) {
      return <div className='max-w-[200px] truncate text-sm'>{noteText}</div>
    }

    return (
      <div className='text-muted-foreground max-w-[200px] truncate text-sm italic'>
        {noteText}
      </div>
    )
  }
)

EditableNoteCell.displayName = 'EditableNoteCell'
