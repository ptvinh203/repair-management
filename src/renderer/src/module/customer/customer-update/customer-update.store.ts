import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { handleResponse } from '@renderer/common/utils/response.util'
import type { ICustomerForm } from './customer-update.type'

export const useCustomerUpdateStore = () => {
  const isSuccess = ref<boolean>(false)

  const resetState = () => {
    isSuccess.value = false
  }

  const updateCustomer = withLoading(async (id: number, formData: ICustomerForm) => {
    try {
      resetState()
      const response = await window.customerController.updateCustomer(id, { ...formData })
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'CUSTOMER_UPDATE_FORM')

  return { isSuccess, updateCustomer }
}
