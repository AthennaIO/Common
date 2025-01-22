/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Collection as CollectJS } from 'collect.js'

export class Collection<T = any> extends CollectJS<T> {
  /**
   * An alias for macro instance method:
   *
   * @example
   *  Collection.macro('upperAndTrim', (value) => {
   *    return value.trim().toUpperCase()
   *  })
   */
  public static macro(name: string, fn: any): void {
    return new Collection().macro(name, fn)
  }

  /**
   * Remove all duplicated values from the array.
   *
   * @deprecated Use unique() method instead. This method will
   * me removed on the next major release.
   * @example
   * ```ts
   * new Collection([1, 2, 2, 3]).removeDuplicated().all() // [1, 2, 3]
   * ```
   */
  public removeDuplicated(): T[] {
    return this.all().athenna.unique()
  }

  /**
   * Run closure concurrently in all values of the array. This
   * method is used when you want to execute all the promises
   * created in the callback in parallel, increasing performance.
   *
   * @example
   * ```ts
   * const results = await new Collection([1, 2, 3]).athenna.concurrently(async (n) => {
   *  return n + 1
   * })
   * ```
   */
  public async concurrently<R = any>(
    callback: (value?: T, index?: number, array?: T[]) => Promise<R>
  ): Promise<R[]> {
    return this.all().athenna.concurrently(callback)
  }

  /**
   * Call the toJSON method of each item
   * inside the array.
   *
   * @example
   * ```ts
   * class User {
   *  toJSON() {
   *    return { id: 1 }
   *  }
   * }
   *
   * const users = new Collection([new User()]).toJSON()
   *
   * users[0].id // 1
   * ```
   */
  public toJSON(): Record<string, any>[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.all().athenna.toJSON()
  }

  /**
   * Call the toResource method of each item
   * inside the array.
   *
   * @example
   * ```ts
   * class User {
   *  toResource() {
   *    return { id: 1 }
   *  }
   * }
   *
   * const users = new Collection([new User()]).toResource()
   *
   * users[0].id // 1
   * ```
   */
  public toResource(criterias = {}): T[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.all().athenna.toResource(criterias)
  }
}

Collection.prototype.order = Collection.prototype.sort
Collection.prototype.orderBy = Collection.prototype.sortBy
Collection.prototype.orderByDesc = Collection.prototype.sortByDesc
Collection.prototype.orderDesc = Collection.prototype.sortDesc
Collection.prototype.orderKeys = Collection.prototype.sortKeys
Collection.prototype.orderKeysDesc = Collection.prototype.sortKeysDesc
