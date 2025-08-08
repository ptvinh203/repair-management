import { ipcRenderer } from 'electron/renderer'
import {
  DELETE_REPAIR_CHANNEL,
  GET_REPAIR_BY_ID_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_REPAIR_CHANNEL
} from './repair.event'
import type { AppResponse } from '@preload/common/model/response'

/**
 * RepairController class
 */
export class RepairController {
  static submitForm(formData): Promise<AppResponse> {
    return ipcRenderer.invoke(SUBMIT_FORM_CHANNEL, formData)
  }

  static getRepairById(id: number): Promise<AppResponse> {
    return ipcRenderer.invoke(GET_REPAIR_BY_ID_CHANNEL, id)
  }

  static updateRepair(id: number, repair): Promise<AppResponse> {
    return ipcRenderer.invoke(UPDATE_REPAIR_CHANNEL, id, repair)
  }

  static deleteRepair(id: number): Promise<AppResponse> {
    return ipcRenderer.invoke(DELETE_REPAIR_CHANNEL, id)
  }
}
