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
   */
  public removeDuplicated(): T[] {
    return [...new Set(this.all())]
  }

  /**
   * Execute the toJSON method inside objects if exists.
   */
  public toJSON(): Record<string, any>[] {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.all().athenna.toJSON()
  }

  /**
   * Execute the toResource method inside objects if exists.
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
