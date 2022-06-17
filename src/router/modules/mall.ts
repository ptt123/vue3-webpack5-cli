import { RouteRecordRaw } from 'vue-router'

// 常用组件模块
const MallRouter: RouteRecordRaw[] = [
	{
		path: '/mall',
		component: () => import('@/views/mall.vue'),
		meta: {
			title: '商城',
			needAuth: true
		}
	}
]

export default MallRouter
