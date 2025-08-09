import { ipcMain } from 'electron/main'
import { EXPORT_EXCEL_CHANNEL, SEARCH_CHANNEL } from './search.event'
import { searchService } from '@preload/service/search/search.service'
import type { ISearchPayload } from './search.type'

export const searchHandler = () => {
  ipcMain.handle(SEARCH_CHANNEL, (_, searchPayload: ISearchPayload) => {
    return searchService.search(searchPayload)
  })

  ipcMain.handle(EXPORT_EXCEL_CHANNEL, (_, searchPayload: ISearchPayload) => {
    return searchService.exportExcel(searchPayload)
  })
}
