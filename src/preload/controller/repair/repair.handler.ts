import { ipcMainHandler } from '@preload/common/utils/event-channel.utils'
import { repairService } from '@preload/service/repair/repair.service'
import {
  DELETE_REPAIR_CHANNEL,
  GET_REPAIR_BY_ID_CHANNEL,
  SUBMIT_FORM_CHANNEL,
  UPDATE_REPAIR_CHANNEL
} from './repair.event'
import type { IRepairCreateForm, IRepairUpdateForm } from './repair.type'

export const repairHandler = () => {
  ipcMainHandler(SUBMIT_FORM_CHANNEL, (formData: IRepairCreateForm) => {
    return repairService.createRepair(formData)
  })

  ipcMainHandler(GET_REPAIR_BY_ID_CHANNEL, (id: number) => {
    return repairService.getRepairById(id)
  })

  ipcMainHandler(UPDATE_REPAIR_CHANNEL, (id: number, repair: IRepairUpdateForm) => {
    return repairService.updateRepair(id, repair)
  })

  ipcMainHandler(DELETE_REPAIR_CHANNEL, (id: number) => {
    return repairService.deleteRepair(id)
  })
}
