import AbstractService from '../abstract.service'
import { getServerErrorResponse, getSuccessResponse } from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type { Prisma } from '@prisma/client'
import type { ISearchPayload, ISearchResponse } from '@preload/controller/search/search.type'

class SearchService extends AbstractService {
  /**
   * Searches for repairs based on the provided search payload.
   *
   * @param searchPayload - The search payload containing customer name or phone, start date, and end date.
   * @returns A promise that resolves to an AppResponse containing an array of search results.
   */
  async search(searchPayload: ISearchPayload): Promise<AppResponse<ISearchResponse[]>> {
    try {
      const { customerNameOrPhone, startDate, endDate } = searchPayload

      // Build where conditions
      const whereConditions: Prisma.RepairWhereInput = {
        deleted_at: null
      }

      // Add date range filter
      if (startDate || endDate) {
        whereConditions.repair_date = {}
        if (startDate) {
          whereConditions.repair_date.gte = new Date(startDate)
        }
        if (endDate) {
          whereConditions.repair_date.lte = new Date(endDate)
        }
      }

      // Add customer search condition
      if (customerNameOrPhone) {
        whereConditions.customer = {
          OR: [
            {
              name: {
                contains: customerNameOrPhone
              }
            },
            {
              phone: {
                contains: customerNameOrPhone
              }
            }
          ],
          deleted_at: null
        }
      }

      const repairs = await this.prisma.repair.findMany({
        where: whereConditions,
        include: {
          customer: true
        },
        orderBy: {
          repair_date: 'desc'
        }
      })

      const searchResults: ISearchResponse[] = repairs.map((repair) => ({
        id: repair.id,
        repair_date: repair.repair_date.toISOString(),
        repair_description: repair.description,
        customer: `${repair.customer?.name} (${repair.customer?.phone})`,
        repair_cost: repair.cost,
        payment_status: repair.payment_status,
        warranty: repair.warranty_period
      }))

      return getSuccessResponse(searchResults)
    } catch {
      return getServerErrorResponse()
    }
  }
}

export const searchService = new SearchService()
