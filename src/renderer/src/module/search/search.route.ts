import type { RouteRecordRaw } from 'vue-router'

const searchRoute: RouteRecordRaw = {
  path: '/search',
  name: 'search',
  component: () => import('./search.page.vue')
}

export default searchRoute
