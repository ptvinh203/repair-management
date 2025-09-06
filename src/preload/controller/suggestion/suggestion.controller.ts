import { ipcRenderer } from 'electron'
import type { AppResponse } from '@preload/common/model/response'
import type { ISuggestion } from './suggestion.type'
import { SUGGEST_CHANNEL } from './suggestion.event'

/**
 * SuggestionController class
 */
export class SuggestionController {
  static async suggest(type: string, key: string): Promise<AppResponse<ISuggestion[]>> {
    return ipcRenderer.invoke(SUGGEST_CHANNEL, type, key)
  }
}
