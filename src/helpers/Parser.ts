/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ms from 'ms'
import bytes from 'bytes'
import yaml from 'js-yaml'
import csvParser from 'csv-parser'

import { Is } from '#src/helpers/Is'
import { String } from '#src/helpers/String'
import { Options } from '#src/helpers/Options'
import { Macroable } from '#src/helpers/Macroable'
import { ObjectBuilder } from '#src/helpers/Json'
import type { ObjectBuilderOptions } from '#src/types'
import { getReasonPhrase, getStatusCode } from 'http-status-codes'
import { InvalidNumberException } from '#src/exceptions/InvalidNumberException'

import {
  json2csv,
  type Json2CsvOptions,
  csv2json,
  type Csv2JsonOptions
} from 'json-2-csv'
import type { HTMLJson } from '#src/types/json/HTMLJson'

export class Parser extends Macroable {
  /**
   * Parse using Node.js streams, useful for
   * parsing multiple values in files.
   */
  public static stream() {
    return {
      /**
       * Parse a csv chunk to an array of json objects.
       */
      csvToArray: (options?: csvParser.Options | string[]) => {
        return csvParser(options)
      }
    }
  }

  /**
   * Parse a string to array.
   */
  public static stringToArray(string: string, separator: string): string[] {
    return string.split(separator).map(index => index.trim())
  }

  /**
   * Parse an array of strings to a string.
   */
  public static arrayToString(
    values: string[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    }
  ): string {
    if (values.length === 0) {
      return ''
    }

    if (values.length === 1) {
      return values[0]
    }

    if (values.length === 2) {
      return `${values[0]}${options?.pairSeparator || ' and '}${values[1]}`
    }

    options = Options.create(options, {
      separator: ', ',
      lastSeparator: ' and '
    })

    return (
      values.slice(0, -1).join(options.separator) +
      options.lastSeparator +
      values[values.length - 1]
    )
  }

  /**
   * Parse a string to number or Coordinate.
   */
  public static stringToNumber(string: string, isCoordinate = false): number {
    if (!string.replace(/\D/g, '')) {
      throw new InvalidNumberException(string)
    }

    string = string.replace(/\D/g, '')

    if (string.length >= 9 || isCoordinate) {
      return parseFloat(string)
    }

    return parseInt(string)
  }

  /**
   * Parse an object to form data.
   */
  public static jsonToFormData(object: any): string {
    return Object.keys(object)
      .reduce((previous, current) => {
        return previous + `&${current}=${encodeURIComponent(object[current])}`
      }, '')
      .substring(1)
  }

  /**
   * Parse form data to json.
   */
  public static formDataToJson(formData: string): any {
    const object = {}

    if (formData.startsWith('?')) formData = formData.replace('?', '')

    formData.split('&').forEach(queries => {
      const query = queries.split('=')

      object[decodeURIComponent(query[0])] = decodeURIComponent(query[1])
    })

    return object
  }

  /**
   * Parse an object to HTML element.
   *
   * @example
   * ```ts
   * const htmlElement = Parser.jsonToHTML({
   *   tag: 'script',
   *   attributes: {
   *     type: 'module',
   *     src: 'app.css',
   *   },
   *   children: []
   * })
   * // `<script type="module" src="app.css"></script>`
   * ```
   */
  public static jsonToHTML(element: HTMLJson): string {
    const attributes = `${Object.keys(element.attributes)
      .map(key => {
        const value = attributes[key]

        if (value === true) {
          return key
        }

        if (!value) {
          return null
        }

        return `${key}="${value}"`
      })
      .filter(attr => attr !== null)
      .join(' ')}`

    if (element.tag === 'link') {
      return `<${element.tag} ${attributes}/>`
    }

    return `<${element.tag} ${attributes}>${element.children.join('\n')}</${
      element.tag
    }>`
  }

  /**
   * Parse object to yaml string.
   */
  public static objectToYamlString(object: any): string {
    return yaml.dump(object)
  }

  /**
   * Parse yaml string to object.
   */
  public static yamlStringToObject(text: string): any {
    return yaml.load(text)
  }

  /**
   * Parses all links inside the string to HTML link
   * with <a href= .../>.
   */
  public static linkToHref(string: string): string {
    const regex = /(https?:\/\/[^\s]+)/g

    return string.replace(regex, '<a href="$1">$1</a>')
  }

  /**
   * Parses a number to Byte format.
   */
  public static sizeToByte(
    value: number,
    options?: bytes.BytesOptions
  ): string {
    return bytes.format(value, options)
  }

  /**
   * Parses a byte format to number.
   */
  public static byteToSize(byte: string | number): number {
    return bytes.parse(byte)
  }

  /**
   * Parses a string to MS format.
   */
  public static timeToMs(value: string): number {
    return ms(value)
  }

  /**
   * Parses an MS number to time format.
   */
  public static msToTime(value: number, long = false): string {
    return ms(value, { long })
  }

  /**
   * Parses a json to a csv string.
   */
  public static arrayToCsv(values: any[], options: Json2CsvOptions = {}) {
    return json2csv(values, options)
  }

  /**
   * Parses a csv string to an array of json objects.
   */
  public static csvToArray(value: string, options: Csv2JsonOptions = {}) {
    return csv2json(value, options)
  }

  /**
   * Parses the status code number to it reason in string.
   */
  public static statusCodeToReason(status: string | number): string {
    return String.toConstantCase(getReasonPhrase(status))
  }

  /**
   * Parses the reason in string to it status code number
   */
  public static reasonToStatusCode(reason: string): number {
    reason = String.toSentenceCase(reason, true)

    if (reason === 'Ok') reason = 'OK'

    return getStatusCode(reason)
  }

  /**
   * Parses the database connection url to connection object.
   */
  public static dbUrlToConnectionObj(url: string): {
    protocol: string
    user?: string
    password?: string
    host: string | string[]
    port?: number
    database: string
    options?: any
  } {
    const urlRegexp =
      /^([^:\\/\s]+):\/\/((.*):(.*)@|)(.*)(:(.*)|)\/(.*)(\?(.+))?/

    /** @type {any[]} */
    const matcher = url.match(urlRegexp)

    const connectionObject = {
      protocol: matcher[1],
      user: null,
      password: null,
      host: null,
      port: null,
      database: matcher[8],
      options: {}
    }

    if (matcher[5].includes(',')) {
      connectionObject.host = matcher[5].split(',')
    } else {
      connectionObject.host = matcher[5]

      if (matcher[5].includes(':')) {
        const [h, p] = matcher[5].split(':')

        connectionObject.host = h
        connectionObject.port = parseInt(p)
      }
    }

    if (connectionObject.database.includes('?')) {
      const [database, options] = connectionObject.database.split('?')

      connectionObject.database = database
      connectionObject.options = this.formDataToJson(options)
    }

    if (matcher[3]) connectionObject.user = matcher[3]
    if (matcher[4]) connectionObject.password = matcher[4]

    return connectionObject
  }

  /**
   * Parses the database connection object to connection url.
   */
  public static connectionObjToDbUrl(object: {
    protocol: string
    url?: string
    user?: string
    password?: string
    host: string | string[]
    port?: number
    database: string
    options?: any
  }): string {
    if (Is.Defined(object.url)) {
      return object.url
    }

    const { protocol, user, password, host, port, database, options } = object

    let url = `${protocol}://`

    if (user && password) {
      url = url.concat(user).concat(`:${password}`).concat('@')
    }

    if (Is.Array(host)) {
      url = url.concat(host.join(','))
    } else {
      url = url.concat(host)

      /**
       * If port exists and host does not include more than one host
       */
      if (port && !host.includes(',')) url = url.concat(`:${port}`)
    }

    url = url.concat(`/${database}`)

    if (!Is.Empty(options)) url = url.concat(`?${this.jsonToFormData(options)}`)

    return url
  }

  /**
   * Parse an object to an ObjectBuilder.
   */
  public static objectToBuilder(
    object: Record<string, any>,
    options: ObjectBuilderOptions = {}
  ): ObjectBuilder {
    const objectBuilder = new ObjectBuilder(options)

    Object.keys(object).forEach(key => {
      objectBuilder.set(key, object[key])
    })

    return objectBuilder
  }

  /**
   * Parse an entire array of objects to an array of ObjectBuilder.
   */
  public static arrayObjectToArrayBuilder(
    objects: Record<string, any>[],
    options: ObjectBuilderOptions = {}
  ): ObjectBuilder[] {
    return objects.map(object => Parser.objectToBuilder(object, options))
  }
}
