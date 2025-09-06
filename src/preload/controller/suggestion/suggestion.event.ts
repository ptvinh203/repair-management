import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'suggestion'

export const SUGGEST_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'suggest')
