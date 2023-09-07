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

import { randomBytes } from 'crypto'
import { OrdinalNanException } from '#src/exceptions/OrdinalNanException'

export class String {
  /**
   * Generate random string by size.
   */
  public static generateRandom(size: number): string {
    const bits = (size + 1) * 6
    const buffer = randomBytes(Math.ceil(bits / 8))

    return String.normalizeBase64(buffer.toString('base64')).slice(0, size)
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
