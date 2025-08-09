import type { ICustomer } from '@renderer/module/customer/customer.type'

export interface IRepairUpdateForm {
  id?: number
  customer?: ICustomer
  basicInfo: IBasicRepairInfo
  payments: IPayment[]
  warranties: IWarranty[]
}

export interface IBasicRepairInfo {
  repair_date?: string
  customer_phone?: string
  description?: string
  cost?: number
  warranty_period?: number
  finish_date?: string
  payment_status?: number
  remaining_cost?: number
}

export interface IPayment {
  key?: string
  id?: number
  payment_date?: string
  payment_method?: number
  payment_amount?: number
}

export interface IWarranty {
  key?: string
  id?: number
  warranty_date?: string
  description?: string
}
