// Available attachment types for subtask creation
export interface AvailableAttachment {
  id: number
  fileName: string
  filePath: string
  fileSize: number
  createdAt: string
  source: 'parent_task' | 'assignment' | 'shared'
  sourceDescription: string
  accessLevel: 'read_only' | 'read_write' | 'download_only'
  canAccess: boolean
  sourceTaskId?: number
  sourceAssignmentId?: number
}

export interface AvailableAttachmentsResponse {
  message: string
  statusCode: number
  data: AvailableAttachment[]
  success: boolean
}
