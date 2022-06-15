import {createPinia, defineStore} from 'pinia'
// 数据持久化plugins
import piniaPersist from 'pinia-plugin-persist'
import piniaPersistConfig from '@/config/piniaPersist'
import {getUsers} from '@/api/modules/app'

// defineStore返回一个函数，调用该函数获得Store实体
export const useGlobalStore = defineStore({
    id: 'GlobalStore',
    // 返回对象的函数
    state: () => ({
        token: '',
        userId: '',
        userInfo: ''
    }),
    getters: {},
    actions: {
        setUserId (userId: string) {
            this.userId = userId
        },
        setToken (token: string) {
            this.token = token
        },
        async setUserInfo () {
            const res = await getUsers({userIds: this.userId})
            this.userInfo = res.data[0]
        }
    },
    // 不想所有数据都持久化处理，能不能按需持久化所需数据？配置paths参数
    persist: piniaPersistConfig('GlobalStore')
    
})

const pinia = createPinia()
pinia.use(piniaPersist)

// Using the store outside of setup()
export const useGlobalStoreWithOut = () => {
    return useGlobalStore(pinia)
}

export default pinia