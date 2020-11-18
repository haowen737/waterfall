import { KoaAdaptor } from "./koaAdaptor";

export class Application {
  private isListening: boolean = false
  private koa: KoaAdaptor

  constructor() {
    this.koa = new KoaAdaptor()
    // this.httpAdapter = 
  }

  listen(port: number, ...args: any[]) {
    this.koa.listen(port, ...args);
    this.isListening = true;
    return this.koa
  }

  
}