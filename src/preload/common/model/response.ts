export interface AppResponse<T = any> {
  success: boolean
  data?: T | null
  error?: ErrorResponse | null
}

export interface ErrorResponse {
  code?: string
  message?: string
  items?: ErrorItems[] | null
}

export interface ErrorItems {
  field: string
  code?: string
  message?: string
}

/**
 * Returns a success response with the provided data.
 *
 * @template T - The type of the data being returned.
 * @param {T | T[] | null} data - The data to be included in the response. Can be a single item, an array, or null.
 * @returns {AppResponse<T>} An object representing a successful response.
 */
export const getSuccessResponse = <T>(data?: T | null): AppResponse<T> => {
  return { success: true, data }
}

/**
 * Returns an error response with the specified error code.
 *
 * @param {string} errCode - The error code representing the specific error.
 * @param {string} [message] - An optional message providing additional error details.
 * @returns {AppResponse<null>} An object representing a failed response.
 */
export const getErrorResponse = (errCode: string, message?: string): AppResponse<null> => {
  return { success: false, error: { code: errCode, message } }
}

/**
 * Returns a server error response with the specified error.
 *
 * @param {unknown} error - The error object representing the specific error.
 * @returns {AppResponse<null>} An object representing a server error response.
 */
export const getServerErrorResponse = (error?: unknown): AppResponse => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'

  return { success: false, error: { code: 'ERR00000000', message } }
}
