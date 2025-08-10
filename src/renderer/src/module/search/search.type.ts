export interface ISearchPayload {
  customerNameOrPhone?: string
  startDate?: string
  endDate?: string
  paymentStatus?: number
}

export interface ISearchResponse {
  id: number
  repair_date: string
  repair_description: string
  customer: string
  repair_cost: number
  payment_status: number
  warranty_status: number
}
