import { useMutation } from '@tanstack/react-query'
import { fetchClient } from '@/api'
import type { GenerateReportRequest } from '../schema'
import type { GenerateReportResponse } from '../types'

export function useGenerateReport() {
  return useMutation({
    mutationFn: async (
      request: GenerateReportRequest
    ): Promise<GenerateReportResponse> => {
      const response = await fetchClient.POST(
        '/api/reports/recipients/generate' as any,
        {
          body: request,
        }
      )

      if (response.error) {
        throw new Error('Failed to generate report')
      }

      return response.data as GenerateReportResponse
    },
  })
}
