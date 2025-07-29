import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { handleResponse } from '@renderer/common/utils/response.util'
import type { ICustomerForm } from './customer-create.type'

export const useCustomerCreateStore = () => {
  const isSuccess = ref<boolean>(false)

  const resetState = () => {
    isSuccess.value = false
  }

  const createCustomer = withLoading(async (formData: ICustomerForm) => {
    try {
      resetState()
      const response = await window.customerCreateController.submitForm({ ...formData })
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'CUSTOMER_CREATE_FORM')

  return { isSuccess, createCustomer }
}
