import AbstractService from '../abstract.service'
import { differenceInMonths } from 'date-fns'
import { convertDateToResponse } from '@preload/common/utils/date.utls'
import { getServerErrorResponse, getSuccessResponse } from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type { Prisma } from '@prisma/client'
import type { ISearchPayload, ISearchResponse } from '@preload/controller/search/search.type'

class SearchService extends AbstractService {
  /**
   * Retrieves the warranty status based on the warranty code and repair date.
   *
   * @param warrantyCd - The warranty code.
   * @param repairDate - The date of the repair.
   * @returns A promise that resolves to a number indicating the warranty status:
   *          0: No warranty, 1: In warranty, 2: Out of warranty.
   */
  async getWarrantyStatus(warrantyCd: number | null, repairDate?: Date): Promise<number> {
    if (warrantyCd === null || !repairDate) {
      return 0
    }

    const warrantyMonth = await this.prisma.common.findFirst({
      where: { key: '0000000002', deleted_at: null, cd: warrantyCd },
      select: { extra_1: true }
    })
    const monthsDiff = differenceInMonths(new Date(), repairDate)

    return monthsDiff <= Number(warrantyMonth?.extra_1 ?? 0) ? 1 : 2
  }

  /**
   * Searches for repairs based on the provided search payload.
   *
   * @param searchPayload - The search payload containing customer name or phone, start date, and end date.
   * @returns A promise that resolves to an AppResponse containing an array of search results.
   */
  async search(searchPayload: ISearchPayload): Promise<AppResponse<ISearchResponse[]>> {
    try {
      const { customerNameOrPhone, startDate, endDate, paymentStatus } = searchPayload

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

      if (paymentStatus) {
        whereConditions.payment_status = Number(paymentStatus)
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

      const searchResults: ISearchResponse[] = await Promise.all(
        repairs.map(async (repair) => ({
          id: repair.id,
          repair_date: convertDateToResponse(repair.repair_date),
          repair_description: repair.description,
          customer: `${repair.customer?.name}／${repair.customer?.phone}`,
          repair_cost: repair.cost,
          payment_status: repair.payment_status,
          warranty_status: await this.getWarrantyStatus(repair.warranty_period, repair.repair_date)
        }))
      )

      return getSuccessResponse(searchResults)
    } catch (error) {
      console.error('Search error:', error)

      return getServerErrorResponse()
    }
  }
}

export const searchService = new SearchService()
