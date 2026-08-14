import { useQuery } from '@tanstack/react-query'
import { AUTH_TOKEN_KEY } from '@/config/auth'
import { taskKeysFactory } from '@/api/query-key-factory'
import { envVariables } from '@/lib/env'
import { AvailableAttachmentsResponse } from '../types/available-attachments'

// Query options for available attachments API
export const availableAttachmentsQueryOptions = (parentTaskId: number) => ({
  queryKey: taskKeysFactory.availableAttachments(parentTaskId),
  queryFn: async (): Promise<AvailableAttachmentsResponse> => {
    // Sử dụng raw fetch vì endpoint chưa có trong generated schema
    const response = await fetch(
      `${envVariables.viteBaseApi}/api/tasks/${parentTaskId}/available-attachments`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          ...(localStorage.getItem(AUTH_TOKEN_KEY) && {
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
          }),
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch available attachments: ${response.status}`
      )
    }

    const data = await response.json()
    return data
  },
})

export const useAvailableAttachments = (parentTaskId: number) =>
  useQuery({
    ...availableAttachmentsQueryOptions(parentTaskId),
    enabled: !!parentTaskId, // Enable API call
    // Fallback to mock data if API fails (for development)
    placeholderData: {
      message: 'Success',
      statusCode: 200,
      success: true,
      data: [
        {
          id: 1,
          fileName: 'passport-scan.pdf',
          filePath: '/attachments/passport-scan.pdf',
          fileSize: 2_048_576,
          createdAt: '2024-01-15T10:30:00Z',
          source: 'parent_task' as const,
          sourceDescription: `Từ công việc cha #${parentTaskId}`,
          accessLevel: 'read_only' as const,
          canAccess: true,
          sourceTaskId: parentTaskId,
        },
        {
          id: 2,
          fileName: 'flight-booking.docx',
          filePath: '/attachments/flight-booking.docx',
          fileSize: 1_024_000,
          createdAt: '2024-01-15T14:20:00Z',
          source: 'assignment' as const,
          sourceDescription: 'Từ phân công của công việc cha',
          accessLevel: 'read_write' as const,
          canAccess: true,
          sourceAssignmentId: 456,
        },
        {
          id: 3,
          fileName: 'visa-application.pdf',
          filePath: '/attachments/visa-application.pdf',
          fileSize: 512_000,
          createdAt: '2024-01-15T16:45:00Z',
          source: 'shared' as const,
          sourceDescription: 'File được chia sẻ từ hệ thống',
          accessLevel: 'download_only' as const,
          canAccess: false,
        },
      ],
    } as AvailableAttachmentsResponse,
  })
