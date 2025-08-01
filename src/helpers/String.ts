/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluralize from 'pluralize'
import * as changeCase from 'change-case'

import { crc32 } from 'crc'
import { debug } from '#src/debug'
import { createHmac } from 'node:crypto'
import { Options } from '#src/helpers/Options'
import { ALPHABET } from '#src/constants/alphabet'
import { Macroable } from '#src/helpers/Macroable'
import { Number as NumberHelper } from '#src/helpers/Number'
import { OrdinalNanException } from '#src/exceptions/OrdinalNanException'
import { NotFoundAthennaConfig } from '#src/exceptions/NotFoundAthennaConfig'

export class String extends Macroable {
  /**
   * Generate hash for a given value.
   *
   * @example
   * ```ts
   * const hash = String.hash('12345')
   * const hash = String.hash('12345', { key: 'my-secret', prefix: 'token_' })
   * ```
   */
  public static hash(
    value: string,
    options: { key?: string; prefix?: string } = {}
  ) {
    if (!global.Config) {
      debug('@athenna/config not found running String.hash()')
    }

    if (!options.key && !global.Config) {
      throw new NotFoundAthennaConfig()
    }

    options.key = options.key || global.Config.get('app.key')

    const hash = createHmac('sha256', options.key).update(value).digest('hex')

    if (options.prefix) {
      return `${options.prefix}${hash}`
    }

    return hash
  }

  /**
   * Generate random string by size.
   *
   * @example
   * ```ts
   * const random = String.random(10) // '1bibr3zxdA'
   * const random = String.random(10, { suffixCRC: true }) // '9-EdWM9OV53876186015'
   * ```
   */
  public static random(
    size: number,
    options?: { suffixCRC?: boolean }
  ): string {
    options = Options.create(options, {
      suffixCRC: false
    })

    const str = Array.from({ length: size }, () => {
      return ALPHABET[NumberHelper.randomIntFromInterval(0, ALPHABET.length)]
    }).join('')

    if (options.suffixCRC) {
      const crc = crc32(str).toString(30)

      return `${str.slice(0, size - crc.length)}${crc}`
    }

    return str
  }

  /**
   * Generate random string by size.
   *
   * @deprecated Use `String.random()` function instead. This method
   * will be removed in the next major version.
   */
  public static generateRandom(size: number): string {
    return this.random(size, { suffixCRC: false })
  }

  /**
   * Generate random color in hexadecimal format.
   */
  public static generateRandomColor(): string {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`
  }

  /**
   * Normalizes the string in base64 format removing
   * special chars.
   */
  public static normalizeBase64(value: string): string {
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * Transforms the string to "camelCase".
   */
  public static toCamelCase(value: string): string {
    return changeCase.camelCase(value)
  }

  /**
   * Transforms the string to "snake_case".
   */
  public static toSnakeCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.snakeCase(value, {
        transform: changeCase.capitalCaseTransform
      })
    }

    return changeCase.snakeCase(value)
  }

  /**
   * Transforms the string to "CONSTANT_CASE".
   */
  public static toConstantCase(value: string): string {
    return changeCase.constantCase(value)
  }

  /**
   * Transforms the string to "PascalCase".
   */
  public static toPascalCase(value: string): string {
    return changeCase.pascalCase(value)
  }

  /**
   * Transforms the string to "Sentence case".
   */
  public static toSentenceCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.capitalCase(value)
    }

    return changeCase.sentenceCase(value)
  }

  /**
   * Transforms the string to "dot.case".
   */
  public static toDotCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.dotCase(value, {
        transform: changeCase.capitalCaseTransform
      })
    }

    return changeCase.dotCase(value)
  }

  /**
   * Removes all sorted cases from string.
   */
  public static toNoCase(value: string): string {
    return changeCase.noCase(value)
  }

  /**
   * Transforms a string to "dash-case"
   */
  public static toDashCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.headerCase(value)
    }

    return changeCase.paramCase(value)
  }

  /**
   * Convert the string to a redacted token.
   *
   * @example
   * ```ts
   * const token = '1234567890'
   *
   * String.toRedactedToken(token) // '12345...+5'
   * String.toRedactedToken(token, 3) // '123...+7'
   * ```
   */
  public static toRedactedToken(value: string, size?: number) {
    if (!size) {
      size = value.length

      return `${value.slice(0, size / 2)}...+${value.length - size / 2}`
    }

    return `${value.slice(0, size)}...+${value.length - size}`
  }

  /**
   * Transforms a word to plural
   */
  public static pluralize(word: string): string {
    return pluralize.plural(word)
  }

  /**
   * Transforms a word to singular.
   */
  public static singularize(word: string): string {
    return pluralize.singular(word)
  }

  /**
   * Transforms a number to your ordinal format.
   */
  public static ordinalize(value: string | number): string {
    const transformedValue = Math.abs(
      typeof value === 'string' ? parseInt(value) : value
    )

    if (!Number.isFinite(transformedValue) || Number.isNaN(transformedValue)) {
      throw new OrdinalNanException()
    }

    const percent = transformedValue % 100

    if (percent >= 10 && percent <= 20) {
      return `${value}th`
    }

    const decimal = transformedValue % 10

    switch (decimal) {
      case 1:
        return `${value}st`
      case 2:
        return `${value}nd`
      case 3:
        return `${value}rd`
      default:
        return `${value}th`
    }
  }
}
