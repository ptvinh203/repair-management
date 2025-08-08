export interface ISearchPayload {
  customerNameOrPhone?: string | null
  startDate?: string | null
  endDate?: string | null
  paymentStatus?: number | null
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
