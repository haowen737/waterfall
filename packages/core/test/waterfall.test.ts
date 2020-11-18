import http from 'http'

import { expect } from 'chai'
import request from 'supertest'
import Koa from 'koa';

import { HttpAdaptor } from '../src/lib/HttpAdaptor'
import { Waterfall } from '../src/lib/waterfall'
import { Application } from '../src/lib/application'

describe('waterfall', () => {

  it('create waterfall instance', () => {
    const instance = Waterfall.create()
    expect(instance).to.be.instanceOf(Application)
  })

})