import Koa from 'koa'

import { HttpAdaptor } from './HttpAdaptor'

export class KoaAdaptor extends HttpAdaptor {
  constructor() {
    super(new Koa())
  }

}