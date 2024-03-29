/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as changeCase from 'change-case'

import { Is } from '#src/helpers/Is'
import { Json } from '#src/helpers/Json'
import type { ExceptionJson } from '#src/types'
import { Exception } from '#src/helpers/Exception'

export {}

declare global {
  interface Error {
    /**
     * Transform your error to an instance of
     * the Athenna exception.
     */
    toAthennaException(options?: ExceptionJson): Exception
  }
}

if (!Error.prototype.toAthennaException) {
  // eslint-disable-next-line no-extend-native
  Error.prototype.toAthennaException = function (options: ExceptionJson = {}) {
    options.name = options.name || this.name
    options.stack = options.stack || this.stack
    options.message = options.message || this.message
    options.code =
      options.code || this.code || changeCase.constantCase(options.name)
    options.otherInfos = {
      ...options.otherInfos,
      ...Json.omit(this, [
        'name',
        'stack',
        'message',
        'code',
        'details',
        'errors',
        'toAthennaException'
      ])
    }

    if (!Is.Undefined(options.details)) {
      return new Exception(options)
    }

    options.details = []

    if (!Is.Empty(this.details)) {
      if (Is.Array(this.details)) {
        options.details.push(...this.details)
      } else {
        options.details.push(this.details)
      }
    }

    if (!Is.Empty(this.errors)) {
      if (Is.Array(this.errors)) {
        options.details.push(...this.errors)
      } else {
        options.details.push(this.errors)
      }
    }

    return new Exception(options)
  }
}
