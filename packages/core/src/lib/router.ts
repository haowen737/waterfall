import http from 'http'

import httpMethods from 'methods'
import compose from 'koa-compose'
import { pathToRegexp, match, parse, compile } from 'path-to-regexp'
import { ValuesType } from 'utility-types'
import { Context, Next, Middleware, ParameterizedContext } from 'koa'

interface Opts {
  name?: string | null,
  prefix?: string
  routerPath?: string
}

class Layer {
  path: string
  name: string | null
  opts: Opts
  middleware: unknown[]
  regexp: RegExp
  methods: unknown[] = []
  paramNames: [] = []
  // this.stack = Array.isArray(middleware) ? middleware : [middleware];
  stack: unknown[]


  constructor(path: string, methods: string[], middleware: unknown[], opts: Opts) {
    this.path = path
    this.opts = opts
    this.name = this.opts.name || null
    this.opts = opts
    this.middleware = middleware
    this.methods = []
    this.regexp = pathToRegexp(path, this.paramNames)
    this.stack = Array.isArray(middleware) ? middleware : [middleware]

    methods.forEach(method => {
      this.methods.push(method.toUpperCase())
    })
  }

  match(path: string): boolean {
    return this.regexp.test(path)
  }

}

type typeHttpMethods = ValuesType<typeof httpMethods>
// interface HttpRouter {
//   get() {}

//   post() {}
// }

// TODO: is httprouter necessary ?

export class KoaRouter {

  stack: Layer[] = []
  opts: Opts = {}
  
  constructor(opts: Opts = {}) {

    this.opts = opts

    // FIXME: handwrite all possible http method
    // httpMethods.forEach()
  }

  post = this.basicMethodHandle('post')
  get = this.basicMethodHandle('get')
  put = this.basicMethodHandle('put')
  delete = this.basicMethodHandle('delete')

  basicMethodHandle (method: string) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const router = this

    function invarant(name: string | null): void
    function invarant(name: string | null, path?: string | Middleware): void
    function invarant(name: string | null, path?: string | Middleware) {
      let middleware

      if (typeof path === 'string' || (path as unknown as RegExp) instanceof RegExp) {
        // eslint-disable-next-line prefer-rest-params
        middleware = Array.prototype.slice.call(arguments, 2)
      } else {
        // eslint-disable-next-line prefer-rest-params
        middleware = Array.prototype.slice.call(arguments, 1)
        path = name as string
        name = null
      }
      
      router.register(path as string, [ method ], middleware, { name })
    }

    return invarant
  }


  register(path: string, methods: string[], middleware: unknown[], opts: Opts = {}) {

    // support array of paths
    if (Array.isArray(path)) {
      // path.forEach(function(p) {
      //   router.register.call(router, p, methods, middleware, opts);
      // });

      // return this;
    }

    const route = new Layer(path, methods, middleware, {
      name: opts.name,
    })

    // if (this.opts.prefix) {
    //   route.setPrefix(this.opts.prefix);
    // }

    // add parameter middleware
    // TODO: 

    this.stack.push(route);
  }

  match(path: string, method: string) {
    const matched: {path: Layer[], pathAndMethod: Layer[], route: boolean} = {
      path: [], pathAndMethod: [], route: false
    }
    const layers = this.stack

    for (let i = 0; i < layers.length; i++) {
      const currentLayer = layers[i]
      if (currentLayer.match(path)) {
        matched.path.push(currentLayer)

        if (currentLayer.methods.length === 0 || ~currentLayer.methods.indexOf(method)) {
          matched.pathAndMethod.push(currentLayer)
          if (currentLayer.methods.length) matched.route = true
        }
      }
    }

    return matched
  }

  routes() {
    const dispatch = (ctx: Context, next: Next) => {
      const path = this.opts.routerPath || ctx.routerPath || ctx.path
      const matched = this.match(path, ctx.method)

      if (!matched.route) return next()// !!methods.length == true; is route

      const matchedLayers = matched.pathAndMethod

      const layerChain = matchedLayers.reduce((acc: unknown[], currrentLayer: Layer) => {
        acc.push((ctx: Context, next: Next) => {
          ctx.routerName = currrentLayer.name
          return next()
        })
        return acc.concat(currrentLayer.stack)
      }, [])

      return compose(layerChain as Middleware<unknown>[])(ctx, next)
    }

    return dispatch
  }
}


