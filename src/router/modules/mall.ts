import { RouteRecordRaw } from "vue-router"
const Layout = () => import("@/layout/index.vue")

// 常用组件模块
const MallRouter: RouteRecordRaw[] = [
	{
		path: "/mall",
		component: () => import('@/views/mall.vue'),
		meta: {
			title: "商城",
			needAuth: true
		}
	}
];

export default MallRouter
