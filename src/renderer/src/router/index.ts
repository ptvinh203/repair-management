import { createRouter, createWebHistory } from 'vue-router'
import searchRoute from '@renderer/module/search/search.route'
import repairCreateRoute from '@renderer/module/repair/repair-create/repair-create.route'
import customerCreateRoute from '@renderer/module/customer/customer-create/customer-create.route'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main-layout',
    redirect: '/search',
    component: () => import('@renderer/components/layout/MainLayout.vue'),
    children: [searchRoute, repairCreateRoute, customerCreateRoute]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
