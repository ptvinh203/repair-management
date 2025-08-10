export type TTableAlign = 'start' | 'end' | 'center'

export type TTableSortDirection = 'asc' | 'desc' | null

export interface ITableHeader {
  label: string
  key: string
  width?: number
  align?: TTableAlign
  isSortable?: boolean
  isSticky?: boolean
}

export interface ITableData {
  [key: string]: any
}
