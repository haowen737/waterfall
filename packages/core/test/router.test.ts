import http from 'http'

import { expect } from 'chai'
import request from 'supertest'
import Koa from 'koa';

import { KoaRouter } from '../src/lib/router'

describe('router', () => {

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

  // compose middleware with koa

  it('share koa context between routers', (done) => {
    const app = new Koa()
    const router = new KoaRouter()
    router.get('/', (ctx, next) => {
      console.log('ctx', ctx)
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

})