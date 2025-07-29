import AbstractService from '../abstract.service'
import {
  getErrorResponse,
  getServerErrorResponse,
  getSuccessResponse
} from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type { ICustomerCreateRequest } from '@preload/controller/customer/customer-create/customer-create.type'

class CustomerCreateService extends AbstractService {
  /**
   * Creates a new customer if the phone number does not already exist.
   *
   * @param {ICustomerCreateRequest} requestBody - The data used to create a new customer.
   * @returns {Promise<AppResponse<any>>} A promise that resolves to a success response if the customer is created,
   * or an error response if the phone number already exists.
   */
  async createCustomer(requestBody: ICustomerCreateRequest): Promise<AppResponse<any>> {
    try {
      const isExistingPhone = await this.prisma.customer.findFirst({
        where: { phone: requestBody.phone }
      })
      if (isExistingPhone) {
        return getErrorResponse('ERR00000001')
      }

      await this.prisma.customer.create({ data: requestBody })

      return getSuccessResponse()
    } catch {
      return getServerErrorResponse()
    }
  }
}

export const customerCreateService = new CustomerCreateService()
