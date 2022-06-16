import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../layout/index.vue'

Vue.use(VueRouter)

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    children: [
      {
        path: '/home',
        hidden: true,
        component: RouteView,
        meta: { title: '服务订单' },
        redirect: '/home/index',
        children: [
          {
            path: '/home/index',
            component: RouteView,
            redirect: '/home/index/one',
            meta: { title: '测试自己one' },
            children: [
              {
                path: '/home/index/one',
                component: () => import('@/views/home/index/one'),
                meta: { title: '测试自己one-one' }
              },
              {
                path: '/home/index/two',
                component: () => import('@/views/home/index/two'),
                meta: { title: '测试自己one-two' }
              }
            ]
          },
          {
            path: '/home/two',
            component: () => import('@/views/home/two'),
            meta: { title: '测试自己two' }
          }
        ]
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

const originalPush = VueRouter.prototype.push
// 修改 原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes
})
export { routes }
export default router
