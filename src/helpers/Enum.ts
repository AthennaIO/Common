/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Enum {
  /**
   * Get all keys from enum.
   *
   * @example
   * ```ts
   * export class StatusEnum extends Enum {
   *   static PENDING = 'pending'
   *   static APPROVED = 'approved'
   *   static BLOCKED = 'blocked'
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
   *   static PENDING = 'pending'
   *   static APPROVED = 'approved'
   *   static BLOCKED = 'blocked'
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
   *   static PENDING = 'pending'
   * }
   *
   * const entries = StatusEnum.entries() // [['PENDING', 'pending']]
   * ```
   */
  public static entries() {
    return this.keys().map(key => [key, this[key]])
  }
}
