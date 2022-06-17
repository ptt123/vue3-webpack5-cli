<template>
	<div class="safe-bottom tabbar-bottom">
		<template v-for="(item, idx) in computedTabbar" :key="idx">
			<TabbarItem :item="item" @click="handleClick(idx)" />
		</template>
	</div>
</template>

<script lang="ts">
export default {
	name: 'Tabbar',
}
</script>
<script lang="ts" setup>
import TabbarItem from '@/components/tabbar-item/index.vue'
import { reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useOrderStore } from "@/store/modules/order"
// const orderStore = useOrderStore()

const rotuer = useRouter()
const route = useRoute()

const tabbar: Array<Tabbar> = reactive([
	{
		iconPath: require('../../assets/images/logo.png'),
		text: '首页',
		path: '/home',
	},
	{
		iconPath: require('../../assets/images/address.png'),
		text: '商城',
		path: '/mall',
	},
	{
		iconPath: require('../../assets/images/logo.png'),
		text: '我的',
		path: '/user',
	},
])
const computedTabbar = computed(() => {
	const tabbarCopy = [...tabbar]
	tabbarCopy.forEach((item) => {
		item.select = route.path == item.path
	})
	return tabbarCopy
})
const handleClick = (idx: number) => {
	tabbar.forEach((item, index) => {
		item.select = false
		if (idx === index) {
			item.select = true
			rotuer.push({ path: item.path })
		}
	})
}
</script>
<style lang="less" scoped>
.tabbar-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100px;
	display: grid;
	grid-template-columns: repeat(3, 100px);
	justify-content: space-around;
	justify-items: center;
	align-items: center;
}
</style>
