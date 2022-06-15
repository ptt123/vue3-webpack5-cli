import HttpInstance from '@/api'
export const goodsList = (params: any) => {
    return HttpInstance.request({
      url: 'gateway/pointsMall/goods/goodsListManager',
      method: 'get',
      data: params
    })
  }