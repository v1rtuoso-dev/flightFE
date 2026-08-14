import { useState } from 'react'
import {
  IconDownload,
  IconFileTypeDocx,
  IconFileSpreadsheet,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GenerateReportResponse } from '../types'
import { exportToWord, exportToExcel } from '../utils/export-utils'

interface ExportReportProps {
  reportData: GenerateReportResponse
}

export function ExportReport({ reportData }: ExportReportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'word' | 'excel') => {
    try {
      setIsExporting(true)

      switch (format) {
        case 'word': {
          await exportToWord(reportData)
          break
        }
        case 'excel': {
          exportToExcel(reportData)
          break
        }
      }
    } catch {
      // Handle export error silently
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <IconDownload className='h-5 w-5' />
          Xuất báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex flex-wrap gap-3'>
          <Button
            variant='outline'
            onClick={() => {
              void handleExport('word')
            }}
            disabled={isExporting}
            className='flex items-center gap-2'
          >
            <IconFileTypeDocx className='h-4 w-4' />
            Xuất Word
          </Button>

          <Button
            variant='outline'
            onClick={() => {
              void handleExport('excel')
            }}
            disabled={isExporting}
            className='flex items-center gap-2'
          >
            <IconFileSpreadsheet className='h-4 w-4' />
            Xuất Excel
          </Button>
        </div>

        {isExporting && (
          <div className='text-muted-foreground mt-3 text-sm'>
            Đang xuất báo cáo, vui lòng đợi...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
