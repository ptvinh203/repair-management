import { ipcMainHandler } from '@preload/common/utils/event-channel.utils'
import { customerService } from '@preload/service/customer/customer.service'
import {
  DELETE_CUSTOMERS_CHANNEL,
  GET_CUSTOMERS_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_CUSTOMER_CHANNEL
} from './customer.event'
import type { ICustomerCreateRequest } from './customer.type'

export const customerHandler = () => {
  ipcMainHandler(SUBMIT_FORM_CHANNEL, (formData: ICustomerCreateRequest) => {
    return customerService.createCustomer(formData)
  })

  ipcMainHandler(GET_CUSTOMERS_CHANNEL, () => {
    return customerService.getCustomers()
  })

  ipcMainHandler(DELETE_CUSTOMERS_CHANNEL, (id: number) => {
    return customerService.deleteCustomer(id)
  })

  ipcMainHandler(UPDATE_CUSTOMER_CHANNEL, (id: number, formData: ICustomerCreateRequest) => {
    return customerService.updateCustomer(id, formData)
  })
}
