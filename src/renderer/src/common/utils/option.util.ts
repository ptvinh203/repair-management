export interface ISelectOption {
  key: string
  value: number
  extra_1?: string | null
  extra_2?: string | null
  extra_3?: string | null
  extra_4?: string | null
  extra_5?: string | null
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
 * @param cd - The cd to search for in the options.
 * @returns The name of the option if found, or an empty string if not found.
 */
export const getOptionNameByCd = (options: ISelectOption[], cd: number): string => {
  const option = options.find((option) => Number(option.value) === Number(cd))

  return option?.key ?? ''
}

/**
 * Fetches the extra field of an option by its code and extra index.
 *
 * @param options - The array of options to search through.
 * @param cd - The code of the option to search for.
 * @param extraIndex - The index of the extra field to retrieve (1-5).
 * @returns The value of the extra field if found, or null if not found.
 */
export const getExtraByCd = (
  options: ISelectOption[],
  cd: number,
  extraIndex: number
): string | null => {
  const option = options.find((option) => Number(option.value) === Number(cd))

  if (!option) {
    return null
  }

  return option[`extra_${extraIndex}`] ?? null
}
