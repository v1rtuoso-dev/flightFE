// API Response Types for Statistics Reports

export interface ReportMetadata {
  generatedAt: string
  recipientType: 'USER' | 'TEAM' | 'UNIT'
  startDate: string
  endDate: string
  totalRecipients: number
}

export interface OverallSummary {
  totalAssignments: number
  doneAssignments: number
  workingAssignments: number
  overdueAssignments: number
  cancelledAssignments: number
  completionRate: number
  onTimeRate: number
}

export interface Recipient {
  type: 'USER' | 'TEAM' | 'UNIT'
  id: number
  name: string
  email?: string
}

export interface AssignmentSummary {
  totalAssignments: number
  doneAssignments: number
  workingAssignments: number
  overdueAssignments: number
  cancelledAssignments: number
  completionRate: number
  onTimeRate: number
  avgCompletionTimeHours: number
}

export interface StatusBreakdownItem {
  count: number
  percentage: number
}

export interface StatusBreakdown {
  DONE: StatusBreakdownItem
  WORKING: StatusBreakdownItem
  OVERDUE: StatusBreakdownItem
  CANCELLED: StatusBreakdownItem
}

export interface PriorityBreakdownItem {
  total: number
  done: number
  working: number
  overdue: number
  completionRate: number
}

export interface PriorityBreakdown {
  URGENT: PriorityBreakdownItem
  HIGH: PriorityBreakdownItem
  NORMAL: PriorityBreakdownItem
  LOW: PriorityBreakdownItem
}

export interface WorkloadMetrics {
  avgAssignmentsPerDay: number
  peakDayCount: number
  activeAssignments: number
}

export interface RecipientReport {
  recipient: Recipient
  summary: AssignmentSummary
  statusBreakdown: StatusBreakdown
  priorityBreakdown: PriorityBreakdown
  workloadMetrics: WorkloadMetrics
}

export interface ReportData {
  reportMetadata: ReportMetadata
  overallSummary: OverallSummary
  recipientReports: RecipientReport[]
}

export interface GenerateReportResponse {
  success: boolean
  message: string
  statusCode: number
  data: ReportData
}

// Legacy types - keep for backward compatibility
export interface StatisticsData {
  totalUsers: number
  totalTasks: number
  completedTasks: number
  todayActivities: number
  tasksByStatus: {
    [key: string]: number
  }
  recentActivities: Activity[]
}

export interface Activity {
  id: number
  type: string
  description: string
  createdAt: string
  userId: number
  userName: string
}

export interface StatisticsRequest {
  recipientType: 'USER' | 'TEAM' | 'UNIT'
  recipientIds: number[]
  dateRange: {
    startDate: string
    endDate: string
  }
}

export interface StatisticsResponse {
  success: boolean
  data: StatisticsData
  message?: string
}
