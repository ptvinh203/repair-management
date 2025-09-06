import { ipcMain } from 'electron/main'
import { SUGGEST_CHANNEL } from './suggestion.event'
import { suggestionService } from '@preload/service/suggestion/suggestion.service'

export const suggestionHandler = () => {
  ipcMain.handle(SUGGEST_CHANNEL, (_, type: string, key: string) => {
    return suggestionService.suggest(type, key)
  })
}
