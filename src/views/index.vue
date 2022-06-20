<template>
  <div class="index-wrapper">这是首页</div>
</template>
<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import { goodsList } from '@/api/modules/goods'
const getGoods = async () => {
  await goodsList({})
}
getGoods()
</script>
<style scoped lang="less">
@import '../assets/var.less';
.index-wrapper {
  width: 100%;
  height: 3000px;
  background-color: rgb(190, 146, 231);
}
</style>
