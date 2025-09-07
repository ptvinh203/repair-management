import AbstractService from '../abstract.service'
import { differenceInMonths } from 'date-fns'
import { convertDateToResponse, convertPayloadToDate } from '@preload/common/utils/date.utls'
import {
  getErrorResponse,
  getServerErrorResponse,
  getSuccessResponse
} from '@preload/common/model/response'
import type { Prisma } from '@prisma/client'
import type { AppResponse } from '@preload/common/model/response'
import { ExcelUtils, type ExcelRow } from '@preload/common/utils/excel.utils'
import type { ISearchPayload, ISearchResponse } from '@preload/controller/search/search.type'
import { masterService } from '../master.service'

class SearchService extends AbstractService {
  /**
   * Retrieves the warranty status based on the warranty code and repair date.
   *
   * @param warrantyCd - The warranty code.
   * @param repairDate - The date of the repair.
   * @param isLable - Whether to return a label or a numeric status.
   * @returns A promise that resolves to the warranty status.
   */
  async getWarrantyStatus(
    warrantyCd: number | null,
    repairDate?: Date,
    isLable: boolean = false
  ): Promise<number | string> {
    const warrantyStatusMap = await masterService.getKeyMapValue('0000000004')
    if (warrantyCd === null || !repairDate) {
      return isLable ? warrantyStatusMap[0] : 0
    }

    const warrantyMonth = await this.prisma.common.findFirst({
      where: { key: '0000000002', deleted_at: null, cd: warrantyCd },
      select: { extra_1: true }
    })
    const monthsDiff = differenceInMonths(new Date(), repairDate)
    if (monthsDiff <= Number(warrantyMonth?.extra_1 ?? 0)) {
      return isLable ? warrantyStatusMap[1] : 1
    }

    return isLable ? warrantyStatusMap[2] : 2
  }

  /**
   * Searches for repairs based on the provided search payload.
   *
   * @param searchPayload - The search payload containing customer suggestion, start date, and end date.
   * @returns A promise that resolves to an AppResponse containing an array of search results.
   */
  async search(searchPayload: ISearchPayload): Promise<AppResponse<ISearchResponse[]>> {
    try {
      const { customer, startDate, endDate, paymentStatus } = searchPayload

      // Build where conditions
      const whereConditions: Prisma.RepairWhereInput = {
        customer: { deleted_at: null },
        deleted_at: null
      }

      // Add date range filter
      if (startDate || endDate) {
        whereConditions.repair_date = {}
        if (startDate) {
          whereConditions.repair_date.gte = convertPayloadToDate(
            `${startDate}T00:00`,
            'datetime-local'
          )
        }
        if (endDate) {
          whereConditions.repair_date.lte = convertPayloadToDate(
            `${endDate}T23:59`,
            'datetime-local'
          )
        }
      }

      // Add customer search condition
      if (customer) {
        const { id, text } = customer
        whereConditions.customer = {
          OR: [
            ...(id
              ? [{ phone: id }]
              : [{ phone: { contains: text } }, { name: { contains: text } }])
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
          customer: `${repair.customer?.phone}／${repair.customer?.name}`,
          repair_cost: repair.cost,
          payment_status: repair.payment_status,
          warranty_status: (await this.getWarrantyStatus(
            repair.warranty_period,
            repair.repair_date
          )) as number
        }))
      )

      return getSuccessResponse(searchResults)
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Exports search results to an Excel file based on the provided search payload.
   *
   * @param searchPayload - The search payload containing customer suggestion, start date, end date, and payment status.
   * @returns A promise that resolves to an AppResponse indicating success or failure.
   */
  async exportExcel(searchPayload: ISearchPayload): Promise<AppResponse> {
    try {
      const { customer, startDate, endDate, paymentStatus } = searchPayload

      // Build where conditions
      const whereConditions: Prisma.RepairWhereInput = {
        deleted_at: null
      }

      // Add date range filter
      if (startDate || endDate) {
        whereConditions.repair_date = {}
        if (startDate) {
          whereConditions.repair_date.gte = convertPayloadToDate(
            `${startDate}T00:00`,
            'datetime-local'
          )
        }
        if (endDate) {
          whereConditions.repair_date.lte = convertPayloadToDate(
            `${endDate}T23:59`,
            'datetime-local'
          )
        }
      }

      // Add customer search condition
      if (customer) {
        const { id, text } = customer
        whereConditions.customer = {
          OR: [
            ...(id
              ? [{ phone: id }]
              : [{ phone: { contains: text } }, { name: { contains: text } }])
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
          customer: true,
          Payment: {
            where: { deleted_at: null }
          },
          Warranty: {
            where: { deleted_at: null }
          }
        },
        orderBy: [{ repair_date: 'desc' }, { customer: { phone: 'asc' } }, { cost: 'asc' }]
      })
      if ((repairs ?? []).length === 0) {
        return getErrorResponse('ERR00000005')
      }

      const paymentStatusMap = await masterService.getKeyMapValue('0000000001')
      const warrantyPeriodMap = await masterService.getKeyMapValue('0000000002')

      const tableData: ExcelRow[] = await Promise.all(
        repairs?.map(async (repair) => {
          const currentPaymentAmount = repair.Payment.reduce(
            (total, payment) => total + (payment.payment_amount ?? 0),
            0
          )

          return {
            'Khách hàng': repair.customer?.name,
            'Số điện thoại': repair.customer?.phone,
            'Ngày sửa chữa': convertDateToResponse(repair.repair_date),
            'Mô tả sửa chữa': repair.description,
            'Chi phí sửa chữa': repair.cost,
            'Trạng thái thanh toán': paymentStatusMap[repair.payment_status],
            'Số tiền thanh toán': currentPaymentAmount,
            'Thời gian bảo hành': warrantyPeriodMap[repair.warranty_period ?? -1] ?? '',
            'Trạng thái bảo hành': await this.getWarrantyStatus(
              repair.warranty_period,
              repair.repair_date,
              true
            ),
            'Số lần bảo hành': repair.Warranty?.length ?? 0
          }
        }) ?? []
      )

      await ExcelUtils.exportToExcel(tableData)

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }
}

export const searchService = new SearchService()
