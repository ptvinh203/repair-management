import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { deepClone, handleResponse } from '@renderer/common/utils/response.util'
import type { IRepairUpdateForm } from './repair-update.type'

export const useRepairUpdateStore = () => {
  const isSuccess = ref<boolean>(false)

  const resetState = () => {
    isSuccess.value = false
  }

  const getRepairById = withLoading(async (id: string) => {
    try {
      resetState()
      const response = await window.repairController.getRepairById(Number(id))

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_UPDATE_FORM')

  const updateRepair = withLoading(async (id: string, repair: IRepairUpdateForm) => {
    try {
      resetState()
      const response = await window.repairController.updateRepair(Number(id), deepClone(repair))
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_UPDATE_FORM')

  return { isSuccess, getRepairById, updateRepair }
}
