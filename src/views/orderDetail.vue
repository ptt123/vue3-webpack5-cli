<template>这是订单详情</template>
<script lang="ts">
export default {
	name: 'OrderDetail',
}
</script>
<script lang="ts" setup>
import { useOrderStore } from '@/store/modules/order'
const orderStore = useOrderStore()
orderStore.$patch((state) => {
	state.toPayTotal = 20
	state.total = 30
})
</script>
<style lang="less" scoped></style>
