import { EXPORT_EXCEL_CHANNEL, SEARCH_CHANNEL } from './search.event'
import { searchService } from '@preload/service/search/search.service'
import { ipcMainHandler } from '@preload/common/utils/event-channel.utils'
import type { ISearchPayload } from './search.type'

export const searchHandler = () => {
  ipcMainHandler(SEARCH_CHANNEL, (searchPayload: ISearchPayload) => {
    return searchService.search(searchPayload)
  })

  ipcMainHandler(EXPORT_EXCEL_CHANNEL, (searchPayload: ISearchPayload) => {
    return searchService.exportExcel(searchPayload)
  })
}
