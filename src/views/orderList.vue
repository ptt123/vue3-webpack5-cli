<template>
    这是订单列表
</template>

<script lang="ts">
export default {
    name: 'OrderList'
}
</script>

<script lang="ts" setup>
import { useOrderStore } from '@/store/modules/order'
const OrderStore = useOrderStore()
OrderStore.$patch((state) => {
    state.toPayTotal = 1
    state.total = 3
})
</script>

<style lang="less" scoped></style>