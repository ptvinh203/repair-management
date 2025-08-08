import { ipcMain } from 'electron'
import { repairService } from '@preload/service/repair/repair.service'
import {
  DELETE_REPAIR_CHANNEL,
  GET_REPAIR_BY_ID_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_REPAIR_CHANNEL
} from './repair.event'
import type { IRepairCreateForm, IRepairUpdateForm } from './repair.type'

export const repairHandler = () => {
  ipcMain.handle(SUBMIT_FORM_CHANNEL, (_, formData: IRepairCreateForm) => {
    return repairService.createRepair(formData)
  })

  ipcMain.handle(GET_REPAIR_BY_ID_CHANNEL, (_, id: number) => {
    return repairService.getRepairById(id)
  })

  ipcMain.handle(UPDATE_REPAIR_CHANNEL, (_, id: number, repair: IRepairUpdateForm) => {
    return repairService.updateRepair(id, repair)
  })

  ipcMain.handle(DELETE_REPAIR_CHANNEL, (_, id: number) => {
    return repairService.deleteRepair(id)
  })
}
