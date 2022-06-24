import { RouteRecordRaw } from 'vue-router'

// 常用组件模块
const HomeRouter: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/index.vue'),
    meta: {
      title: '首页',
    },
  },
]

export default HomeRouter
