<template>
  这是登录页
  <button @click="login">登录</button>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/store'
const GlobalStore = useGlobalStore()
// 初始化，自动登录
const login = () => {
  GlobalStore.setToken('token')
  GlobalStore.setUserId('userid')
  GlobalStore.setUserInfo()
}

console.log('我是登录页面')
</script>
<style lang="less" scoped></style>
