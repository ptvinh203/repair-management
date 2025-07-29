import { useCommonStore } from '@renderer/common/store/common.store'

/**
 * Utility type to extract the resolved type of a Promise-returning function.
 * For example: if T is () => Promise<string>, then AwaitedReturn<T> is string.
 */
type AwaitedReturn<T> = T extends (...args: any[]) => Promise<infer R> ? R : never

/**
 * Wraps an asynchronous function with loading state management.
 *
 * Automatically enables a loading state before the function is executed
 * and disables it once the function completes or throws.
 *
 * @template T - A function type that returns a Promise.
 * @param {T} asyncFunc - The asynchronous function to wrap.
 * @param {string} keyLoading - A unique key to identify the loading state in the store.
 * @returns A new function that mirrors `asyncFunc`'s parameters and returns a Promise
 *          of the original resolved type. It automatically handles loading state.
 */
export const withLoading = <T extends (...args: any[]) => Promise<any>>(
  asyncFunc: T,
  keyLoading: string
): ((...args: Parameters<T>) => Promise<AwaitedReturn<T>>) => {
  const commonStore = useCommonStore()

  return async (...args: Parameters<T>): Promise<AwaitedReturn<T>> => {
    try {
      commonStore.enableLoading(keyLoading)

      return await asyncFunc(...args)
    } finally {
      commonStore.disableLoading(keyLoading)
    }
  }
}
