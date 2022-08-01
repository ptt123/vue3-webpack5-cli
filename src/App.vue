<template>
  <div class="app-wrapper">
    <a-button type="primary">Primary Button</a-button>
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <Tabbar />
  </div>
</template>

<script setup lang="ts">
import Tabbar from '@/components/tabbar/index.vue'
console.log('app')
</script>

<style scoped>
@import './assets/base.less';
@import './assets/animation.less';

.app-wrapper {
  width: 100%;
  height: 100vh;
}
</style>
