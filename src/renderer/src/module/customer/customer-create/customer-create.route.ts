import { RouteRecordRaw } from 'vue-router'

const customerCreateRoute: RouteRecordRaw = {
  path: '/customer/create',
  name: 'customer-create-route',
  component: () => import('./customer-create.page.vue')
}

export default customerCreateRoute
