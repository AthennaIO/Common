/* eslint-disable @typescript-eslint/ban-types */
/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import kindOf from 'kind-of'

import { isIP } from 'node:net'
import { validate } from 'uuid'
import { isCep, isCnpj, isCpf } from 'validator-brazil'

export class Is {
  /**
   * Return the kindOf.
   */
  public static kindOf(value: any): string {
    const kind = kindOf(value)

    if (
      kind === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(value))
    ) {
      return 'class'
    }

    return kind
  }

  /**
   * Verify if is valid Uuid.
   */
  public static Uuid(value: string): boolean {
    return validate(value)
  }

  /**
   * Verify if the value is defined, even
   * with falsy values like false and ''.
   */
  public static Defined(value: any): boolean {
    if (value === undefined || value === null) {
      return false
    }

    return true
  }

  /**
   * Verify if is valid Json.
   */
  public static Json(value: string): boolean {
    try {
      JSON.parse(value)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verify if is valid Ip.
   */
  public static Ip(value: string): boolean {
    // Removes http/https and port/route values
    value = value.replace(/^https?:\/\//, '').split(':')[0]

    return isIP(value) !== 0
  }

  /**
   * Verify if is valid Empty.
   */
  public static Empty(value: string | any | any[]): boolean {
    if (!value) {
      return true
    }

    if (Is.Array(value)) {
      return !value.length
    }

    if (Is.String(value)) {
      return value.trim().length === 0
    }

    if (Is.Object(value)) {
      return !Object.keys(value).length
    }

    return false
  }

  /**
   * Verify if is a valid Cep.
   */
  public static Cep(cep: string | number): boolean {
    if (Is.Number(cep)) {
      cep = cep.toString()
    }

    return isCep(cep)
  }

  /**
   * Verify if is a valid Cpf.
   */
  public static Cpf(cpf: string | number): boolean {
    if (Is.Number(cpf)) {
      cpf = cpf.toString()
    }

    return isCpf(cpf)
  }

  /**
   * Verify if is a valid Cnpj.
   */
  public static Cnpj(cnpj: string | number): boolean {
    if (Is.Number(cnpj)) {
      cnpj = cnpj.toString()
    }

    return isCnpj(cnpj)
  }

  /**
   * Verify if is a valid Async function.
   */
  public static Async(value: any): boolean {
    const fnString = value.toString().trim()

    const validation = !!(
      fnString.match(/^async/) || fnString.match(/return _ref[^.]*\.apply/)
    )

    return validation || fnString.includes('new Promise(')
  }

  /**
   * Verify if is a valid Undefined.
   */
  public static Undefined(value: any): value is undefined {
    return Is.kindOf(value) === 'undefined'
  }

  /**
   * Verify if is a valid Null.
   */
  public static Null(value: any): value is null {
    return Is.kindOf(value) === 'null'
  }

  /**
   * Verify if is a valid Boolean.
   */
  public static Boolean(value: any): value is boolean {
    return Is.kindOf(value) === 'boolean'
  }

  /**
   * Verify if is a valid Buffer.
   */
  public static Buffer(value: any): value is Buffer {
    return Is.kindOf(value) === 'buffer'
  }

  /**
   * Verify if is a valid Number.
   */
  public static Number(value: any): value is number {
    return Is.kindOf(value) === 'number'
  }

  /**
   * Verify if is a valid String.
   */
  public static String(value: any): value is string {
    return Is.kindOf(value) === 'string'
  }

  /**
   * Verify if is a valid Object.
   */
  public static Object(value: any): value is object | Record<string, any> {
    return Is.kindOf(value) === 'object'
  }

  /**
   * Verify if is a valid Date.
   */
  public static Date(value: any): value is Date {
    return Is.kindOf(value) === 'date'
  }

  /**
   * Verify if is a valid Array.
   */
  public static Array(value: any): value is Array<any> {
    return Is.kindOf(value) === 'array'
  }

  /**
   * Verify if is a valid Regexp.
   */
  public static Regexp(value: any): value is RegExp {
    return Is.kindOf(value) === 'regexp'
  }

  /**
   * Verify if is a valid Error.
   */
  public static Error(value: any): value is Error {
    return Is.kindOf(value) === 'error'
  }

  /**
   * Verify if is a valid Function.
   */
  public static Function(value: any): value is Function {
    return Is.kindOf(value) === 'function'
  }

  /**
   * Verify if is a valid Class.
   */
  public static Class(value: any): boolean {
    return Is.kindOf(value) === 'class'
  }

  /**
   * Verify if is a valid Integer.
   */
  public static Integer(value: any): value is number {
    return Number.isInteger(value)
  }

  /**
   * Verify if is a valid Float.
   */
  public static Float(value: any): value is number {
    return value !== (value | 0)
  }

  /**
   * Verify if is a valid ArrayOfObjects.
   */
  public static ArrayOfObjects(value: any[]): value is Array<any> {
    if (!value.length) return false

    const results = value.map(v => Is.Object(v))

    return !results.includes(false)
  }
}
