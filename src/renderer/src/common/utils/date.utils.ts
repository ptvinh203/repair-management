import { format, parse } from 'date-fns'
import { CONSTANTS } from '../constants'

const DATE_FORMAT = CONSTANTS.DATE_FORMAT
type TDateFormat = 'date' | 'datetime-local' | 'time'

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
export const getCurrentDatePicker = (type: TDateFormat = 'date') => {
  switch (type) {
    case 'date':
      return format(new Date(), DATE_FORMAT.DATE_PICKER)
    case 'datetime-local':
      return format(new Date(), DATE_FORMAT.DATETIME_LOCAL)
    case 'time':
      return format(new Date(), DATE_FORMAT.TIME)
    default:
      return format(new Date(), DATE_FORMAT.DATE_PICKER)
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
export const convertDateToPayload = (
  date: Date | string,
  type: TDateFormat = 'date',
  dateFormat?: string
): string | null => {
  if (!date) return null

  let datePayloadFormat: string
  switch (type) {
    case 'date':
      datePayloadFormat = DATE_FORMAT.DATE_PICKER
      break
    case 'datetime-local':
      datePayloadFormat = DATE_FORMAT.DATETIME_LOCAL
      break
    case 'time':
      datePayloadFormat = DATE_FORMAT.TIME
      break
    default:
      datePayloadFormat = DATE_FORMAT.DATE_PICKER
  }

  if (typeof date === 'string') {
    const parsedDate = convertStrToDate(date, dateFormat ?? datePayloadFormat)

    return parsedDate ? convertDateToStr(parsedDate, datePayloadFormat) : null
  }

  return convertDateToStr(date, datePayloadFormat)
}
