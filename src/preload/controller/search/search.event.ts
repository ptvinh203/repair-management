import { getEventChannel } from '@preload/common/utils/event-channel.utils'

export const BASE_MODULE = 'search'

export const SEARCH_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'search')
export const EXPORT_EXCEL_CHANNEL = getEventChannel(BASE_MODULE, 'invoke', 'export-excel')
