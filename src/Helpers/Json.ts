/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lodash from 'lodash'

import { Is } from './Is.js'
import { Options } from './Options.js'

export type ObjectBuilderOptions = {
  /**
   * The global default value that is going
   * to be used if the value that is being set
   * is undefined or null.
   *
   * @default null
   */
  defaultValue?: any

  /**
   * Ignore null values that are going to be set
   * in the object. If some value is null, it will
   * not be set inside the object.
   *
   * @default false
   */
  ignoreNull?: boolean

  /**
   * Ignore undefined values that are going to be set
   * in the object. If some value is undefined, it will
   * not be set inside the object.
   *
   * @default true
   */
  ignoreUndefined?: boolean
}

export class ObjectBuilder {
  /**
   * The real object that is being built.
   */
  private object: any

  /**
   * The object builder options that are
   * going to be used to shape the object.
   */
  private options: ObjectBuilderOptions

  public constructor(options?: ObjectBuilderOptions) {
    this.options = Options.create(options, {
      ignoreNull: false,
      ignoreUndefined: true,
      defaultValue: null,
    })

    this.object = {}
  }

  /**
   * Set a value in the object or fallback to defaultValue.
   *
   * @example
   *  const object = Object.builder()
   *    .set('hello.world', 'hello world!')
   *    .get()
   *
   *  console.log(object.hello.world)
   */
  public set(key: string, value: any, defaultValue?: any): this {
    const [mainKey, ...keys] = key.split('.')

    if (Is.Defined(defaultValue) && !Is.Defined(value)) {
      this.object[mainKey] = lodash.set(
        {},
        keys.join('.'),
        Json.copy(defaultValue),
      )

      return this
    }

    if (this.options.ignoreNull && value === null) {
      return this
    }

    if (this.options.ignoreUndefined && value === undefined) {
      return this
    }

    this.object[key] = lodash.set({}, keys.join('.'), Json.copy(value))

    return this
  }
}

export class Json {
  /**
   * Create a new instance of ObjectBuilder class.
   * This class is responsible to build new objects
   * in a more easy way, removing null and undefined values
   * and setting default values in options.
   */
  public static builder(options?: ObjectBuilderOptions): ObjectBuilder {
    return new ObjectBuilder(options)
  }

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
