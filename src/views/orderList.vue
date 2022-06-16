<template>
    这是订单列表
    <button @click="jumpOrderDetail">去订单详情</button>
</template>

<script lang="ts">
export default {
    name: 'OrderList'
}
</script>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import { useOrderStore } from '@/store/modules/order'
const OrderStore = useOrderStore()
const router = useRouter()
OrderStore.$patch((state) => {
    state.toPayTotal = 1
    state.total = 3
})
const jumpOrderDetail = () => {
    router.push({name: 'orderDetail'})
}
</script>

<style lang="less" scoped></style>