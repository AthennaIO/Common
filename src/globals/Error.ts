/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as changeCase from 'change-case'

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

// eslint-disable-next-line no-extend-native
Error.prototype.toAthennaException = function (options: ExceptionJson = {}) {
  options.name = options.name || this.name
  options.stack = options.stack || this.stack
  options.message = options.message || this.message
  options.code = options.code || changeCase.constantCase(options.name)
  options.details = options.details || this.details || this.errors

  return new Exception(options)
}
