import type { CustomerController } from './controller/customer/customer.controller'
import type { MasterController } from './controller/master/master.controller'
import type { SearchController } from './controller/search/search.controller'
import type { RepairController } from './controller/repair/repair.controller'

type ExtractedStaticMethods<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K]
}

declare global {
  interface Window {
    searchController: ExtractedStaticMethods<typeof SearchController>
    customerController: ExtractedStaticMethods<typeof CustomerController>
    masterController: ExtractedStaticMethods<typeof MasterController>
    repairController: ExtractedStaticMethods<typeof RepairController>
  }
}
