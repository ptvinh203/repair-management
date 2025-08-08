import { showErrorToast, showServerErrorToast } from '@renderer/components/toast'
import {
  getServerErrorResponse,
  type AppResponse
} from './../../../../preload/common/model/response'

/**
 * Handles the response from an API call, checking for errors and returning a structured response.
 *
 * @param {any} response - The response object from the API call.
 * @returns {any} A structured response indicating success or failure.
 */
export const handleResponse = (response: any): any => {
  if (!response || response instanceof Error) {
    showServerErrorToast()

    return getServerErrorResponse()
  }

  if (typeof response === 'object' && 'error' in response) {
    const { code } = (response as AppResponse).error || {}

    if (code) {
      showErrorToast(code)
    }
  }

  return response.data
}

/**
 * Deep clones an object using JSON serialization.
 * This is a simple way to create a deep copy of an object.
 *
 * @param {T} obj - The object to clone.
 * @returns {T} A deep clone of the original object.
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T
}
