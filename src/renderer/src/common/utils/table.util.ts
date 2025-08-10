import type { ITableHeader } from '@renderer/components/table/table.tyle'

/**
 * Get the index table header.
 *
 * @param width - The width of the index column
 * @returns ITableHeader - The index table header object
 */
export const getIndexTableHeader = (width: number = 40): ITableHeader => {
  return {
    label: '#',
    key: 'index',
    width: width,
    align: 'center',
    isSortable: false
  }
}

/**
 * Calculate the index for a given item in a paginated table.
 *
 * @param index - The index of the item in the current page
 * @param page - The current page number
 * @param pageSize - The number of items per page
 * @returns number - The global index of the item across all pages
 */
export const getIndexData = (index: number, page: number, pageSize: number): number => {
  return (page - 1) * pageSize + index + 1
}
