/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src'
import { Test, type Context } from '@athenna/test'

export default class GlobalErrorTest {
  @Test()
  public async shouldBeAbleToCreateANewExceptionFromVanillaErrorClass({ assert }: Context) {
    const exception = new Error('My custom instance error').toAthennaException({
      status: 0,
      code: 'EXCEPTION',
      name: 'Exception'
    })

    assert.instanceOf(exception, Exception)

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 0)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.message, 'My custom instance error')
  }

  @Test()
  public async shouldBeAbleToCreateANewExceptionFromVanillaTypeErrorClass({ assert }: Context) {
    const exception = new TypeError('My custom instance error').toAthennaException({
      status: 0,
      code: 'EXCEPTION',
      name: 'Exception'
    })

    assert.instanceOf(exception, Exception)

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 0)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.message, 'My custom instance error')
  }
}
