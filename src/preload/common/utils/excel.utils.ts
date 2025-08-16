import { format } from 'date-fns'
import { app } from 'electron'
import ExcelJS from 'exceljs'
import path from 'path'

export interface ExcelRow {
  [key: string]: string | number | boolean | Date | null | undefined
}

export interface ExcelExportOptions {
  filename?: string
  sheetName?: string
  includeHeaders?: boolean
  autoWidth?: boolean
  style?: {
    headerStyle?: ExcelJS.Style
    dataStyle?: ExcelJS.Style
  }
}

export class ExcelUtils {
  /**
   * Export an array of objects to an Excel file
   * @param data Array of objects to export
   * @param options Export options
   * @returns Promise that resolves when file is written
   */
  static async exportToExcel(data: ExcelRow[], options?: ExcelExportOptions): Promise<void> {
    const {
      filename = `CÔNG_NỢ_${format(new Date(), 'ddMMyyyy_HHmmss')}.xlsx`,
      sheetName = 'Sheet1',
      includeHeaders = true,
      autoWidth = true,
      style = {}
    } = options || {}

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)

    if (data.length === 0) {
      throw new Error('No data provided for export')
    }

    // Get headers from the first object
    const headers = Object.keys(data[0])

    // Add headers if requested
    if (includeHeaders) {
      const headerRow = worksheet.addRow(headers)

      // Apply header styling with Arial font
      headerRow.eachCell((cell) => {
        cell.font = {
          name: 'Arial',
          bold: true,
          size: 11,
          color: { argb: '#000000' },
          ...style.headerStyle?.font
        }

        if (style.headerStyle?.fill) {
          cell.fill = style.headerStyle.fill
        }
      })
    }

    // Add data rows
    data.forEach((rowData) => {
      const rowValues = headers.map((header) => rowData[header])
      const row = worksheet.addRow(rowValues)

      // Apply data styling with Arial font
      row.eachCell((cell) => {
        cell.font = {
          name: 'Arial',
          size: 11,
          color: { argb: 'FF000000' },
          ...style.dataStyle?.font
        }

        if (style.dataStyle?.border) {
          cell.border = style.dataStyle.border
        }
      })
    })

    // Auto-adjust column widths
    if (autoWidth) {
      headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1)
        if (column) {
          // Calculate max width based on header and data
          let maxWidth = header.length

          data.forEach((rowData) => {
            const value = rowData[header]
            if (value !== null && value !== undefined) {
              const valueLength = value.toString().length
              maxWidth = Math.max(maxWidth, valueLength)
            }
          })

          column.width = maxWidth + 2
        }
      })
    }

    // Write the file
    const downloadsPath = app.getPath('downloads')
    const filePath = path.join(downloadsPath, filename)
    await workbook.xlsx.writeFile(filePath)
  }

  /**
   * Export data to Excel and return as buffer
   * @param data Array of objects to export
   * @param options Export options
   * @returns Promise that resolves to buffer
   */
  static async exportToBuffer(
    data: ExcelRow[],
    options: ExcelExportOptions = {}
  ): Promise<ExcelJS.Buffer> {
    const { sheetName = 'Sheet1', includeHeaders = true, autoWidth = true, style = {} } = options

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(sheetName)

    if (data.length === 0) {
      throw new Error('No data provided for export')
    }

    // Get headers from the first object
    const headers = Object.keys(data[0])

    // Add headers if requested
    if (includeHeaders) {
      const headerRow = worksheet.addRow(headers)

      // Apply header styling with Arial font
      headerRow.eachCell((cell) => {
        cell.font = {
          name: 'Arial',
          bold: true,
          size: 12,
          color: { argb: '#000000' },
          ...style.headerStyle?.font
        }

        if (style.headerStyle?.fill) {
          cell.fill = style.headerStyle.fill
        }
      })
    }

    // Add data rows
    data.forEach((rowData) => {
      const rowValues = headers.map((header) => rowData[header])
      const row = worksheet.addRow(rowValues)

      // Apply data styling with Arial font
      row.eachCell((cell) => {
        cell.font = {
          name: 'Arial',
          size: 11,
          color: { argb: 'FF000000' },
          ...style.dataStyle?.font
        }

        if (style.dataStyle?.border) {
          cell.border = style.dataStyle.border
        }
      })
    })

    // Auto-adjust column widths
    if (autoWidth) {
      headers.forEach((header, index) => {
        const column = worksheet.getColumn(index + 1)
        if (column) {
          // Calculate max width based on header and data
          let maxWidth = header.length

          data.forEach((rowData) => {
            const value = rowData[header]
            if (value !== null && value !== undefined) {
              const valueLength = value.toString().length
              maxWidth = Math.max(maxWidth, valueLength)
            }
          })

          column.width = maxWidth + 2
        }
      })
    }

    // Return buffer
    return await workbook.xlsx.writeBuffer()
  }
}
