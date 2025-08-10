import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'customer'

export const SUBMIT_FORM_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'submit-form')
export const GET_CUSTOMERS_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'get-customers')
export const DELETE_CUSTOMERS_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'delete-customers')
export const UPDATE_CUSTOMER_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'update-customer')
