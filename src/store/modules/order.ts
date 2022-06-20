import { defineStore } from 'pinia'
import pinia from '@/store'
import piniaPersistConfig from '@/config/piniaPersist'

// OrderState
export const useOrderStore = defineStore({
  id: 'OrderStore',
  state: () => ({
    total: '' as number | string, // 订单总数
    toPayTotal: '' as number | string, // 待支付订单总数
  }),
  getters: {},
  actions: {
    setTotal(total: number | string) {
      this.total = total
    },
    setToPayTotal(toPayTotal: number | string) {
      this.toPayTotal = toPayTotal
    },
  },
  persist: piniaPersistConfig('OrderStore'),
})

// Using the store outside of setup()
export const useOrderStoreWithOut = () => {
  return useOrderStore(pinia)
}
