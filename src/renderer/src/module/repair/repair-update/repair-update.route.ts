import type { RouteRecordRaw } from 'vue-router'

const repairUpdateRoute: RouteRecordRaw = {
  path: '/repair/update/:id',
  name: 'repair-update',
  component: () => import('./repair-update.page.vue')
}

export default repairUpdateRoute
