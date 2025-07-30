import type { CustomerController } from './controller/customer/customer.controller'
import type { SearchController } from './controller/search/search.controller'

declare global {
  interface Window {
    searchController: typeof SearchController
    customerController: typeof CustomerController
  }
}
