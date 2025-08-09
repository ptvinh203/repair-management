import AbstractService from '../abstract.service'
import {
  getErrorResponse,
  getServerErrorResponse,
  getSuccessResponse
} from '@preload/common/model/response'
import type { AppResponse } from '@preload/common/model/response'
import type {
  ICustomerCreateRequest,
  ICustomerResponse
} from '@preload/controller/customer/customer.type'

class CustomerService extends AbstractService {
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
        where: { phone: requestBody.phone, deleted_at: null }
      })

      if (isExistingPhone) {
        return getErrorResponse('ERR00000001')
      }

      await this.prisma.customer.create({ data: requestBody })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Retrieves all customers from the database.
   *
   * @returns {Promise<AppResponse<ICustomerResponse[]>>} A promise that resolves to a success response containing an array of customers,
   * or a server error response if the retrieval fails.
   */
  async getCustomers(): Promise<AppResponse<ICustomerResponse[]>> {
    try {
      const customers = await this.prisma.customer.findMany({
        where: { deleted_at: null },
        orderBy: { id: 'asc' }
      })

      const convertedCustomers = customers.map((e) => {
        return {
          id: e.id,
          name: e.name,
          address: e.address,
          phone: e.phone
        } as ICustomerResponse
      })

      return getSuccessResponse(convertedCustomers)
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Deletes a customer by their ID.
   *
   * @param {number} id - The ID of the customer to delete.
   * @returns {Promise<AppResponse>} A promise that resolves to a success response if the customer is deleted,
   * or an error response if the customer does not exist or if there is a server error.
   */
  async deleteCustomer(id: number): Promise<AppResponse> {
    try {
      const customer = await this.prisma.customer.findUnique({ where: { id } })
      if (!customer) {
        return getErrorResponse('ERR00000002')
      }

      await this.prisma.customer.update({ where: { id }, data: { deleted_at: new Date() } })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }

  /**
   * Updates an existing customer by their ID.
   *
   * @param {number} id - The ID of the customer to update.
   * @param {ICustomerCreateRequest} requestBody - The data used to update the customer.
   * @returns {Promise<AppResponse>} A promise that resolves to a success response if the customer is updated,
   * or an error response if the phone number already exists or if the customer does not exist.
   */
  async updateCustomer(id: number, requestBody: ICustomerCreateRequest): Promise<AppResponse> {
    try {
      const customer = await this.prisma.customer.findUnique({ where: { id, deleted_at: null } })
      if (!customer) {
        return getErrorResponse('ERR00000002')
      }

      const isExistingPhone = await this.prisma.customer.findFirst({
        where: { phone: requestBody.phone, deleted_at: null, id: { not: id } }
      })

      if (isExistingPhone) {
        return getErrorResponse('ERR00000001')
      }

      await this.prisma.customer.update({
        where: { id },
        data: requestBody
      })

      return getSuccessResponse()
    } catch (error) {
      return getServerErrorResponse(error)
    }
  }
}

export const customerService = new CustomerService()
