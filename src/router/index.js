import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import( '../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import( '../views/ContactView.vue')
  },
  {
    path: '/grade',
    name: 'grade',
   
    component: () => import( '../views/Grade.vue')
  },
  {
    path: '/golds',
    name: 'golds',
   
    component: () => import( '../views/Api_golds.vue')
  },
  {
    path: '/product_api',
    name: 'product_api',
   
    component: () => import( '../views/Product_api.vue')
  },
   {
    path: '/product_api',
    name: 'product_api',
   
    component: () => import( '../views/Product_api.vue')
  },
   {
    path: '/product_table',
    name: 'product_table',
   
    component: () => import( '../views/Product_table.vue')
  },
   {
    path: '/user',
    name: 'user',
   
    component: () => import( '../views/Users1.vue')
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
