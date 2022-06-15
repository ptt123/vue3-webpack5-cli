import router, {routes} from "@/router/router"

router.beforeEach((to, from, next) => {
    // 不需要授权的路由直接跳转
    if (!to.matched.some(record => record.meta.needAuth)) return next()
    // 判断是否有token
    const GlobalStore = JSON.parse(localStorage.getItem('GlobalStore') as string)
    const token = GlobalStore?.token

    if (!token) {
        // 没有token,跳转登录页面
        next({
            path: '/login'
        })
        return
    }
    // 服务端返回的路由
    const dynamicRouter: any = routes.map(item => item.path)
    const routerList = dynamicRouter
    if (routerList.indexOf(to.path) !== -1) return next()
    next({
        path: '/403'
    })
})

router.afterEach(() => {
})

export default router
