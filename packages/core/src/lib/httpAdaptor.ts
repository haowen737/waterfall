import { Server } from 'http'

import Koa from 'koa'


type TServer = Server

export abstract class HttpAdaptor {
  constructor(protected readonly instance: Koa) {}

  public listen(port?: number | undefined, hostname?: string | undefined, backlog?: number | undefined, listeningListener?: (() => void) | undefined) {
    return this.instance.listen(port, hostname, backlog, listeningListener)
  }


  // public getHttpServer(): TServer {
  //   return this.httpServer as TServer;
  // }

  // public setHttpServer(httpServer: TServer) {
  //   this.httpServer = httpServer;
  // }

  public getInstance() {
    return this.instance;
  }

}