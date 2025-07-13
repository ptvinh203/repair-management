import AbstractService from '@preload/service/abstract.service'
import { Customer } from '@prisma/client'

class CustomerService extends AbstractService {
  public async getCustomerById(customerId: number): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`)
    }

    return customer
  }
}

export const customerService = new CustomerService()
