import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { handleResponse } from '@renderer/common/utils/response.util'

export const useCustomerStore = () => {
  const isSuccess = ref<boolean>(false)

  const resetState = () => {
    isSuccess.value = false
  }

  const getCustomers = withLoading(async () => {
    try {
      resetState()
      const response = await window.customerController.getCustomers()

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'CUSTOMER_TABLE')

  const deleteCustomer = withLoading(async (id: number) => {
    try {
      resetState()
      const response = await window.customerController.deleteCustomer(id)
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'CUSTOMER_TABLE')

  return { isSuccess, getCustomers, deleteCustomer }
}
