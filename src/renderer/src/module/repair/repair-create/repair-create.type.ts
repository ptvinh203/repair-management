export interface IRepairCreateForm {
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
}

export interface IPayment {
  key?: string
  payment_date?: string
  payment_method?: number
  payment_amount?: number
}

export interface IWarranty {
  key?: string
  warranty_date?: string
  description?: string
}
