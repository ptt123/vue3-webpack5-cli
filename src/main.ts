import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import pinia from '@/store/index'
const app = createApp(App) // 初始化app
app.use(router).use(pinia).mount('#app') // 将app挂载到app节点上
