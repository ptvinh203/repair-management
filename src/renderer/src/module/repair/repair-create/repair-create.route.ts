import type { RouteRecordRaw } from 'vue-router'

const repairCreateRoute: RouteRecordRaw = {
  path: '/repair/create',
  name: 'repair-create-route',
  component: () => import('./repair-create.page.vue')
}

export default repairCreateRoute
