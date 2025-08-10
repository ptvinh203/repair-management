import type { RouteRecordRaw } from 'vue-router'

const customerRoute: RouteRecordRaw = {
  path: '/customer',
  name: 'customer-route',
  component: () => import('./customer.page.vue')
}

export default customerRoute
