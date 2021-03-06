import { RouteRecordRaw } from 'vue-router'

// 常用组件模块
const OrderRouter: RouteRecordRaw[] = [
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import(/* webpackChunkName: "orderList" */ '@/views/orderList.vue'),
    meta: {
      title: '订单列表',
    },
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: () => import(/* webpackChunkName: "orderDetail" */ '@/views/orderDetail.vue'),
    meta: {
      title: '订单详情',
    },
  },
]

export default OrderRouter
