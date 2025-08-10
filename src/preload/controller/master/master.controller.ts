import { ipcRenderer } from 'electron/renderer'

import type { AppResponse } from '@preload/common/model/response'
import { GET_OPTIONS_BY_KEY_CHANNEL } from './master.event'

/**
 * MasterController class
 */
export class MasterController {
  static getOptionsByKey(key): Promise<AppResponse> {
    return ipcRenderer.invoke(GET_OPTIONS_BY_KEY_CHANNEL, key)
  }
}
