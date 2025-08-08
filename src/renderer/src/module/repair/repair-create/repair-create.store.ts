import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { deepClone, handleResponse } from '@renderer/common/utils/response.util'
import type { IRepairCreateForm } from './repair-create.type'

export const useRepairStore = () => {
  const isSuccess = ref<boolean>(false)

  const resetState = () => {
    isSuccess.value = false
  }

  const createRepair = withLoading(async (formData: IRepairCreateForm) => {
    try {
      resetState()
      const response = await window.repairController.submitForm(deepClone(formData))
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_CREATE_FORM')

  return { isSuccess, createRepair }
}
