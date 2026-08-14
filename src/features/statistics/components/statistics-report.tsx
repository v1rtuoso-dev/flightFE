import {
  IconUsers,
  IconChecklist,
  IconClock,
  IconX,
  IconCalendar,
} from '@tabler/icons-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { GenerateReportResponse } from '../types'
import { StatisticsCharts } from './statistics-charts'

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

interface StatisticsReportProps {
  reportData: GenerateReportResponse
}

export function StatisticsReport({ reportData }: StatisticsReportProps) {
  const { data } = reportData
  const { reportMetadata, overallSummary, recipientReports } = data

  return (
    <div className='space-y-6'>
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IconCalendar className='h-5 w-5' />
            Báo cáo thống kê
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Loại đối tượng</p>
              <p className='font-semibold'>
                {reportMetadata.recipientType === 'USER'
                  ? 'Cá nhân'
                  : reportMetadata.recipientType === 'TEAM'
                    ? 'Đội'
                    : 'Tổ'}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Từ ngày</p>
              <p className='font-semibold'>
                {formatDate(reportMetadata.startDate)}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Đến ngày</p>
              <p className='font-semibold'>
                {formatDate(reportMetadata.endDate)}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Tổng số đối tượng</p>
              <p className='font-semibold'>{reportMetadata.totalRecipients}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-blue-100 p-2'>
                <IconChecklist className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Tổng phân công</p>
                <p className='text-2xl font-bold'>
                  {overallSummary.totalAssignments}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-green-100 p-2'>
                <IconUsers className='h-5 w-5 text-green-600' />
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Đã hoàn thành</p>
                <p className='text-2xl font-bold text-green-600'>
                  {overallSummary.doneAssignments}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-yellow-100 p-2'>
                <IconClock className='h-5 w-5 text-yellow-600' />
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Đang thực hiện</p>
                <p className='text-2xl font-bold text-yellow-600'>
                  {overallSummary.workingAssignments}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-red-100 p-2'>
                <IconX className='h-5 w-5 text-red-600' />
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Quá hạn</p>
                <p className='text-2xl font-bold text-red-600'>
                  {overallSummary.overdueAssignments}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Tỷ lệ hoàn thành</span>
              <span className='text-muted-foreground text-sm'>
                {overallSummary.completionRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallSummary.completionRate} className='h-2' />

            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Tỷ lệ đúng hạn</span>
              <span className='text-muted-foreground text-sm'>
                {overallSummary.onTimeRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallSummary.onTimeRate} className='h-2' />
          </div>
        </CardContent>
      </Card>

      {/* Modern Tabs */}
      <Tabs defaultValue='charts' className='space-y-8'>
        <div className='flex justify-center'>
          <TabsList className='grid h-12 w-96 grid-cols-2 rounded-2xl border-0 bg-gray-100 p-1'>
            <TabsTrigger
              value='charts'
              className='rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm'
            >
              📊 Biểu đồ
            </TabsTrigger>
            <TabsTrigger
              value='details'
              className='rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm'
            >
              📋 Chi tiết
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='charts' className='space-y-4'>
          <StatisticsCharts reportData={reportData} />
        </TabsContent>

        <TabsContent value='details' className='space-y-6'>
          <div className='space-y-6'>
            <div className='rounded-2xl bg-linear-to-r from-purple-50 to-blue-50 p-6 text-center'>
              <h3 className='text-2xl font-bold text-gray-800'>
                � Báo cáo hiệu suất
              </h3>
              <p className='mt-2 text-gray-600'>
                Thống kê chi tiết theo từng đối tượng
              </p>
            </div>

            {recipientReports.map((report, index) => (
              <Card
                key={`${report.recipient.type}-${report.recipient.id}`}
                className='overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl'
              >
                <div className='bg-linear-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold'>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className='text-xl font-bold'>
                          {report.recipient.name}
                        </h4>
                        <p className='text-indigo-100'>
                          {report.recipient.type === 'USER'
                            ? '👤 Cá nhân'
                            : '👥 Phòng ban'}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-2xl font-bold'>
                        {report.summary.completionRate.toFixed(0)}%
                      </div>
                      <p className='text-indigo-100'>hoàn thành</p>
                    </div>
                  </div>
                </div>
                <div className='p-6'>
                  {/* Stats Grid */}
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                    <div className='rounded-xl bg-blue-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-blue-600'>
                        {report.summary.totalAssignments}
                      </div>
                      <div className='text-sm font-medium text-blue-700'>
                        Tổng CV
                      </div>
                    </div>
                    <div className='rounded-xl bg-green-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-green-600'>
                        {report.summary.doneAssignments}
                      </div>
                      <div className='text-sm font-medium text-green-700'>
                        Hoàn thành
                      </div>
                    </div>
                    <div className='rounded-xl bg-yellow-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-yellow-600'>
                        {report.summary.workingAssignments}
                      </div>
                      <div className='text-sm font-medium text-yellow-700'>
                        Đang làm
                      </div>
                    </div>
                    <div className='rounded-xl bg-red-50 p-4 text-center'>
                      <div className='text-2xl font-bold text-red-600'>
                        {report.summary.overdueAssignments}
                      </div>
                      <div className='text-sm font-medium text-red-700'>
                        Quá hạn
                      </div>
                    </div>
                  </div>

                  {/* Progress Metrics */}
                  <div className='mt-6 grid gap-4 md:grid-cols-2'>
                    <div className='rounded-xl bg-linear-to-r from-green-500 to-emerald-500 p-4 text-white'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-green-100'>Tỷ lệ hoàn thành</p>
                          <p className='text-2xl font-bold'>
                            {report.summary.completionRate.toFixed(1)}%
                          </p>
                        </div>
                        <div className='text-3xl'>✅</div>
                      </div>
                    </div>
                    <div className='rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 p-4 text-white'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-blue-100'>Tỷ lệ đúng hạn</p>
                          <p className='text-2xl font-bold'>
                            {report.summary.onTimeRate.toFixed(1)}%
                          </p>
                        </div>
                        <div className='text-3xl'>⏰</div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className='mt-4 rounded-xl bg-gray-50 p-4'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-600'>
                        Thời gian hoàn thành trung bình
                      </span>
                      <span className='text-lg font-bold text-gray-800'>
                        {report.summary.avgCompletionTimeHours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
