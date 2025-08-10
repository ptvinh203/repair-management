import { ipcRenderer } from 'electron/renderer'
import {
  DELETE_CUSTOMERS_CHANNEL,
  GET_CUSTOMERS_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_CUSTOMER_CHANNEL
} from './customer.event'
import type { AppResponse } from '@preload/common/model/response'
import type { ICustomerResponse } from './customer.type'

/**
 * CustomerController class
 */
export class CustomerController {
  static submitForm(formData): Promise<AppResponse> {
    return ipcRenderer.invoke(SUBMIT_FORM_CHANNEL, formData)
  }

  static getCustomers(): Promise<AppResponse<ICustomerResponse[]>> {
    return ipcRenderer.invoke(GET_CUSTOMERS_CHANNEL)
  }

  static deleteCustomer(id: number): Promise<AppResponse> {
    return ipcRenderer.invoke(DELETE_CUSTOMERS_CHANNEL, id)
  }

  static updateCustomer(id: number, formData): Promise<AppResponse> {
    return ipcRenderer.invoke(UPDATE_CUSTOMER_CHANNEL, id, formData)
  }
}
