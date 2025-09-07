import { ipcMainHandler } from '@preload/common/utils/event-channel.utils'
import { masterService } from '@preload/service/master.service'
import { GET_OPTIONS_BY_KEY_CHANNEL } from './master.event'

export const masterHandler = () => {
  ipcMainHandler(GET_OPTIONS_BY_KEY_CHANNEL, (key: string) => {
    return masterService.getOptionsByKey(key)
  })
}
