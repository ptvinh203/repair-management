import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'master'

export const GET_OPTIONS_BY_KEY_CHANNEL = getEventChannel(
  BASE_MODULE,
  'invoke',
  'get-options-by-key'
)
