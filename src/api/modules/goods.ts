import HttpInstance from '@/api'
export const goodsList = (params: unknown) => {
  return HttpInstance.request({
    url: 'gateway/pointsMall/goods/goodsListManager',
    method: 'get',
    data: params,
  })
}
