import { withLoading } from '@renderer/common/utils/loading.util'
import { handleResponse } from '@renderer/common/utils/response.util'
import type { ISearchPayload } from './search.type'

export const useSearchStore = () => {
  const handleSearch = withLoading(async (payload: ISearchPayload) => {
    try {
      const response = await window.searchController.search(payload)

      return handleResponse(response)
    } catch (error) {
      return handleResponse(error)
    }
  }, 'REPAIR_SEARCH_RESULT')

  return { handleSearch }
}
