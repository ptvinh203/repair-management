import type { CustomerController } from './controller/customer/customer.controller'
import type { MasterController } from './controller/master/master.controller'
import type { SearchController } from './controller/search/search.controller'
import type { RepairController } from './controller/repair/repair.controller'

declare global {
  interface Window {
    searchController: typeof SearchController
    customerController: typeof CustomerController
    masterController: typeof MasterController
    repairController: typeof RepairController
  }
}
