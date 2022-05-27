import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home'),
        meta: { title: '服务订单' }
      },
      {
        path: '/salary',
        component: () => import('@/views/Salart'),
        meta: { title: '工资统计' }
      },
      {
        path: '/clocking',
        component: () => import('@/views/Clocking'),
        meta: { title: '考勤管理' }
      },
      {
        path: '/money',
        component: () => import('@/views/Money'),
        meta: { title: '钱箱记录' }
      },
      {
        path: '/shop',
        component: () => import('@/views/Shop'),
        meta: { title: '店长管理' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login')
  }
]

const router = new VueRouter({
  routes
})
export { routes }
export default router
