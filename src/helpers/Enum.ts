/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Macroable } from '#src/helpers/Macroable'

export class Enum extends Macroable {
  /**
   * Get all keys from enum.
   *
   * @example
   * ```ts
   * export class StatusEnum extends Enum {
   *   public static PENDING = 'pending' as const
   *   public static APPROVED = 'approved' as const
   *   public static BLOCKED = 'blocked' as const
   * }
   *
   * const keys = StatusEnum.keys() // [ 'PENDING', 'APPROVED', 'BLOCKED' ]
   * ```
   */
  public static keys() {
    return Object.keys(this).filter(key => key === key.toUpperCase())
  }

  /**
   * Get all values from enum.
   *
   * @example
   * ```ts
   * export class StatusEnum extends Enum {
   *   public static PENDING = 'pending' as const
   *   public static static APPROVED = 'approved' as const
   *   public static BLOCKED = 'blocked' as const
   * }
   *
   * const values = StatusEnum.values() // ['pending', 'approved', 'blocked']
   * ```
   */
  public static values() {
    return this.keys().map(key => this[key])
  }

  /**
   * Get all keys and values from enum.
   *
   * @example
   * ```ts
   * export class StatusEnum extends Enum {
   *   public static PENDING = 'pending' as const
   * }
   *
   * const entries = StatusEnum.entries() // [['PENDING', 'pending']]
   * ```
   */
  public static entries() {
    return this.keys().map(key => [key, this[key]])
  }
}
