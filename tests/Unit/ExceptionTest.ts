/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exception } from '#src/index'

test.group('ExceptionTest', () => {
  test('should be able to create a new exception', async ({ assert }) => {
    const exception = new Exception({ message: 'My custom instance error' })

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 500)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.message, 'My custom instance error')
  })

  test('should be able to create a new exception from vanilla errors', async ({ assert }) => {
    const exception = new Error('My custom instance error').toAthennaException({
      status: 0,
      code: 'EXCEPTION',
      name: 'Exception',
    })

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 0)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.message, 'My custom instance error')
  })

  test('should be able to extend exception class to create a new exception', async ({ assert }) => {
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
  })

  test('should be able to pretiffy the exception', async ({ assert }) => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error.', status = 500) {
        super({
          status,
          message: content,
          code: 'E_RUNTIME_EXCEPTION',
          help: 'Restart your computer, works always. 👍',
        })
      }
    }

    const exception = new InternalServerException()

    const prettyError = await exception.prettify()

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  })
})
