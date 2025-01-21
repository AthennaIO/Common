/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Number } from '#src/helpers/Number'
import { Collection } from '#src/helpers/Collection'

export class AthennaArray<T> {
  public constructor(private items: T[]) {}

  /**
   * Sum the results inside the array and return a single value.
   *
   * @example
   * ```ts
   * [1, 2, 3].athenna.sum() // 6
   * ['a', 'b', 'c'].athenna.sum() // 'abc'
   * ```
   */
  public sum() {
    return this.items.reduce((sum, n) => {
      if (!sum) {
        return n
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return sum + n
    }, null)
  }

  /**
   * Get a random value from the array.
   *
   * @example
   * ```ts
   * [1, 2, 3].athenna.random() // 1
   * [1, 2, 3].athenna.random() // 3
   * [1, 2, 3].athenna.random() // 2
   * ```
   */
  public random() {
    const index = Number.randomIntFromInterval(0, this.items.length - 1)

    return this.items[index]
  }

  /**
   * Remove all duplicated values from the array.
   *
   * @example
   * ```ts
   * [1, 2, 2, 3].removeDuplicated() // [1, 2, 3]
   * ```
   */
  public removeDuplicated() {
    return [...new Set(this.items)]
  }

  /**
   * Run closure concurrently in all values of the array. This
   * method is used when you want to execute all the promises
   * created in the callback in parallel, increasing performance.
   *
   * @example
   * ```ts
   * const results = await [1, 2, 3].athenna.concurrently(async (n) => {
   *  return n + 1
   * })
   * ```
   */
  public async concurrently<R = any>(
    callback: (value?: T, index?: number, array?: T[]) => Promise<R>
  ): Promise<R[]> {
    return Promise.all(this.items.map(callback))
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
   * const users = [new User()]
   * const usersJSON = users.athenna.toJSON()
   *
   * usersJSON[0].id // 1
   * ```
   */
  public toJSON(criterias?: any): Record<string, any>[] {
    return this.items
      .map((model: any) => {
        if (model && model.toJSON) {
          return model.toJSON(criterias)
        }

        return null
      })
      .filter(Boolean)
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
   * const users = [new User()]
   * const usersResource = users.athenna.toResource()
   *
   * usersResource[0].id // 1
   * ```
   */
  public toResource(criterias?: any) {
    return this.items
      .map((model: any) => {
        if (model && model.toResource) {
          return model.toResource(criterias)
        }

        return null
      })
      .filter(Boolean)
  }

  /**
   * Transform the array to an Athenna collection.
   */
  public toCollection(): Collection<T> {
    return new Collection(this.items)
  }
}

declare global {
  interface Array<T> {
    athenna: AthennaArray<T>
  }
}

if (!Array.prototype.athenna) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'athenna', {
    get: function () {
      return new AthennaArray(this)
    }
  })
}
