/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/helpers/Exception'

export class NotFoundAthennaConfig extends Exception {
  public constructor() {
    super({
      code: 'E_NOT_FOUND_ATHENNA_CONFIG',
      message: 'The @athenna/config package is not installed',
      help: 'String.hash() requires @athenna/config to be installed to search for your app.key. You bypass installing @athenna/config if you define the key when calling the method: String.hash("value", { key: "your-key" })'
    })
  }
}
