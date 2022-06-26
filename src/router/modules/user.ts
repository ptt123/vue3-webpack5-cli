import { RouteRecordRaw } from 'vue-router'

// 常用组件模块
const UserRouter: RouteRecordRaw[] = [
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user.vue'),
    meta: {
      title: '个人中心',
    },
  },
]

export default UserRouter
