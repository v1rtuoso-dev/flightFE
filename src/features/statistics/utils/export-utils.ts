import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import type { GenerateReportResponse } from '../types'

// Format date for Vietnamese locale
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// Export to Word with full Vietnamese support
export const exportToWord = async (reportData: GenerateReportResponse) => {
  try {
    const { data } = reportData
    const { reportMetadata, overallSummary, recipientReports } = data

    const recipientTypeText =
      reportMetadata.recipientType === 'USER'
        ? 'Cá nhân'
        : reportMetadata.recipientType === 'TEAM'
          ? 'Đội'
          : 'Tổ'

    // Create table data
    const tableRows = [
      // Header row
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Tên', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Tổng', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Hoàn thành', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Đang làm', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'Quá hạn', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'TL Hoàn thành', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: 'TL Đúng hạn', bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
      }),
      // Data rows
      ...recipientReports.map(
        (report) =>
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: report.recipient.name })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.summary.totalAssignments.toString(),
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.summary.doneAssignments.toString(),
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.summary.workingAssignments.toString(),
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: report.summary.overdueAssignments.toString(),
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${report.summary.completionRate.toFixed(1)}%`,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${report.summary.onTimeRate.toFixed(1)}%`,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
            ],
          })
      ),
    ]

    // Create Word document
    const doc = new Document({
      sections: [
        {
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: 'BÁO CÁO THỐNG KÊ CÔNG VIỆC',
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({ children: [new TextRun({ text: '' })] }),

            // Metadata
            new Paragraph({
              children: [
                new TextRun({
                  text: 'THÔNG TIN CHUNG',
                  bold: true,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Loại đối tượng: ${recipientTypeText}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Từ ngày: ${formatDate(reportMetadata.startDate)}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Đến ngày: ${formatDate(reportMetadata.endDate)}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Tổng số đối tượng: ${reportMetadata.totalRecipients}`,
                }),
              ],
            }),

            new Paragraph({ children: [new TextRun({ text: '' })] }),

            // Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: 'TỔNG QUAN',
                  bold: true,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Tổng phân công: ${overallSummary.totalAssignments}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Đã hoàn thành: ${overallSummary.doneAssignments}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Đang thực hiện: ${overallSummary.workingAssignments}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Quá hạn: ${overallSummary.overdueAssignments}`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Tỷ lệ hoàn thành: ${overallSummary.completionRate.toFixed(1)}%`,
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Tỷ lệ đúng hạn: ${overallSummary.onTimeRate.toFixed(1)}%`,
                }),
              ],
            }),

            new Paragraph({ children: [new TextRun({ text: '' })] }),

            // Table title
            new Paragraph({
              children: [
                new TextRun({
                  text: 'CHI TIẾT THEO ĐỐI TƯỢNG',
                  bold: true,
                }),
              ],
            }),

            // Table
            new Table({
              rows: tableRows,
            }),
          ],
        },
      ],
    })

    // Generate and save file
    const startDate = formatDate(reportMetadata.startDate).replaceAll('/', '-')
    const endDate = formatDate(reportMetadata.endDate).replaceAll('/', '-')
    const fileName = `bao-cao-thong-ke-${startDate}-${endDate}.docx`

    // Use toBlob instead of toBuffer for browser compatibility
    const blob = await Packer.toBlob(doc)
    saveAs(blob, fileName)
  } catch (error) {
    throw error
  }
}

// Export to Excel
export const exportToExcel = (reportData: GenerateReportResponse) => {
  const { data } = reportData
  const { reportMetadata, overallSummary, recipientReports } = data

  const workbook = XLSX.utils.book_new()

  // Summary worksheet
  const summaryData = [
    ['BÁO CÁO THỐNG KÊ CÔNG VIỆC'],
    [''],
    ['=== THÔNG TIN CHUNG ==='],
    [
      'Loại đối tượng:',
      reportMetadata.recipientType === 'USER'
        ? 'Cá nhân'
        : reportMetadata.recipientType === 'TEAM'
          ? 'Đội'
          : 'Tổ',
    ],
    ['Từ ngày:', formatDate(reportMetadata.startDate)],
    ['Đến ngày:', formatDate(reportMetadata.endDate)],
    ['Tổng số đối tượng:', reportMetadata.totalRecipients],
    [''],
    ['=== TỔNG QUAN ==='],
    ['Tổng phân công:', overallSummary.totalAssignments],
    ['Đã hoàn thành:', overallSummary.doneAssignments],
    ['Đang thực hiện:', overallSummary.workingAssignments],
    ['Quá hạn:', overallSummary.overdueAssignments],
    ['Hủy bỏ:', overallSummary.cancelledAssignments],
    [''],
    ['=== TỶ LỆ ==='],
    ['Tỷ lệ hoàn thành (%):', overallSummary.completionRate.toFixed(1)],
    ['Tỷ lệ đúng hạn (%):', overallSummary.onTimeRate.toFixed(1)],
  ]

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summaryWS, 'Tổng quan')

  // Recipients data worksheet
  const recipientData = [
    [
      'Tên đối tượng',
      'Tổng phân công',
      'Đã hoàn thành',
      'Đang thực hiện',
      'Quá hạn',
      'Hủy bỏ',
      'Tỷ lệ hoàn thành (%)',
      'Tỷ lệ đúng hạn (%)',
      'Thời gian TB (h)',
    ],
    ...recipientReports.map((report) => [
      report.recipient.name,
      report.summary.totalAssignments,
      report.summary.doneAssignments,
      report.summary.workingAssignments,
      report.summary.overdueAssignments,
      report.summary.cancelledAssignments,
      report.summary.completionRate.toFixed(1),
      report.summary.onTimeRate.toFixed(1),
      report.summary.avgCompletionTimeHours.toFixed(1),
    ]),
  ]

  const recipientWS = XLSX.utils.aoa_to_sheet(recipientData)
  XLSX.utils.book_append_sheet(workbook, recipientWS, 'Chi tiết đối tượng')

  // Save Excel file with better filename
  const startDate = formatDate(reportMetadata.startDate).replaceAll('/', '-')
  const endDate = formatDate(reportMetadata.endDate).replaceAll('/', '-')
  const fileName = `bao-cao-thong-ke-${startDate}-${endDate}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
