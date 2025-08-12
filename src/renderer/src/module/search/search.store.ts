import { ref } from 'vue'
import { withLoading } from '@renderer/common/utils/loading.util'
import { handleResponse } from '@renderer/common/utils/response.util'
import type { ISearchPayload, ISearchResponse } from './search.type'

export const useSearchStore = () => {
  const isSuccess = ref<boolean>(false)
  const searchResponse = ref<ISearchResponse[]>([])

  const resetState = () => {
    isSuccess.value = false
  }

  const handleSearch = withLoading(async (payload: ISearchPayload) => {
    try {
      const response = await window.searchController.search({ ...payload })
      searchResponse.value = response.data || []

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_SEARCH_RESULT')

  const deleteRepair = withLoading(async (id: number) => {
    try {
      resetState()
      const response = await window.repairController.deleteRepair(Number(id))
      isSuccess.value = response.success

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_SEARCH_RESULT')

  const exportExcel = withLoading(async (payload: ISearchPayload) => {
    try {
      const response = await window.searchController.exportExcel({ ...payload })

      return handleResponse(response, true)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_SEARCH_RESULT')

  return { isSuccess, searchResponse, handleSearch, deleteRepair, exportExcel }
}
