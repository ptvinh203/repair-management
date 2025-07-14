import type { SearchController } from './controller/search/search.controller'
import type { MasterEventChannel, MasterEventPayloadMapping } from './controller/master/master.type'

export type EventChannel = MasterEventChannel
export type EventPayloadMapping = MasterEventPayloadMapping
export type UnsubscribeFunction = () => void

declare global {
  interface Window {
    searchController: typeof SearchController
  }
}
