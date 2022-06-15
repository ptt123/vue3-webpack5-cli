<template>
    <div  :class="[item.select ?　'selected-tabbar-item' : '', 'tabbar-item']">
        <img :src="item.iconPath"/>
        <div>{{item.text}}</div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    item?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
    item: () => ({})
})
</script>

<style lang="less" scoped>
.tabbar-item { 
    display: grid;
    justify-items: center;
    font-size: 22px;
    img {
        width: 44px;
        height: 44px;
        object-fit: contain;
    }
}
.selected-tabbar-item {
    color: red;
}
</style>

