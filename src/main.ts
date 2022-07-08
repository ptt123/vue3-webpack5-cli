import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import pinia from '@/store/index'
import 'windi.css'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App) // 初始化app

import { Button } from 'ant-design-vue'
// 全局注册ant-design-vue常用的组件
export function setupAntd(app: any) {
  app.use(Button)
}
setupAntd(app)
app.use(router).use(pinia).mount('#app') // 将app挂载到app节点上
