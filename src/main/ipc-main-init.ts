import { customerCreateHandler } from '@preload/controller/customer/customer-create/customer-create.handler'

export const initIpcMainHandlers = () => {
  customerCreateHandler()
}
