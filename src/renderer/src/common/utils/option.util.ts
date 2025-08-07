export interface ISelectOption {
  key: string
  value: number
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

/**
 * Fetches the name of an option by its key from an array of options.
 *
 * @param options - The array of options to search through.
 * @param key - The key to search for in the options.
 * @returns The name of the option if found, or an empty string if not found.
 */
export const getOptionNameByCd = (options: ISelectOption[], key: string | number): string => {
  const option = options.find((option) => option.key === key)

  return option?.key ?? ''
}
