import { ipcRenderer } from 'electron/renderer'
import { GET_OPTIONS_BY_KEY_CHANNEL } from './master.event'
import type { AppResponse } from '@preload/common/model/response'

/**
 * MasterController class
 */
export class MasterController {
  static getOptionsByKey(key): Promise<AppResponse> {
    return ipcRenderer.invoke(GET_OPTIONS_BY_KEY_CHANNEL, key)
  }

  static log(level: 'info' | 'warn' | 'error', message: string): void {
    ipcRenderer.send('__ELECTRON_LOG__', {
      data: [`[renderer] ${message}`],
      level: level,
      variables: { processType: 'renderer' }
    })
  }
}
