/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class InvalidNumberException extends Exception {
  constructor(number: string) {
    const content = `The number ${number} is not a valid string number.`

    super(
      content,
      500,
      'E_INVALID_NUMBER',
      'Use a valid string number instead.',
    )
  }
}
