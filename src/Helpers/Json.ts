/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lodash from 'lodash'

export class Json {
  /**
   * Deep copy any object properties without reference.
   */
  public static copy(object: any): any {
    return lodash.cloneDeep(object)
  }

  /**
   * Find all JSON inside string and return it.
   */
  public static getJson(text: string): string[] {
    let match
    const json = []

    while ((match = /{(?:[^{}])*}/.exec(text)) !== null) {
      text = text.replace(match[0], '')

      json.push(match[0])
    }

    return json
  }

  /**
   * Converts a JSON string into an object without exception.
   */
  public static parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any {
    try {
      return JSON.parse(text, reviver)
    } catch (error) {
      return null
    }
  }

  /**
   * Observe changes inside objects.
   *
   * @param {any} object
   * @param {function} func
   * @param {...any[]} args
   * @return {any}
   */
  public static observeChanges(object: any, func: any, ...args: any[]): any {
    return new Proxy(object, {
      set: (target, key, value) => {
        func(value, ...args)

        target[key] = value

        return true
      },
    })
  }

  /**
   * Remove all keys from data that is not inside array keys.
   *
   * @param {any} data
   * @param {any[]} keys
   * @return {any[]}
   */
  public static fillable(data: any, keys: any[]): any[] {
    return keys.reduce((previous, key) => {
      if (data[key]) {
        previous[key] = data[key]
      }

      return previous
    }, {})
  }

  /**
   * Remove all duplicated values from the array.
   *
   * @deprecated Use the Collection.removeDuplicated method.
   */
  public static removeDuplicated(array: any[]): any[] {
    return [...new Set(array)]
  }

  /**
   * Raffle any value from the array.
   *
   * @deprecated Use the Collection.random method.
   */
  public static raffle(array: any[]): any {
    const index = Math.random() * array.length

    return array[Math.floor(index)]
  }

  /**
   * Get the object properties based on key.
   */
  public static get<T = any>(
    object: T,
    key: string,
    defaultValue: any = undefined,
  ): T | undefined {
    if (key === '' && object) {
      return object
    }

    return lodash.get(object, key, defaultValue)
  }
}
