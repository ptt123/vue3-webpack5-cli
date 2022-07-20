import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

// 处理路由
export const routerArray: RouteRecordRaw[] = []

const importAll = (r: any) => {
  r.keys().forEach((routerKey: any) => {
    routerArray.push(...r(routerKey).default)
  })
}
// require.context(directory,useSubdirectories,regExp)是webpack的api
// 详见https://webpack.docschina.org/guides/dependency-management/#requirecontext
const routerContext = require.context('./modules/', true, /\./)

// 导入所有的路由
importAll(routerContext)
routerContext.keys().forEach((routerKey: any) => {
  routerArray.push(...routerContext(routerKey).default)
})
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
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
