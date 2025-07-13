export interface ErrorResponse {
  message?: string
  items?: ErrorItems[]
}

export interface ErrorItems {
  field: string
  message: string
}

/**
 * Creates an ErrorResponse object.
 *
 * @param msg Optional message for the error response
 * @param items Optional array of error items
 * @returns ErrorResponse object containing the message and items
 */
export const getErrorResponse = (msg?: string, items?: ErrorItems[]): ErrorResponse => {
  return {
    message: msg,
    items: items
  }
}
