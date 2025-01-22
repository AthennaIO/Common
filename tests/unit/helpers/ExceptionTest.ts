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

export default class ExceptionTest {
  @Test()
  public async shouldBeAbleToCreateANewException({ assert }: Context) {
    const exception = new Exception({ message: 'My custom instance error' })

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 500)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.message, 'My custom instance error')
  }

  @Test()
  public async shouldBeAbleToExtendExceptionClassToCreateANewException({ assert }: Context) {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error', status = 500) {
        super({ message: content, status, code: 'E_RUNTIME_EXCEPTION', help: 'Restart computer.' })
      }
    }

    const exception = new InternalServerException()

    const errorJson = exception.toJSON(false)

    assert.isUndefined(errorJson.stack)
    assert.equal(errorJson.status, 500)
    assert.equal(errorJson.code, 'E_RUNTIME_EXCEPTION')
    assert.equal(errorJson.name, 'InternalServerException')
    assert.equal(errorJson.message, 'Internal Server Error')
  }

  @Test()
  public async shouldBeAbleToPrettifyTheException({ assert }: Context) {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error.', status = 500) {
        super({
          status,
          message: content,
          code: 'E_RUNTIME_EXCEPTION',
          help: 'Restart your computer, works always. 👍'
        })
      }
    }

    const exception = new InternalServerException()

    const prettyError = await exception.prettify()

    console.log(prettyError)

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  }

  @Test()
  public async shouldBeAbleToPrettifyTheExceptionWithDetails({ assert }: Context) {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error.', status = 500) {
        super({
          status,
          message: content,
          details: ['Machine error', 'Runtime error'],
          code: 'E_RUNTIME_EXCEPTION',
          help: 'Restart your computer, works always. 👍'
        })
      }
    }

    const exception = new InternalServerException()
    const prettyError = await exception.prettify()

    console.log(prettyError)

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  }

  @Test()
  public async shouldBeAbleToPrettifyTheExceptionWithDetailsAndAdditionalErrorInfos({ assert }: Context) {
    const error = new Error()

    // eslint-disable-next-line
    // @ts-ignore
    error.code = 'E_RUNTIME_EXCEPTION'
    // eslint-disable-next-line
    // @ts-ignore
    error.line = 0
    // eslint-disable-next-line
    // @ts-ignore
    error.column = 0
    // eslint-disable-next-line
    // @ts-ignore
    error.filename = 'test.js'

    const exception = error.toAthennaException()
    const prettyError = await exception.prettify()

    console.log(prettyError)

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  }

  @Test()
  public async shouldBeAbleToPrettifyTheExceptionMergingInfosAndAdditionalErrorInfos({ assert }: Context) {
    const error = new Error()

    // eslint-disable-next-line
    // @ts-ignore
    error.code = 'E_RUNTIME_EXCEPTION'
    // eslint-disable-next-line
    // @ts-ignore
    error.line = 0
    // eslint-disable-next-line
    // @ts-ignore
    error.column = 0
    // eslint-disable-next-line
    // @ts-ignore
    error.filename = 'test.js'
    // eslint-disable-next-line
    // @ts-ignore
    error.details = ['Machine error']

    const exception = error.toAthennaException({ otherInfos: { hello: 'world' } })
    const prettyError = await exception.prettify()

    console.log(prettyError)

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  }
}
