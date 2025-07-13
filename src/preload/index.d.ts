import { MasterEventPayloadMapping } from '@preload/controller/master/master.type'

export type EventChannel = MasterEventChannel
export type EventPayloadMapping = MasterEventPayloadMapping

declare global {
  interface Window {}
}
