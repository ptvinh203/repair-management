import { withLoading } from '@renderer/common/utils/loading.util'

export const useSearchStore = () => {
  const handleSearch = withLoading(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }, 'REPAIR_SEARCH_RESULT')

  return { handleSearch }
}
