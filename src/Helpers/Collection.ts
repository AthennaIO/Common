/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Collection as CollectJS } from 'collect.js'

declare global {
  interface Array<T> {
    /**
     * Call the toResource method of each item
     * inside the array.
     */
    toResource(): T[]

    /**
     * Transform the array to an Athenna collection.
     */
    toCollection(): Collection<T>
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.toResource = function (criterias = {}) {
  return this.map(model => model.toResource(criterias))
}

// eslint-disable-next-line no-extend-native
Array.prototype.toCollection = function () {
  return new Collection(this)
}

export class Collection<T = any> extends CollectJS<T> {
  /**
   * An alias for macro instance method:
   *
   * @example
   *  Collection.macro('upperAndTrim', (value) => {
   *    return value.trim().toUpperCase()
   *  })
   */
  static macro(name: string, fn: any): void {
    return new Collection().macro(name, fn)
  }

  /**
   * Remove all duplicated values from the array.
   */
  removeDuplicated(): T[] {
    return [...new Set(this.all())]
  }

  /**
   * Execute the toResource method inside objects if exists.
   */
  toResource(criterias = {}): T[] {
    // @ts-ignore
    return this.all().map(item => item.toResource(criterias))
  }
}

Collection.prototype.order = Collection.prototype.sort
Collection.prototype.orderBy = Collection.prototype.sortBy
Collection.prototype.orderByDesc = Collection.prototype.sortByDesc
Collection.prototype.orderDesc = Collection.prototype.sortDesc
Collection.prototype.orderKeys = Collection.prototype.sortKeys
Collection.prototype.orderKeysDesc = Collection.prototype.sortKeysDesc

