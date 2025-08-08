import { customerHandler } from '@preload/controller/customer/customer.handler'
import { masterHandler } from '@preload/controller/master/master.handler'
import { repairHandler } from '@preload/controller/repair/repair.handler'
import { searchHandler } from '@preload/controller/search/search.handler'

export const initIpcMainHandlers = () => {
  customerHandler()
  masterHandler()
  searchHandler()
  repairHandler()
}
