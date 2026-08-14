/**
 * Utility functions for file viewing with Office Online and Google Docs integration
 */

const getFileExtension = (fileName: string) => {
  return fileName.toLowerCase().split('.').pop() || ''
}

const getViewerUrl = (filePath: string, fileName: string) => {
  const extension = getFileExtension(fileName)
  const encodedUrl = encodeURIComponent(filePath)

  // Office files - use Microsoft Office Online
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
  if (officeExtensions.includes(extension)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
  }

  // PDF files - can be viewed directly
  if (extension === 'pdf') {
    return filePath
  }

  // Image files - can be viewed directly
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp']
  if (imageExtensions.includes(extension)) {
    return filePath
  }

  // Text files - can be viewed directly
  const textExtensions = ['txt', 'md', 'json', 'xml', 'html', 'css', 'js', 'ts']
  if (textExtensions.includes(extension)) {
    return filePath
  }

  // For other files, try Google Docs Viewer as fallback
  return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`
}

/**
 * Open file for viewing with appropriate viewer (Office Online, Google Docs, or direct)
 * @param filePath - URL/path to the file
 * @param fileName - Name of the file (used to determine file type)
 */
export const openFileForViewing = (filePath: string, fileName: string) => {
  if (!filePath || !fileName) {
    return
  }

  try {
    const viewerUrl = getViewerUrl(filePath, fileName)

    // Open with appropriate viewer
    const newWindow = globalThis.open(
      viewerUrl,
      '_blank',
      'noopener,noreferrer'
    )

    // Fallback if popup blocked
    if (!newWindow) {
      // Create a temporary link for viewing
      const link = document.createElement('a')
      link.href = viewerUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.append(link)
      link.click()
      link.remove()
    }
  } catch {
    // If viewer fails, fallback to direct file URL
    const newWindow = globalThis.open(filePath, '_blank', 'noopener,noreferrer')

    if (!newWindow) {
      const link = document.createElement('a')
      link.href = filePath
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.append(link)
      link.click()
      link.remove()
    }
  }
}

/**
 * Check if file is an Office document
 */
export const isOfficeFile = (fileName: string) => {
  const extension = getFileExtension(fileName)
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
  return officeExtensions.includes(extension)
}
