import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'repair'

export const SUBMIT_FORM_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'submit-form')
export const GET_REPAIR_BY_ID_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'get-repair-by-id')
export const UPDATE_REPAIR_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'update-repair')
export const DELETE_REPAIR_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'delete-repair')
