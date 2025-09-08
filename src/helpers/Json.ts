/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lodash from 'lodash'
import fastDeepEqual from 'fast-deep-equal'

import { Is } from '#src/helpers/Is'
import { Options } from '#src/helpers/Options'
import { Macroable } from '#src/helpers/Macroable'
import type { ObjectBuilderOptions } from '#src/types'

export class ObjectBuilder extends Macroable {
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
    super()

    this.options = Options.create(options, {
      ignoreNull: false,
      ignoreUndefined: true,
      defaultValue: null,
      referencedValues: false
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
   * Delete a value from the object by the key.
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
   * Get the value built.
   */
  public get<T = any>(key?: string, defaultValue?: any): T {
    if (key === undefined) {
      return this.getValue(this.object)
    }

    const value = Json.get(this.object, key, defaultValue)

    return this.getValue(value)
  }

  /**
   * Omit data from object.
   */
  public omit(keys: string[]) {
    return Json.omit(this.object, keys)
  }

  /**
   * Omit data from object.
   */
  public pick(keys: string[]) {
    return Json.pick(this.object, keys)
  }

  /**
   * Return an array with the property names.
   */
  public keys(): string[] {
    return Object.keys(this.get())
  }

  /**
   * Return an array with the property values.
   */
  public values<T = any>(): T[] {
    return Object.values(this.get())
  }

  /**
   * Return an array with the property names and values.
   */
  public entries<T = any>(): [string, T][] {
    return Object.entries(this.get())
  }

  /**
   * Execute some operation for each key of the object.
   */
  public forEachKey<T = any>(
    closure: (key: string, index?: number, array?: string[]) => T
  ): T[] {
    return this.keys().map(closure)
  }

  /**
   * Execute some operation for each value of the object.
   */
  public forEachValue<T = any, K = any>(
    closure: (value: T, index?: number, array?: T[]) => K
  ): K[] {
    return this.values().map(closure)
  }

  /**
   * Execute some operation for each entry of the object.
   */
  public forEachEntry<T = any, K = any>(
    closure: (value: [string, T], index?: number, array?: [string, T][]) => K
  ): K[] {
    return this.entries().map(closure)
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
   * "options.referencedValues". Also will auto set
   * the "options.defaultValue" if any value is set.
   */
  private getValue(value: any, defaultValue = this.options.defaultValue): any {
    if (this.options.referencedValues) {
      return Is.Defined(value) ? value : defaultValue
    }

    /**
     * Don't deep copy function and classes because it's
     * being parsed to object.
     */
    if (Is.Function(value) || Is.Class(value)) {
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
  public static copy<T = any>(object: T): T {
    return lodash.cloneDeep(object)
  }

  /**
   * Convert the keys of an object to camel case.
   */
  public static toCamelCase(object: any) {
    return lodash.transform(object, (result, value, key) => {
      result[lodash.camelCase(key as string)] =
        Is.Object(value) || Is.Array(value) ? this.toCamelCase(value) : value
    })
  }

  /**
   * Convert the keys of an object to snake case.
   */
  public static toSnakeCase(object: any) {
    return lodash.transform(object, (result, value, key) => {
      result[lodash.snakeCase(key as string)] =
        Is.Object(value) || Is.Array(value) ? this.toSnakeCase(value) : value
    })
  }

  /**
   * Omit data from an object.
   *
   * @example
   * ```ts
   * const obj = {
   *  name: 'Lenon',
   *  age: 22
   * }
   *
   * const omitted = Json.omit(obj, ['name']) // { age: 22 }
   * ```
   */
  public static omit<T extends object = any, K extends keyof T = any>(
    object: T,
    keys: K[]
  ): Omit<T, K> {
    return lodash.omit(object, keys)
  }

  /**
   * Pick data from an object.
   *
   * @example
   * ```ts
   * const obj = {
   *  name: 'Lenon',
   *  age: 22
   * }
   *
   * const picked = Json.pick(obj, ['name']) // { name: 'Lenon' }
   * ```
   */
  public static pick<T extends object = any, K extends keyof T = any>(
    object: T,
    keys: K[]
  ): Pick<T, K> {
    return lodash.pick(object, keys)
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
    reviver?: (this: any, key: string, value: any) => any
  ): any {
    try {
      return JSON.parse(text, reviver)
    } catch (_error) {
      return null
    }
  }

  /**
   * Observe changes inside objects.
   */
  public static observeChanges(object: any, func: any, ...args: any[]): any {
    return new Proxy(object, {
      set: (target, key, value) => {
        func(value, ...args)

        target[key] = value

        return true
      }
    })
  }

  /**
   * Remove all keys from data that is not inside array keys.
   */
  public static fillable(
    data: Record<string, any>,
    keys: string[]
  ): Record<string, any> {
    return keys.reduce((previous, key) => {
      if (data[key]) {
        previous[key] = data[key]
      }

      return previous
    }, {})
  }

  /**
   * Get the object properties based on a key.
   */
  public static get<T = any>(
    object: T,
    key: string,
    defaultValue: any = undefined
  ): T | undefined {
    if (key === '' && object) {
      return object
    }

    return lodash.get(object, key, defaultValue)
  }

  /**
   * Sort an object or an array of objects by it keys names.
   */
  public static sort<T = any>(object: T) {
    if (Is.Array(object)) {
      return object.map(Json.sort)
    }

    if (!object || !Is.Object(object)) {
      return object
    }

    return Object.keys(object)
      .sort()
      .reduce((sortedObject, key) => {
        sortedObject[key] = Json.sort(object[key])

        return sortedObject
      }, {})
  }

  /**
   * Validate if an object or array is equal to another.
   *
   * @example
   * ```ts
   * Json.isEqual({ hello: 'world' }, { hello: 'world' }) // true
   * Json.isEqual([{ hello: 'world' }], [{ hello: 'world' }]) // true
   * Json.isEqual({ hello: { hello: 'world' } }, { hello: { hello: 'world' } }) // true
   * ```
   */
  public static isEqual(firstObject: any, secondObject: any) {
    return fastDeepEqual(firstObject, secondObject)
  }

  /**
   * Create a new object based on the changes between two objects.
   *
   * @example
   * ```ts
   * Json.diff({ a: 'a' }, { a: 'a' }) // { }
   * Json.diff({ a: 'a' }, { a: 'b' }) // { a: 'b' }
   * Json.diff({ a: 'a' }, { a: 'b', b: 'b' }) // { a: 'b', b: 'b' }
   * ```
   */
  public static diff(orig: any, curr: any): any {
    if (Json.isEqual(orig, curr)) {
      return {}
    }

    if (!Is.Object(orig) || !Is.Object(curr)) {
      return Json.copy(curr)
    }

    const result: any = Array.isArray(curr) ? [] : {}
    const keys = new Set([...Object.keys(orig), ...Object.keys(curr)])

    for (const key of keys) {
      const oVal = orig[key]
      const cVal = curr[key]

      if (Json.isEqual(oVal, cVal)) {
        continue
      }

      if (Is.Object(oVal) && Is.Object(cVal)) {
        const nested = Json.diff(oVal, cVal)

        if (Is.Array(nested) && nested.length) {
          result[key] = nested
        }

        if (Is.Object(nested) && Object.keys(nested).length) {
          result[key] = nested
        }

        continue
      }

      result[key] = Json.copy(cVal)
    }

    return result
  }
}
