import { createRouter, createWebHashHistory } from 'vue-router'
import searchRoute from '@renderer/module/search/search.route'
import repairCreateRoute from '@renderer/module/repair/repair-create/repair-create.route'
import customerRoute from '@renderer/module/customer/customer.route'
import repairUpdateRoute from '@renderer/module/repair/repair-update/repair-update.route'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main-layout',
    redirect: '/search',
    component: () => import('@renderer/components/layout/MainLayout.vue'),
    children: [searchRoute, repairCreateRoute, customerRoute, repairUpdateRoute]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
