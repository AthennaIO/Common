/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class InvalidUuidException extends Exception {
  constructor(value: string) {
    const content = `The value ${value} is not a valid uuid.`

    super(content, 500, 'E_INVALID_UUID', 'Use a valid uuid instead.')
  }
}
