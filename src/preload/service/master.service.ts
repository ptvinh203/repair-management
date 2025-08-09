import * as fs from 'fs'
import { join } from 'path'
import AbstractService from '@preload/service/abstract.service'
import { getSuccessResponse, type AppResponse } from '@preload/common/model/response'
import type { IOptionList } from '@preload/controller/master/master.type'

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
      const distinctKeys = await this.prisma.common.findMany({
        where: { deleted_at: null },
        distinct: ['key'],
        select: { key: true }
      })

      const csvPath = join(__dirname, '../../prisma/data/common.csv')
      if (!fs.existsSync(csvPath)) {
        throw new Error(`CSV file not found at path: ${csvPath}`)
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      const lines = csvContent.trim().split('\n')

      // Skip the header row
      const dataLines = lines.slice(1)
      const keys = new Set<string>()

      const commonData = dataLines.map((line) => {
        const columns = line.split(',')
        keys.add(columns[0])

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

      // Check if the Common table already contains all distinct keys
      const isSameAllElements = distinctKeys.every((item) => keys.has(item.key))
      if (keys.size === distinctKeys.length && isSameAllElements) {
        return
      }

      // If there are existing records, delete them before inserting new data
      if (distinctKeys.length > 0) {
        await this.prisma.common.deleteMany()
      }

      // Insert all data in a single transaction
      await this.prisma.common.createMany({ data: commonData })
    } catch (error) {
      console.error('Error initializing Common table data:', error)
    }
  }

  /**
   * Retrieves common data by key.
   * This function fetches records from the Common table based on the provided key.
   * It returns an array of objects containing the key and value for each record.
   *
   * @param {string} key - The key to filter the Common table records
   * @returns {Promise<AppResponse<IOptionList>>} A promise that resolves to an AppResponse containing the common data
   */
  public async getOptionsByKey(key: string): Promise<AppResponse<IOptionList>> {
    try {
      const commons = await this.prisma.common.findMany({
        where: { key, deleted_at: null },
        orderBy: { display_order: 'asc' },
        select: {
          cd: true,
          value: true,
          extra_1: true,
          extra_2: true,
          extra_3: true,
          extra_4: true,
          extra_5: true
        }
      })

      return getSuccessResponse(
        commons.map((item) => ({ ...item, key: item.value, value: item.cd }))
      )
    } catch {
      return getSuccessResponse([])
    }
  }

  /**
   * Retrieves a map of key-value pairs for a given key.
   * This function fetches options from the Common table based on the provided key
   * and returns them as a record where keys are the option keys and values are the option values.
   *
   * @param {string} key - The key to filter the Common table records
   * @returns {Promise<Record<number, string>>} A promise that resolves to a record of key-value pairs
   */
  public async getKeyMapValue(key: string): Promise<Record<number, string>> {
    const options = await this.getOptionsByKey(key)
    if (!options.success) {
      return {}
    }

    return options.data!.reduce(
      (acc, item) => {
        acc[item.value] = item.key

        return acc
      },
      {} as Record<number, string>
    )
  }
}

export const masterService = new MasterService()
