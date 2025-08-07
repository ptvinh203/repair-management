import { format, parse } from 'date-fns'
import { CONSTANTS } from '../constants'

const DATE_FORMAT = CONSTANTS.DATE_FORMAT

/**
 * Returns the default date format based on the user's system language.
 * @returns The default date format as a string.
 */
export const getDefaultDateFormat = (): string => {
  const DEFAULT_FORMAT = DATE_FORMAT.DEFAULT
  const language = navigator.language || 'vi'

  if (language.startsWith('en')) {
    return DEFAULT_FORMAT.EN
  } else if (language.startsWith('vi')) {
    return DEFAULT_FORMAT.VI
  } else if (language.startsWith('ja')) {
    return DEFAULT_FORMAT.JA
  }

  return DEFAULT_FORMAT.VI
}

/**
 * Returns the current date in the specified format.
 * @param type - The type of date to return ('date' for Date object, 'string' for formatted string).
 * @returns The current date as a Date object or a formatted string.
 */
export const getCurrentDate = (
  type: 'date' | 'string' = 'string',
  dateFormat: string = DATE_FORMAT.DATE_PICKER
) => {
  const defaultDate = format(new Date(), dateFormat)

  switch (type) {
    case 'date':
      return new Date()
    case 'string':
      return defaultDate
    default:
      return defaultDate
  }
}

/**
 * Converts a date string to a Date object.
 * @param dateStr - The date string to convert.
 * @param dateFormat - The format of the date string (optional).
 * @returns The converted Date object or null if invalid.
 */
export const convertStrToDate = (dateStr: string, dateFormat?: string): Date | null => {
  try {
    const formatStr = dateFormat ?? getDefaultDateFormat()
    const date = parse(dateStr, formatStr, new Date())

    return isNaN(date.getTime()) ? null : date // Return null if the date is invalid
  } catch {
    return null
  }
}

/**
 * Converts a Date object to a formatted string.
 * @param date - The Date object to convert.
 * @param dateFormat - The format to use for the string (optional).
 * @returns The formatted date string or an empty string if conversion fails.
 */
export const convertDateToStr = (date: Date, dateFormat?: string): string => {
  try {
    const formatStr = dateFormat ?? getDefaultDateFormat()

    return format(date, formatStr)
  } catch {
    return ''
  }
}

/**
 * Converts a date to a payload format string.
 * @param date - The date to convert (can be a Date object or a string).
 * @param dateFormat - The format of the input date string (optional).
 * @returns The formatted date string in payload format or null if conversion fails.
 */
export const convertDateToPayload = (date: Date | string, dateFormat?: string): string | null => {
  if (!date) return null

  if (typeof date === 'string') {
    const parsedDate = convertStrToDate(date, dateFormat)

    return parsedDate ? convertDateToStr(parsedDate, DATE_FORMAT.PAYLOAD) : null
  }

  return convertDateToStr(date, DATE_FORMAT.PAYLOAD)
}
