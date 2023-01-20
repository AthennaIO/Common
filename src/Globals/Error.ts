/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception, ExceptionJSON } from '#src/Helpers/Exception'

declare global {
  interface Error {
    /**
     * Transform your error to an instance of
     * the Athenna exception.
     */
    toAthennaException(options?: ExceptionJSON): Exception
  }
}

// eslint-disable-next-line no-extend-native
Error.prototype.toAthennaException = function (options: ExceptionJSON = {}) {
  options.name = options.name || this.name
  options.stack = options.stack || this.stack
  options.message = options.message || this.message

  return new Exception(options)
}
