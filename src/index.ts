import KoaRouter = require("koa-router")
import KoaApp = require("koa")

export class Router<StateT = {}, CustomT = {}> extends KoaRouter<StateT, CustomT> {
    /**
     * @param enableNotAllowedMethodsHandler If `true`, register `allowedMethods()` handler after `routes()` handler. default `false`.
     */
    useRouter(path: string, router: Router, enableNotAllowedMethodsHandler = false) {
        if (enableNotAllowedMethodsHandler) {
            this.use(path, router.routes(), router.allowedMethods())
        } else {
            this.use(path, router.routes())
        }
    }
}

export class App<StateT = any, CustomT = {}> extends Router<StateT, CustomT> {
    koa = new KoaApp()
    alreadyRegisteredToKoaApp = false

    registerRoutesToKoa(ignoreIfAlreadyRegistered = false) {
        if (this.alreadyRegisteredToKoaApp) {
            if (ignoreIfAlreadyRegistered) return
            throw new Error("already registered to koa app")
        }
        this.alreadyRegisteredToKoaApp = true
        this.koa.use(this.routes())
    }

    listen(...args: Parameters<KoaApp["listen"]>): ReturnType<KoaApp["listen"]> {
        this.registerRoutesToKoa(true)
        return this.koa.listen(...args)
    }
}