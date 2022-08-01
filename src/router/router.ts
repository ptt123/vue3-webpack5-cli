import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 处理路由
export const routerArray: RouteRecordRaw[] = []

// webpack require.context
const importAll = (r: any) => {
  r.keys().forEach((routerKey: any) => {
    routerArray.push(...r(routerKey).default)
  })
}

// vite import
// const importAll = (modules: any) => {
//   for (const path in modules) {
//     routerArray.push(...modules[path].default)
//   }
// }

let routerContext = {}

// vite构建
// @ts-ignore
// routerContext = import.meta.glob('./modules/*.ts', { eager: true })
// webpack构建
// 详见https://webpack.docschina.org/guides/dependency-management/#requirecontext
// @ts-ignore
routerContext = require.context('./modules/', true, /\./)

// 导入所有的路由
importAll(routerContext)

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录页',
      key: 'login',
    },
  },
  ...routerArray,
]
console.log('routes', routes)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
