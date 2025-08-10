export interface ICustomerCreateRequest {
  name: string
  phone: string
  address: string
}

export interface ICustomerResponse {
  id: number
  name: string
  phone: string
  address: string | null
}
