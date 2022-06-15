import { RouteRecordRaw } from "vue-router"
const Layout = () => import("@/layout/index.vue")

// 常用组件模块
const OrderRouter: RouteRecordRaw[] = [
	{
		path: "/orderList",
		name: 'orderList',
		component: () => import('@/views/orderList.vue'),
		meta: {
			title: "订单列表"
		}
	}
];

export default OrderRouter