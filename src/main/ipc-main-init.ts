import { customerHandler } from '@preload/controller/customer/customer.handler'
import { masterHandler } from '@preload/controller/master/master.handler'

export const initIpcMainHandlers = () => {
  customerHandler()
  masterHandler()
}
