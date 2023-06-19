/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Options {
  /**
   * Creates an option object with default values.
   */
  public static create<T = any>(object: T, defaultValues?: Partial<T>): T {
    return Object.assign({}, defaultValues, object)
  }
}
