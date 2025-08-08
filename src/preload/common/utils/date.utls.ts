import { format, parse } from 'date-fns'

type TDateFormat = 'date' | 'datetime-local' | 'time'

const getDateFormatByType = (type: TDateFormat, isResponse: boolean = false): string => {
  switch (type) {
    case 'date':
      return isResponse ? 'dd/MM/yyyy' : 'yyyy-MM-dd'
    case 'datetime-local':
      return isResponse ? 'dd/MM/yyyy HH:mm:ss' : "yyyy-MM-dd'T'HH:mm"
    case 'time':
      return 'HH:mm:ss'
    default:
      return 'dd/MM/yyyy'
  }
}

/**
 * Converts a date string in the format 'dd/MM/yyyy' to a Date object.
 * @param payload - The date string to convert.
 * @returns A Date object representing the input date.
 */
export const convertPayloadToDate = (payload: string, type: TDateFormat = 'date'): Date => {
  return parse(payload, getDateFormatByType(type), new Date())
}

/**
 * Converts a Date object to a string in the format 'dd/MM/yyyy HH:mm:ss'.
 * @param date - The Date object to convert.
 * @returns A string representing the date in the specified format.
 */
export const convertDateToResponse = (
  date?: Date | null,
  type: TDateFormat = 'datetime-local'
): string => {
  if (!date) {
    return ''
  }

  return format(date, getDateFormatByType(type, true))
}

/**
 * Converts a Date object to a string in the format 'yyyy-MM-dd' or 'yyyy-MM-ddTHH:mm'.
 * @param date - The Date object to convert.
 * @param type - The format type, either 'date' or 'datetime-local'.
 * @returns A string representing the date in the specified format.
 */
export const convertDateToPayload = (
  date?: Date | null,
  type: TDateFormat = 'datetime-local'
): string => {
  if (!date) {
    return ''
  }

  return format(date, getDateFormatByType(type))
}
