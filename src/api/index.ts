import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import configs from '@/config/index'
import { ResultEnum } from '@/enums/httpEnum'
import router from '@/router'

const GlobalStore = JSON.parse(localStorage.getItem('GlobalStore') as string)

const config = {
    baseURL: process.env.NODE_ENV === 'production' ? configs.baseURL.pro : configs.baseURL.dev,
    timeout: configs.timeout,
    withCredentials: true
}

class RequestHttp {
    service: AxiosInstance
    constructor (config: AxiosRequestConfig) {
        // 实例化
        this.service = axios.create(config)
        // 请求拦截器
        this.service.interceptors.request.use((config: AxiosRequestConfig) => { 
            const token = GlobalStore?.token  // 本地缓存
            return {...config, headers: {'authorization': token}}
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        })
        // 响应拦截器
        this.service.interceptors.response.use((response: AxiosResponse) => {
            const {data} = response
            if ([ResultEnum.OVERDUE].includes(data.code)) {
                // 清空所有缓存
                localStorage.clear()
                // 跳转登陆页
                router.replace({
                    path: "/login"
                });
                return Promise.reject(data)
            }
            if (data.code && data.code !== ResultEnum.SUCCESS) {
                return Promise.reject(data)
            }
            return data;
        },
        (error: AxiosError) => {
            const code = error?.response?.status as number
            if ([ResultEnum.UNAUTHORIZED, ResultEnum.OVERDUE].includes(code)) {
                // 跳转登陆页
                router.replace({
                    path: "/login"
                })
            }
            return Promise.reject(error)
        })
    }
    request({
        url,
        method,
        data
    }: any) {        
        return this.service.request({
            url, 
            method,
            [['delete', 'get'].includes(method) ? 'params' : 'data']: data,
        })
    }
}

export default new RequestHttp(config)