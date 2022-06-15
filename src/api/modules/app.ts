import HttpInstance from '@/api'
export const getUsers = (params: any) => {
    return HttpInstance.request({
      url: 'gateway/user/getUsers',
      method: 'get',
      data: params
    })
  }