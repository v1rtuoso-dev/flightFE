import { useState } from 'react'
import { useGenerateReport } from '../hooks/use-generate-report'
import type { StatisticsFilterInput } from '../schema'
import type { GenerateReportResponse } from '../types'
import { ExportReport } from './export-report'
import { StatisticsFilter } from './statistics-filter'
import { StatisticsReport } from './statistics-report'

export function Statistics() {
  const [reportData, setReportData] = useState<GenerateReportResponse | null>(
    null
  )

  const generateReportMutation = useGenerateReport()

  const handleFilter = async (data: StatisticsFilterInput) => {
    try {
      const requestData = {
        recipientType: data.recipientType,
        recipientIds: data.recipientIds,
        startDate: data.dateRange.startDate,
        endDate: data.dateRange.endDate,
      }

      const result = await generateReportMutation.mutateAsync(requestData)
      setReportData(result)
    } catch (error) {
      // Handle error appropriately - you might want to show a toast notification
      throw error
    }
  }
  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Thống kê</h1>
          <p className='text-muted-foreground'>
            Xem tổng quan và thống kê hệ thống
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <StatisticsFilter
        onFilter={handleFilter}
        isLoading={generateReportMutation.isPending}
      />

      {/* Export Options */}
      {reportData && <ExportReport reportData={reportData} />}

      {/* Report Results */}
      {reportData && <StatisticsReport reportData={reportData} />}
    </div>
  )
}
