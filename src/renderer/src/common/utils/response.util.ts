import { showErrorToast, showServerErrorToast } from '@renderer/components/toast'
import {
  getServerErrorResponse,
  type AppResponse
} from './../../../../preload/common/model/response'

/**
 * Handles the response from an API call, checking for errors and returning a structured response.
 *
 * @param {any} response - The response object from the API call.
 * @returns {AppResponse<unknown>} A structured response indicating success or failure.
 */
export const handleResponse = (response: any): AppResponse<unknown> => {
  if (!response || response instanceof Error) {
    showServerErrorToast()

    return getServerErrorResponse()
  }

  if (typeof response === 'object' && 'error' in response) {
    const { code } = (response as AppResponse<unknown>).error || {}

    if (code) {
      showErrorToast(code)
    }
  }

  return response
}
