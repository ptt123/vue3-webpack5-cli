<template>
    <div class="user-wrapper">
        <button @click="handleJump('orderList')">我的订单</button>
    </div>
</template>
<script lang="ts">
export default {
    name: 'user'
}
</script>
<script setup lang="ts">
import {useRouter} from 'vue-router'
const rotuer = useRouter()

const handleJump = (routerName: string) => {
    rotuer.push({name: routerName})
}
</script>
<style lang="less" scoped>
    .user-wrapper {
        width: 100%;
        height: 1000px;
        background-color: #fff;
    }
</style>
