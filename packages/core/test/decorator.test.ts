import { expect } from 'chai';

import { Get, Controller, mapRoute } from '../src/lib/decorator'

describe('http', () => {

  it('should transfer http method', () => {
    @Controller('/hello')
    class HelloController {

      @Get('/foo')
      foo() {
        return true
      }

    }

    const routes = mapRoute(new HelloController())
    const route = routes[0]

    expect(route.route).to.equal('/foo')
    expect(route.method).to.equal('get')
    expect(route.methodName).to.equal('foo')
  })

})