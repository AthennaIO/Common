/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/helpers/Exception'

export class InvalidUuidException extends Exception {
  public constructor(value: string) {
    super({
      code: 'E_INVALID_UUID',
      help: 'Use a valid UUID instead.',
      message: `The value ${value} is not a valid UUID.`
    })
  }
}
