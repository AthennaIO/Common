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
  public constructor(number: string) {
    super({
      code: 'E_INVALID_NUMBER',
      help: 'Use a valid string number instead.',
      message: `The number ${number} is not a valid string number.`,
    })
  }
}
