import { ipcMain } from 'electron'
import { customerCreateService } from '@preload/service/customer/customer-create.service'
import { SUBMIT_FORM_CHANNEL } from './customer-create.event'
import type { ICustomerCreateRequest } from './customer-create.type'

export const customerCreateHandler = () => {
  ipcMain.handle(SUBMIT_FORM_CHANNEL, (_, formData: ICustomerCreateRequest) => {
    return customerCreateService.createCustomer(formData)
  })
}
