import { RouteRecordRaw } from "vue-router"
const Layout = () => import("@/layout/index.vue")

// 常用组件模块
const HomeRouter: RouteRecordRaw[] = [
	{
		path: "/home",
		component: () => import('@/views/index.vue'),
		meta: {
			title: "首页"
		}
	}
];

export default HomeRouter
