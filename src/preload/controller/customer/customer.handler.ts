import { ipcMain } from 'electron'
import { customerService } from '@preload/service/customer/customer.service'
import {
  DELETE_CUSTOMERS_CHANNEL,
  GET_CUSTOMERS_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_CUSTOMER_CHANNEL
} from './customer.event'
import type { ICustomerCreateRequest } from './customer.type'

export const customerHandler = () => {
  ipcMain.handle(SUBMIT_FORM_CHANNEL, (_, formData: ICustomerCreateRequest) => {
    return customerService.createCustomer(formData)
  })

  ipcMain.handle(GET_CUSTOMERS_CHANNEL, () => {
    return customerService.getCustomers()
  })

  ipcMain.handle(DELETE_CUSTOMERS_CHANNEL, (_, id: number) => {
    return customerService.deleteCustomer(id)
  })

  ipcMain.handle(UPDATE_CUSTOMER_CHANNEL, (_, id: number, formData: ICustomerCreateRequest) => {
    return customerService.updateCustomer(id, formData)
  })
}
