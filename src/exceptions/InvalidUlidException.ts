/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/helpers/Exception'

export class InvalidUlidException extends Exception {
  public constructor(value: string) {
    super({
      code: 'E_INVALID_ULID',
      help: 'Use a valid ULID instead.',
      message: `The value ${value} is not a valid ULID.`
    })
  }
}
