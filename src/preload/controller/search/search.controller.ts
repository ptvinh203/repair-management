import { ipcRenderer } from 'electron'
import { SEARCH_CHANNEL } from './search.event'
import type { AppResponse } from '@preload/common/model/response'
import type { ISearchPayload, ISearchResponse } from './search.type'

/**
 * SearchController class
 */
export class SearchController {
  static async search(payload: ISearchPayload): Promise<AppResponse<ISearchResponse[]>> {
    return ipcRenderer.invoke(SEARCH_CHANNEL, payload)
  }
}
