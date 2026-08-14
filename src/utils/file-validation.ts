import {
  ACCEPTED_FILE_EXTENSIONS,
  ACCEPTED_FILE_TYPES,
  EXTENSION_TO_MIME_TYPE,
} from '@/constants/file'

/**
 * Validates if a file is allowed based on its extension and MIME type
 */
export function isFileTypeAllowed(file: File): boolean {
  const fileExtension = getFileExtension(file.name)

  // Check if extension is allowed
  if (!ACCEPTED_FILE_EXTENSIONS.includes(fileExtension)) {
    return false
  }

  // Check if MIME type is allowed
  return ACCEPTED_FILE_TYPES.includes(file.type)
}

/**
 * Gets the correct MIME type based on file extension
 * This helps handle cases where browsers might report incorrect MIME types
 */
export function getCorrectMimeType(file: File): string {
  const fileExtension = getFileExtension(file.name)
  const correctMimeType =
    EXTENSION_TO_MIME_TYPE[fileExtension as keyof typeof EXTENSION_TO_MIME_TYPE]

  // Return the correct MIME type based on extension, fallback to file.type
  return correctMimeType || file.type
}

/**
 * Gets file extension including the dot (e.g., ".pdf", ".docx")
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  if (lastDotIndex === -1) return ''
  return filename.slice(lastDotIndex).toLowerCase()
}

/**
 * Gets a user-friendly file type name
 */
export function getFriendlyFileTypeName(mimeType: string): string {
  const friendlyNames: Record<string, string> = {
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      'PowerPoint (.pptx)',
    'application/vnd.ms-powerpoint': 'PowerPoint (.ppt)',
    'application/pdf': 'PDF',
    'application/msword': 'Word (.doc)',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'Word (.docx)',
    'application/vnd.ms-excel': 'Excel (.xls)',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'Excel (.xlsx)',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/webp': 'WebP',
    'text/plain': 'Text',
  }

  return friendlyNames[mimeType] || mimeType
}
