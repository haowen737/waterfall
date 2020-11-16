import methods from 'methods'
import { ValuesType } from 'utility-types'

class Layer {}

interface Opts {
  name?: string,
}


type vt = ValuesType<typeof methods>

type MethodsImpl = {
  [key in vt]: any
}

const AAA = typeof wrappedAA()

class KoaRouter extends AAA {

  constructor() {
    
  }

  

  methodHandler(name, path /* , middleware */) => {
    let middleware

    if (typeof path === 'string' || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 2)
    } else {
      middleware = Array.prototype.slice.call(arguments, 1)
      path = name
      name = null
    }
    
    this.register(path, [ m ], middleware, { name })
  }

  register(path: string, methods: string | string[], middleware: () => void, opts?: Opts = {}) {

    // support array of paths
    if (Array.isArray(path)) {
      // path.forEach(function(p) {
      //   router.register.call(router, p, methods, middleware, opts);
      // });

      // return this;
    }

    const route = new Layer(path, methods, middleware, {
      name: opt.name,
    })

    if (this.opts.prefix) {
      route.setPrefix(this.opts.prefix);
    }

    // add parameter middleware
    // TODO: 

    stack.push(route);
  }
}


