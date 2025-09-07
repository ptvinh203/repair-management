import { ipcMainHandler } from '@preload/common/utils/event-channel.utils'
import { SUGGEST_CHANNEL } from './suggestion.event'
import { suggestionService } from '@preload/service/suggestion/suggestion.service'

export const suggestionHandler = () => {
  ipcMainHandler(SUGGEST_CHANNEL, (type: string, key: string) => {
    return suggestionService.suggest(type, key)
  })
}
