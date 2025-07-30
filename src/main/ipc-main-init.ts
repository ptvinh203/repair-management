import { customerHandler } from '@preload/controller/customer/customer.handler'

export const initIpcMainHandlers = () => {
  customerHandler()
}
