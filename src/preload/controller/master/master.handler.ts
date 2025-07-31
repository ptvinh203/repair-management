import { ipcMain } from 'electron'
import { masterService } from '@preload/service/master.service'
import { GET_OPTIONS_BY_KEY_CHANNEL } from './master.event'

export const masterHandler = () => {
  ipcMain.handle(GET_OPTIONS_BY_KEY_CHANNEL, (_, key: string) => {
    return masterService.getOptionsByKey(key)
  })
}
