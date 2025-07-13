import AbstractService from '@preload/service/abstract.service'
import * as fs from 'fs'
import { join } from 'path'

class MasterService extends AbstractService {
  /**
   * Initializes the Common table with default data from CSV file.
   * This function checks if the Common table is empty and populates it
   * with data from the common.csv file if no records exist.
   *
   * @returns {Promise<void>} A promise that resolves when initialization is complete
   * @throws {Error} If there's an error reading the CSV file or inserting data
   */
  public async initializeData(): Promise<void> {
    try {
      const existingRecordsCount = await this.prisma.common.count()

      if (existingRecordsCount > 0) {
        return
      }

      const csvPath = join(__dirname, '../../prisma/data/common.csv')

      if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found at path: ${csvPath}`)
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      const lines = csvContent.trim().split('\n')

      // Skip the header row
      const dataLines = lines.slice(1)

      const commonData = dataLines.map((line) => {
        const columns = line.split(',')
        return {
          key: columns[0],
          name: columns[1],
          cd: parseInt(columns[2]),
          value: columns[3],
          display_order: parseInt(columns[4]),
          extra_1: columns[5] || null,
          extra_2: columns[6] || null,
          extra_3: columns[7] || null,
          extra_4: columns[8] || null,
          extra_5: columns[9] || null
        }
      })

      // Insert all data in a single transaction
      await this.prisma.common.createMany({ data: commonData })
    } catch (error) {
      console.error('Error initializing Common table data:', error)
    }
  }
}

export const masterService = new MasterService()
