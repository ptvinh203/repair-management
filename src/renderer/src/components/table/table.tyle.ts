export type TTableAlign = 'left' | 'right' | 'center'

export type TTableSortDirection = 'asc' | 'desc' | null

export interface ITableHeader {
  label: string
  key: string
  sortable?: boolean
  width?: number
  align?: TTableAlign
  sticky?: boolean
}

export interface ITableData {
  [key: string]: any
}
