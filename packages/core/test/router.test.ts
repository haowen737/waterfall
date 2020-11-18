import http from 'http'

import { expect } from 'chai'
import request from 'supertest'
import Koa from 'koa';

import { KoaRouter } from '../src/lib/router'
import { methods } from '../src/lib/methods'

describe('router', () => {

  it('create koa route', () => {
    const router = new KoaRouter()
    expect(router).to.be.instanceOf(KoaRouter)
  })

  it('access route in all http verb', (done) => {
    const router = new KoaRouter()

    methods.forEach(method => {
      expect(router).to.have.property(method)
    })
    done()
  })

  it('register routes with or without name', () => {
    const router = new KoaRouter()
    router.get('/foo')
    router.post('bar', '/bar')
    expect(router.stack[0].path).to.be.equal('/foo')
    expect(router.stack[1].name).to.be.equal('bar')
    expect(router.stack[1].path).to.be.equal('/bar')
  })

  it('match routes', () => {
    const router = new KoaRouter()
    router.get('/foo')
    const matched = router.match('/foo', 'get')

    expect(matched.path[0].path).to.be.equal('/foo')
  })

  it('compose one middleware for one route', (done) => {
    done()
  })

  it('share koa context between routers', (done) => {
    const app = new Koa()
    const router = new KoaRouter()
    router.get('/', (ctx, next) => {
      ctx.foo = 'foo'
      return next()
    })
    router.get('/', (ctx, next) => {
      ctx.bar = 'bar'
      ctx.body = { foo: ctx.foo, bar: ctx.bar }
      return next()
    })
    app.use(router.routes())
    request(http.createServer(app.callback()))
    .get('/')
    .expect(200)
    .end((err, res) => {
      if (err) return done(err)
      expect(res.body).to.have.property('foo', 'foo')
      expect(res.body).to.have.property('bar', 'bar')
      done()
    })
  })

  it('register route from decorator', () => {
    
  })

})