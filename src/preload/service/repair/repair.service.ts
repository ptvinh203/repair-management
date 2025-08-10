import AbstractService from '@preload/service/abstract.service'
import { convertDateToPayload, convertPayloadToDate } from '@preload/common/utils/date.utls'
import {
  getErrorResponse,
  getServerErrorResponse,
  getSuccessResponse
} from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type {
  IRepairCreateForm,
  IRepairDetailResponse,
  IRepairUpdateForm
} from '@preload/controller/repair/repair.type'

class RepairService extends AbstractService {
  /**
   * Calculates the payment status based on the payments made and the total cost
   * @param payments - Array of payment objects
   * @param totalCost - Total cost of the repair
   * @returns Payment status: 0 (no payment), 1 (paid), or 2 (partially paid)
   */
  getPaymentStatus(payments: { payment_amount?: number }[], totalCost: number): number {
    const totalPayment = payments.reduce((sum, p) => sum + (p.payment_amount || 0), 0)
    if (totalPayment === 0) {
      return 0
    }

    return totalPayment >= totalCost ? 1 : 2
  }

  /**
   * Creates a new repair record
   * @param formData - The data for the repair to be created
   * @returns A promise that resolves to an AppResponse indicating success or failure
   */
  async createRepair(formData: IRepairCreateForm): Promise<AppResponse> {
    try {
      const { basicInfo, payments, warranties } = formData
      const customer = await this.prisma.customer.findFirst({
        where: { phone: basicInfo.customer_phone || '', deleted_at: null }
      })

      // If customer does not exist, throw error or create new one depending on your logic
      if (!customer) {
        return getErrorResponse('ERR00000002')
      }

      await this.prisma.repair.create({
        data: {
          repair_date: basicInfo.repair_date
            ? convertPayloadToDate(basicInfo.repair_date, 'datetime-local')
            : new Date(),
          customer_id: customer.id,
          description: basicInfo.description!,
          cost: basicInfo.cost!,
          warranty_period: basicInfo.warranty_period ? Number(basicInfo.warranty_period) : null,
          payment_status: this.getPaymentStatus(payments, basicInfo.cost!),
          Payment: {
            create: payments.map((p) => ({
              payment_date: p.payment_date
                ? convertPayloadToDate(p.payment_date, 'datetime-local')
                : new Date(),
              payment_method: Number(p.payment_method!),
              payment_amount: p.payment_amount!
            }))
          },
          Warranty: {
            create: warranties.map((w) => ({
              warranty_date: w.warranty_date
                ? convertPayloadToDate(w.warranty_date, 'datetime-local')
                : new Date(),
              description: w.description!
            }))
          }
        }
      })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Retrieves a repair record by its ID
   * @param id - The ID of the repair to retrieve
   * @returns A promise that resolves to an AppResponse containing the repair details or an error
   */
  async getRepairById(id: number): Promise<AppResponse> {
    try {
      const repair = await this.prisma.repair.findUnique({
        where: { id, deleted_at: null },
        include: {
          customer: {
            where: { deleted_at: null }
          },
          Payment: {
            where: { deleted_at: null },
            orderBy: { id: 'asc' }
          },
          Warranty: {
            where: { deleted_at: null },
            orderBy: { id: 'asc' }
          }
        }
      })

      if (!repair) {
        return getErrorResponse('ERR00000004')
      }

      const response: IRepairDetailResponse = {
        id: repair.id,
        customer: repair.customer as any,
        basicInfo: {
          repair_date: convertDateToPayload(repair.repair_date, 'datetime-local'),
          finish_date: convertDateToPayload(repair.finish_date, 'datetime-local'),
          customer_phone: repair.customer?.phone,
          description: repair.description,
          cost: repair.cost,
          warranty_period: repair.warranty_period ?? undefined,
          payment_status: repair.payment_status,
          remaining_cost:
            repair.cost - repair.Payment.reduce((sum, p) => sum + (p.payment_amount || 0), 0)
        },
        payments: repair.Payment.map((p) => ({
          id: p.id,
          payment_date: convertDateToPayload(p.payment_date, 'datetime-local'),
          payment_method: p.payment_method,
          payment_amount: p.payment_amount
        })),
        warranties: repair.Warranty.map((w) => ({
          id: w.id,
          warranty_date: convertDateToPayload(w.warranty_date, 'datetime-local'),
          description: w.description
        }))
      }

      return getSuccessResponse(response)
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Updates an existing repair record
   * @param id - The ID of the repair to update
   * @param formData - The updated data for the repair
   * @returns A promise that resolves to an AppResponse indicating success or failure
   */
  async updateRepair(id: number, formData: IRepairUpdateForm): Promise<AppResponse> {
    try {
      const repair = await this.prisma.repair.findUnique({
        where: { id, deleted_at: null }
      })

      if (!repair) {
        return getErrorResponse('ERR00000004')
      }

      const { basicInfo, payments, warranties } = formData
      const customer = await this.prisma.customer.findFirst({
        where: { phone: basicInfo.customer_phone || '', deleted_at: null }
      })

      if (!customer) {
        return getErrorResponse('ERR00000002')
      }

      // Update payments
      const existingPayments = await this.prisma.payment.findMany({
        where: { repair_id: id, deleted_at: null }
      })
      const paymentsToDelete = existingPayments.filter(
        (p) => !payments.some((newP) => newP.id === p.id)
      )
      const paymentsToUpdate = payments.filter((p) => {
        const existingPayment = existingPayments.find((ep) => ep.id === p.id)
        const isNotDeletePayment = !paymentsToDelete.some((delP) => delP.id === p.id)

        return existingPayment && isNotDeletePayment
      })
      const paymentsToCreate = payments.filter(
        (p) => !paymentsToUpdate.some((upP) => upP.id === p.id)
      )
      await Promise.all([
        ...paymentsToDelete.map((p) =>
          this.prisma.payment.update({
            where: { id: p.id, deleted_at: null },
            data: { deleted_at: new Date() }
          })
        ),
        ...paymentsToUpdate.map((p) =>
          this.prisma.payment.update({
            where: { id: p.id, deleted_at: null },
            data: {
              payment_date: p.payment_date
                ? convertPayloadToDate(p.payment_date, 'datetime-local')
                : new Date(),
              payment_method: Number(p.payment_method!),
              payment_amount: p.payment_amount!
            }
          })
        ),
        ...paymentsToCreate.map((p) =>
          this.prisma.payment.create({
            data: {
              repair_id: id,
              payment_date: p.payment_date
                ? convertPayloadToDate(p.payment_date, 'datetime-local')
                : new Date(),
              payment_method: Number(p.payment_method!),
              payment_amount: p.payment_amount!
            }
          })
        )
      ])

      // Update warranties
      const existingWarranties = await this.prisma.warranty.findMany({
        where: { repair_id: id, deleted_at: null }
      })
      const warrantiesToDelete = existingWarranties.filter(
        (w) => !warranties.some((newW) => newW.id === w.id)
      )
      const warrantiesToUpdate = warranties.filter((w) => {
        const existingWarranty = existingWarranties.find((ew) => ew.id === w.id)
        const isNotDeleteWarranty = !warrantiesToDelete.some((delW) => delW.id === w.id)

        return existingWarranty && isNotDeleteWarranty
      })
      const warrantiesToCreate = warranties.filter(
        (w) => !warrantiesToUpdate.some((upW) => upW.id === w.id)
      )
      await Promise.all([
        ...warrantiesToDelete.map((w) =>
          this.prisma.warranty.update({
            where: { id: w.id, deleted_at: null },
            data: { deleted_at: new Date() }
          })
        ),
        ...warrantiesToUpdate.map((w) =>
          this.prisma.warranty.update({
            where: { id: w.id, deleted_at: null },
            data: {
              warranty_date: w.warranty_date
                ? convertPayloadToDate(w.warranty_date, 'datetime-local')
                : new Date(),
              description: w.description!
            }
          })
        ),
        ...warrantiesToCreate.map((w) =>
          this.prisma.warranty.create({
            data: {
              repair_id: id,
              warranty_date: w.warranty_date
                ? convertPayloadToDate(w.warranty_date, 'datetime-local')
                : new Date(),
              description: w.description!
            }
          })
        )
      ])

      // Update repair
      await this.prisma.repair.update({
        where: { id, deleted_at: null },
        data: {
          repair_date: basicInfo.repair_date
            ? convertPayloadToDate(basicInfo.repair_date, 'datetime-local')
            : new Date(),
          finish_date: basicInfo.finish_date
            ? convertPayloadToDate(basicInfo.finish_date, 'datetime-local')
            : null,
          description: basicInfo.description!,
          cost: basicInfo.cost!,
          warranty_period: basicInfo.warranty_period ? Number(basicInfo.warranty_period) : null,
          payment_status: this.getPaymentStatus(payments, basicInfo.cost!)
        }
      })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Deletes a repair record by its ID
   * @param id - The ID of the repair to delete
   * @returns A promise that resolves to an AppResponse indicating success or failure
   */
  async deleteRepair(id: number): Promise<AppResponse> {
    try {
      const repair = await this.prisma.repair.findUnique({
        where: { id, deleted_at: null }
      })

      if (!repair) {
        return getErrorResponse('ERR00000004')
      }

      await this.prisma.repair.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() }
      })
      await this.prisma.payment.updateMany({
        where: { repair_id: id, deleted_at: null },
        data: { deleted_at: new Date() }
      })
      await this.prisma.warranty.updateMany({
        where: { repair_id: id, deleted_at: null },
        data: { deleted_at: new Date() }
      })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }
}

export const repairService = new RepairService()
