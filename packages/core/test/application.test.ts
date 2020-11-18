import http from 'http'

import { expect } from 'chai'
import request from 'supertest'
import Koa from 'koa';

import { HttpAdaptor } from '../src/lib/HttpAdaptor'
import { KoaAdaptor } from '../src/lib/koaAdaptor'

describe('application', () => {

  it('create ', () => {
    const instance = new KoaAdaptor()
    expect(instance.getInstance()).to.be.instanceOf(Koa)
  })

  // it(' ', () => {
  //   const instance = new KoaAdaptor()

  //   expect(instance.listen()).to.be.instanceOf(Koa)
  // })


})