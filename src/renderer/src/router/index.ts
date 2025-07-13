import { createRouter, createWebHistory } from 'vue-router'
import searchRoute from '@renderer/module/search/search.route'
import repairCreateRoute from '@renderer/module/repair/repair-create/repair-create.route'
import customerCreateRoute from '@renderer/module/customer/customer-create/customer-create.route'

const routes = [
  {
    path: '/',
    redirect: '/search'
  },
  searchRoute,
  repairCreateRoute,
  customerCreateRoute
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
