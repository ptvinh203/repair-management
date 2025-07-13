import { RouteRecordRaw } from 'vue-router'

const searchRoute: RouteRecordRaw = {
  path: '/search',
  name: 'search-route',
  component: () => import('./search.page.vue')
}

export default searchRoute
