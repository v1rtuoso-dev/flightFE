import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GenerateReportResponse } from '../types'

interface StatisticsChartsProps {
  reportData: GenerateReportResponse
}

// Color palettes for charts
const STATUS_COLORS = {
  DONE: '#22c55e',
  WORKING: '#3b82f6',
  OVERDUE: '#ef4444',
  CANCELLED: '#6b7280',
} as const

export function StatisticsCharts({ reportData }: StatisticsChartsProps) {
  const { data } = reportData
  const { overallSummary, recipientReports } = data

  // Prepare data for overall status chart
  const overallStatusData = [
    {
      name: 'Hoàn thành',
      value: overallSummary.doneAssignments,
      color: STATUS_COLORS.DONE,
    },
    {
      name: 'Đang thực hiện',
      value: overallSummary.workingAssignments,
      color: STATUS_COLORS.WORKING,
    },
    {
      name: 'Quá hạn',
      value: overallSummary.overdueAssignments,
      color: STATUS_COLORS.OVERDUE,
    },
    {
      name: 'Hủy bỏ',
      value: overallSummary.cancelledAssignments,
      color: STATUS_COLORS.CANCELLED,
    },
  ].filter((item) => item.value > 0)

  // Prepare data for completion rate comparison
  const completionRateData = recipientReports.map((report) => ({
    name: report.recipient.name,
    completionRate: report.summary.completionRate,
    onTimeRate: report.summary.onTimeRate,
    totalAssignments: report.summary.totalAssignments,
    doneAssignments: report.summary.doneAssignments,
    workingAssignments: report.summary.workingAssignments,
    overdueAssignments: report.summary.overdueAssignments,
  }))

  return (
    <div className='space-y-6'>
      {/* Overall Status Pie Chart */}
      <Card className='border-2 border-indigo-100 shadow-lg'>
        <CardHeader className='bg-linear-to-r from-indigo-50 to-purple-50 pb-4'>
          <CardTitle className='text-xl font-bold text-gray-800'>
            🎯 Tổng quan trạng thái công việc
          </CardTitle>
          <p className='mt-2 text-sm text-gray-600'>
            Phân bổ trạng thái của tất cả công việc trong hệ thống
          </p>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Summary Stats */}
            <div className='space-y-4 lg:col-span-1'>
              <h4 className='font-semibold text-gray-700'>📈 Tổng kết</h4>
              <div className='space-y-3'>
                <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
                  <div className='text-2xl font-bold text-green-700'>
                    {overallSummary.doneAssignments}
                  </div>
                  <div className='text-sm text-green-600'>Đã hoàn thành</div>
                </div>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                  <div className='text-2xl font-bold text-blue-700'>
                    {overallSummary.workingAssignments}
                  </div>
                  <div className='text-sm text-blue-600'>Đang thực hiện</div>
                </div>
                <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
                  <div className='text-2xl font-bold text-red-700'>
                    {overallSummary.overdueAssignments}
                  </div>
                  <div className='text-sm text-red-600'>Quá hạn</div>
                </div>
                {overallSummary.cancelledAssignments > 0 && (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
                    <div className='text-2xl font-bold text-gray-700'>
                      {overallSummary.cancelledAssignments}
                    </div>
                    <div className='text-sm text-gray-600'>Hủy bỏ</div>
                  </div>
                )}
              </div>
            </div>

            {/* Pie Chart */}
            <div className='lg:col-span-2'>
              <ResponsiveContainer width='100%' height={400}>
                <PieChart>
                  <Pie
                    data={overallStatusData}
                    cx='50%'
                    cy='50%'
                    labelLine={true}
                    label={(props) => {
                      const name = props.name || ''
                      const percent = props.percent || 0
                      return `${name}: ${(percent * 100).toFixed(1)}%`
                    }}
                    outerRadius={100}
                    innerRadius={40}
                    fill='#8884d8'
                    dataKey='value'
                    stroke='#ffffff'
                    strokeWidth={2}
                  >
                    {overallStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Số lượng']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign='bottom'
                    height={36}
                    iconType='circle'
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Statistics */}
      <Card className='border-2 border-blue-100 shadow-lg'>
        <CardHeader className='bg-linear-to-r from-blue-50 to-emerald-50 pb-4'>
          <CardTitle className='text-xl font-bold text-gray-800'>
            📊 Phân tích hiệu suất và số lượng công việc theo đối tượng
          </CardTitle>
          <p className='mt-2 text-sm text-gray-600'>
            Tổng hợp đầy đủ về số lượng công việc, tỷ lệ hoàn thành và tỷ lệ
            đúng hạn
          </p>
        </CardHeader>
        <CardContent>
          {/* Summary Cards */}
          <div className='mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7'>
            <div className='rounded-lg border border-purple-200 bg-purple-50 p-4 text-center'>
              <div className='text-2xl font-bold text-purple-700'>
                {completionRateData.reduce(
                  (acc, item) => acc + item.totalAssignments,
                  0
                )}
              </div>
              <div className='text-sm text-purple-600'>Tổng công việc</div>
            </div>
            <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
              <div className='text-2xl font-bold text-green-700'>
                {recipientReports.reduce(
                  (acc, report) => acc + report.summary.doneAssignments,
                  0
                )}
              </div>
              <div className='text-sm text-green-600'>Đã hoàn thành</div>
            </div>
            <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 text-center'>
              <div className='text-2xl font-bold text-blue-700'>
                {recipientReports.reduce(
                  (acc, report) => acc + report.summary.workingAssignments,
                  0
                )}
              </div>
              <div className='text-sm text-blue-600'>Đang thực hiện</div>
            </div>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center'>
              <div className='text-2xl font-bold text-yellow-700'>
                {recipientReports.reduce(
                  (acc, report) =>
                    acc +
                    (report.summary.totalAssignments -
                      report.summary.doneAssignments),
                  0
                )}
              </div>
              <div className='text-sm text-yellow-600'>Chưa hoàn thành</div>
            </div>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
              <div className='text-2xl font-bold text-red-700'>
                {recipientReports.reduce(
                  (acc, report) => acc + report.summary.overdueAssignments,
                  0
                )}
              </div>
              <div className='text-sm text-red-600'>Quá hạn</div>
            </div>
            <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center'>
              <div className='text-2xl font-bold text-emerald-700'>
                {Math.round(
                  completionRateData.reduce(
                    (acc, item) => acc + item.completionRate,
                    0
                  ) / completionRateData.length
                )}
                %
              </div>
              <div className='text-sm text-emerald-600'>
                Tỷ lệ hoàn thành trung bình
              </div>
            </div>
            <div className='rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-center'>
              <div className='text-2xl font-bold text-cyan-700'>
                {Math.round(
                  completionRateData.reduce(
                    (acc, item) => acc + item.onTimeRate,
                    0
                  ) / completionRateData.length
                )}
                %
              </div>
              <div className='text-sm text-cyan-600'>
                Tỷ lệ đúng hạn trung bình
              </div>
            </div>
          </div>

          {/* Dual Chart Layout */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Percentage Chart */}
            <div>
              <h4 className='mb-4 text-center text-lg font-semibold text-gray-700'>
                🎯 Tỷ lệ hiệu suất (%)
              </h4>
              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={completionRateData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  barCategoryGap='30%'
                  barGap={8}
                >
                  <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                  <XAxis
                    dataKey='name'
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor='end'
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={[0, 100]}
                    tickFormatter={(value: number) => `${value}%`}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toFixed(1)}%`,
                      name,
                    ]}
                  />
                  <Legend iconType='rect' />
                  <Bar
                    dataKey='completionRate'
                    fill='#10b981'
                    name='Tỷ lệ hoàn thành'
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey='onTimeRate'
                    fill='#3b82f6'
                    name='Tỷ lệ đúng hạn'
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quantity Chart */}
            <div>
              <h4 className='mb-4 text-center text-lg font-semibold text-gray-700'>
                📈 Số lượng công việc
              </h4>
              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={completionRateData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  barCategoryGap='30%'
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                  <XAxis
                    dataKey='name'
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor='end'
                    height={80}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10 }} width={40} />
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend iconType='rect' />
                  <Bar
                    dataKey='totalAssignments'
                    fill='#8b5cf6'
                    name='Tổng công việc'
                    radius={[1, 1, 0, 0]}
                  />
                  <Bar
                    dataKey='doneAssignments'
                    fill='#10b981'
                    name='Đã hoàn thành'
                    radius={[1, 1, 0, 0]}
                  />
                  <Bar
                    dataKey='workingAssignments'
                    fill='#3b82f6'
                    name='Đang thực hiện'
                    radius={[1, 1, 0, 0]}
                  />
                  <Bar
                    dataKey='overdueAssignments'
                    fill='#ef4444'
                    name='Quá hạn'
                    radius={[1, 1, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
