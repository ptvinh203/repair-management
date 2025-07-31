export interface ISelectOption {
  key: string
  value: string | number
}

/**
 * Fetches options by key from the master controller.
 *
 * @param key - The key to fetch options for.
 * @returns A promise that resolves to an array of ISelectOption.
 */
export const getOptionsByKey = async (key: string): Promise<ISelectOption[]> => {
  try {
    const response = await window.masterController.getOptionsByKey(key)

    return response.data ?? []
  } catch {
    return []
  }
}
