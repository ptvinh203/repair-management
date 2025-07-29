import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'customer-create'

export const SUBMIT_FORM_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'submit-form')
