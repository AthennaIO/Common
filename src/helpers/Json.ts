/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lodash from 'lodash'

import { Is } from '#src/helpers/Is'
import { Options } from '#src/helpers/Options'
import type { ObjectBuilderOptions } from '#src/types'

export class ObjectBuilder {
  /**
   * The real object that is being built.
   */
  public object: any

  /**
   * The object builder options that are
   * going to be used to shape the object.
   */
  public options: ObjectBuilderOptions

  public constructor(options?: ObjectBuilderOptions) {
    this.options = Options.create(options, {
      ignoreNull: false,
      ignoreUndefined: true,
      defaultValue: null,
      referencedValues: false,
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
  public set(key: string | any, value?: any, defaultValue?: any): this {
    if (!Is.String(key)) {
      this.object = this.getValue(key)

      return this
    }

    if (this.isDefinedDefaultValue(defaultValue) && !Is.Defined(value)) {
      lodash.set(this.object, key.split('.'), this.getValue(defaultValue))

      return this
    }

    if (this.options.ignoreNull && value === null) {
      return this
    }

    if (this.options.ignoreUndefined && value === undefined) {
      return this
    }

    lodash.set(this.object, key.split('.'), this.getValue(value))

    return this
  }

  /**
   * Delete the configuration key.
   */
  public delete(key: string): this {
    if (this.notExists(key)) {
      return this
    }

    const [mainKey, ...keys] = key.split('.')

    if (key === mainKey) {
      delete this.object[key]

      return this
    }

    const object = this.object[mainKey]
    lodash.unset(object, keys.join('.'))
    object[mainKey] = object

    return this
  }

  /**
   * Get the value builded.
   */
  public get<T = any>(key?: string, defaultValue?: any): T {
    if (key === undefined) {
      return this.getValue(this.object)
    }

    const value = Json.get(this.object, key, defaultValue)

    return this.getValue(value)
  }

  /**
   * Verify if the object key path has the same value.
   */
  public is(key: string, ...values: any | any[]): boolean {
    let is = false
    values = Is.Array(values[0]) ? values[0] : values

    for (const value of values) {
      if (this.get(key) === value) {
        is = true
        break
      }
    }

    return is
  }

  /**
   * Verify if the object key path does not have the same value.
   */
  public isNot(key: string, ...values: any | any[]): boolean {
    return !this.is(key, ...values)
  }

  /**
   * Verify if key path exists in object.
   */
  public exists(key: string): boolean {
    return !!this.get(key)
  }

  /**
   * Verify if key path does not exists in object.
   */
  public notExists(key: string): boolean {
    return !this.exists(key)
  }

  /**
   * Verify if all the object keys exists.
   */
  public existsAll(...keys: string[]): boolean {
    let existsAll = true
    keys = Is.Array(keys[0]) ? keys[0] : keys

    for (const key of keys) {
      if (this.notExists(key)) {
        existsAll = false

        break
      }
    }

    return existsAll
  }

  /**
   * Verify if all the object keys does not exist.
   */
  public notExistsAll(...keys: string[]): boolean {
    return !this.existsAll(...keys)
  }

  /**
   * Verify if defaultValue or global default value option
   * is defined.
   */
  private isDefinedDefaultValue(defaultValue: string): boolean {
    return Is.Defined(defaultValue) || Is.Defined(this.options.defaultValue)
  }

  /**
   * Get the value referenced or not depending on
   * "options.referecendValues". Also will auto set
   * the "options.defaultValue" if any value is set.
   */
  private getValue(value: any, defaultValue = this.options.defaultValue): any {
    if (this.options.referencedValues) {
      return Is.Defined(value) ? value : defaultValue
    }

    return Json.copy(Is.Defined(value) ? value : defaultValue)
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

    while ((match = /{[^{}]*}/.exec(text)) !== null) {
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
