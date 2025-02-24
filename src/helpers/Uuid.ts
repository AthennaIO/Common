/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4, validate } from 'uuid'
import { Options } from '#src/helpers/Options'
import { Macroable } from '#src/helpers/Macroable'
import { InvalidUuidException } from '#src/exceptions/InvalidUuidException'

export class Uuid extends Macroable {
  /**
   * Verify if string is a valid uuid.
   */
  public static verify(
    token: string,
    options: { prefix?: string; ignorePrefix?: boolean } = {}
  ): boolean {
    if (!token) {
      return false
    }

    options = Options.create(options, { ignorePrefix: true })

    if (options.prefix) {
      const prefix = this.getPrefix(token)

      if (prefix !== options.prefix) {
        return false
      }

      return validate(this.getToken(token))
    }

    if (options.ignorePrefix) {
      return validate(this.getToken(token))
    }

    return validate(token)
  }

  /**
   * Generate an uuid token
   */
  public static generate(prefix?: string): string {
    if (prefix) {
      return `${prefix}::${v4()}`
    }

    return v4()
  }

  /**
   * Return the token without his prefix.
   */
  public static getToken(token: string): string {
    const prefix = Uuid.getPrefix(token)

    if (!prefix) {
      return token
    }

    return token.split(`${prefix}::`)[1]
  }

  /**
   * Return the prefix without his token.
   */
  public static getPrefix(token: string): string | null {
    const prefix = token.split('::')[0]

    /**
     * Means that the "::" char has not been
     * found. So there is no prefix in the token.
     */
    if (prefix === token) {
      return null
    }

    return prefix
  }

  /**
   * Inject a prefix in the uuid token.
   */
  public static injectPrefix(prefix: string, token: string): string {
    if (!this.verify(token)) {
      throw new InvalidUuidException(token)
    }

    return `${prefix}::${token}`
  }

  /**
   * Change the prefix of an uuid token
   */
  public static changePrefix(newPrefix: string, token: string): string {
    const uuid = this.getToken(token)

    if (!this.verify(uuid)) {
      throw new InvalidUuidException(uuid)
    }

    return `${newPrefix}::${uuid}`
  }

  /**
   * Change the token prefix or generate a new one
   */
  public static changeOrGenerate(prefix: string, token?: string): string {
    if (token) {
      return this.changePrefix(prefix, token)
    }

    return this.generate(prefix)
  }
}
