import type { CustomerCreateController } from './controller/customer/customer-create/customer-create.controller'
import type { SearchController } from './controller/search/search.controller'

declare global {
  interface Window {
    searchController: typeof SearchController
    customerCreateController: typeof CustomerCreateController
  }
}
