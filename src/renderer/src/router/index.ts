import { createRouter, createWebHistory } from 'vue-router'
import searchRoute from '@renderer/module/search/search.route'
import repairCreateRoute from '@renderer/module/repair/repair-create/repair-create.route'
import customerRoute from '@renderer/module/customer/customer.route'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main-layout',
    redirect: '/search',
    component: () => import('@renderer/components/layout/MainLayout.vue'),
    children: [searchRoute, repairCreateRoute, customerRoute]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
