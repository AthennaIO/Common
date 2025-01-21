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
import { File } from '#src/helpers/File'
import { Uuid } from '#src/helpers/Uuid'
import { Ulid } from '#src/helpers/Ulid'
import { Exception } from '#src/helpers/Exception'
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
   * Verify if the current platform is Linux.
   */
  public static Linux(): boolean {
    return process.platform === 'linux'
  }

  /**
   * Verify if the current platform is Mac.
   */
  public static Mac(): boolean {
    return process.platform === 'darwin'
  }

  /**
   * Verify if the current platform is Windows.
   */
  public static Windows(): boolean {
    return process.platform === 'win32'
  }

  /**
   * Verify if file path or File instance is a
   * module or not.
   */
  public static Module(value: any): boolean {
    if (value instanceof File) {
      return Is.Module(value.extension)
    }

    if (!value || !Is.String(value)) {
      return false
    }

    if (value.endsWith('.js') || value.endsWith('.ts')) {
      return true
    }

    return false
  }

  /**
   * Verify if is valid Uuid.
   */
  public static Uuid(
    value: string,
    options?: { prefix?: string; ignorePrefix?: boolean }
  ): boolean {
    return Uuid.verify(value, options)
  }

  /**
   * Verify if is valid Ulid.
   */
  public static Ulid(
    value: string,
    options?: { prefix?: string; ignorePrefix?: boolean }
  ): boolean {
    return Ulid.verify(value, options)
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
    } catch (_error) {
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
   * Verify if is a valid internal JS error.
   */
  public static Exception(value: any): value is Exception {
    if (!value) {
      return false
    }

    return value?.isAthennaException === true && Is.Defined(value.prettify)
  }

  /**
   * Verify if is a valid Function.
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
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
