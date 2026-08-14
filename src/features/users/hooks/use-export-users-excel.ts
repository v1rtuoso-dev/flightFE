import { useMutation } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import { UserItem } from '../types'

interface ExportUsersExcelParams {
  users: UserItem[]
  filename?: string
}

interface ExportUsersExcelOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

const exportUsersToExcel = ({
  users,
  filename = 'danh-sach-nguoi-dung',
}: ExportUsersExcelParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Prepare data for export
      const exportData = users.map((user, index) => ({
        STT: index + 1,
        ID: user.id,
        'Họ và tên': user.name,
        Email: user.email,
        'Đội nhóm': user.teamName || 'N/A',
        Tổ: user.unitName || 'N/A',
        'Vai trò': user.roleName || 'N/A',
        'Số quyền hạn': user.permissions?.length || 0,
        'Danh sách quyền hạn': user.permissions?.join(', ') || 'Không có',
      }))

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // Set column widths for better appearance
      const columnWidths = [
        { wch: 5 }, // STT
        { wch: 8 }, // ID
        { wch: 25 }, // Họ và tên
        { wch: 30 }, // Email
        { wch: 20 }, // Đội nhóm
        { wch: 20 }, // Tổ
        { wch: 20 }, // Vai trò
        { wch: 12 }, // Số quyền hạn
        { wch: 50 }, // Danh sách quyền hạn
      ]
      worksheet['!cols'] = columnWidths

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách người dùng')

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      })

      // Create blob and save file
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0]
      const finalFilename = `${filename}-${currentDate}.xlsx`

      saveAs(blob, finalFilename)
      resolve()
    } catch (error) {
      reject(
        error instanceof Error
          ? error
          : new Error('Có lỗi xảy ra khi xuất file Excel')
      )
    }
  })
}

export function useExportUsersExcel(options: ExportUsersExcelOptions = {}) {
  return useMutation({
    mutationFn: exportUsersToExcel,
    onSuccess: () => {
      toast.success('Xuất file Excel thành công!')
      options.onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xuất file Excel')
      options.onError?.(error)
    },
  })
}
