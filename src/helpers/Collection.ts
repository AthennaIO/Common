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
   * Add standard property to your class prototype.
   *
   * @example
   * ```ts
   * YourClass.macro('foo', 'bar')
   * ```
   */
  public static macro<K extends keyof Collection>(
    name: K,
    value: Collection[K]
  ) {
    this.prototype[name] = value
  }

  /**
   * Add getters to the class prototype using the Object.defineProperty()
   * method.
   *
   * @example
   * ```ts
   * YourClass.getter('foo', function foo () {
   *  return 'bar'
   * })
   *
   * const singleton = true
   *
   * // Add singleton getter:
   * YourClass.getter('foo', function foo() {
   *  return 'bar'
   * }, singleton)
   * ```
   */
  public static getter<K extends keyof Collection>(
    name: K,
    accumulator: () => Collection[K],
    singleton: boolean = false
  ) {
    Object.defineProperty(this.prototype, name, {
      get() {
        const value = accumulator.call(this)

        if (singleton) {
          Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            value,
            writable: false
          })
        }

        return value
      },
      configurable: true,
      enumerable: false
    })
  }

  /**
   * Add a standard static property to the class itself.
   *
   * @example
   * ```ts
   * YourClass.staticMacro('foo', 'bar')
   * ```
   */
  public static staticMacro<K extends keyof Collection>(
    name: K,
    value: Collection[K]
  ) {
    Object.defineProperty(this, name, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  /**
   * Add static getters to the class itself using Object.defineProperty().
   *
   * @example
   * ```ts
   * YourClass.staticGetter('foo', () => 'bar')
   *
   * const singleton = true
   *
   * // Add singleton static getter:
   * YourClass.staticGetter('foo', () => 'bar', singleton)
   * ```
   */
  public static staticGetter<K extends keyof Collection>(
    name: K,
    accumulator: () => Collection[K],
    singleton: boolean = false
  ) {
    Object.defineProperty(this, name, {
      get: function () {
        const value = accumulator.call(this)

        if (singleton) {
          Object.defineProperty(this, name, {
            configurable: false,
            enumerable: true,
            value,
            writable: false
          })
        }

        return value
      },
      configurable: true,
      enumerable: true
    })
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
