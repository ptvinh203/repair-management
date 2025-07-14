import { useCommonStore } from '@renderer/common/store/common.store'

export const withLoading = <T>(asyncFunc: () => Promise<T>, keyLoading: string) => {
  const commonStore = useCommonStore()

  return async (): Promise<T> => {
    try {
      commonStore.enableLoading(keyLoading)

      return await asyncFunc()
    } finally {
      commonStore.disableLoading(keyLoading)
    }
  }
}
