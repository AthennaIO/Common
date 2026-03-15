/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Macroable } from '#src/helpers/Macroable'

export type ExceptionHandlerContext = {
  error: any
}

export class ExceptionHandler extends Macroable {
  public async handle(_: ExceptionHandlerContext): Promise<void> {
    /**
     * This method is meant to be overridden by the user 
     * using the `macro()` method
     */
  }
}
