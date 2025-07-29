import { ipcRenderer } from 'electron/renderer'
import { SUBMIT_FORM_CHANNEL } from './customer-create.event'
import type { AppResponse } from '@preload/common/model/response'

/**
 * CustomerCreateController class
 */
export class CustomerCreateController {
  static submitForm(formData): Promise<AppResponse> {
    return ipcRenderer.invoke(SUBMIT_FORM_CHANNEL, formData)
  }
}
