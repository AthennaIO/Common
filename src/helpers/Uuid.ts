/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4 } from 'uuid'
import { Is } from '#src/helpers/Is'
import { InvalidUuidException } from '#src/exceptions/InvalidUuidException'

export class Uuid {
  /**
   * Verify if string is a valid uuid.
   */
  public static verify(token: string, isPrefixed = false): boolean {
    if (isPrefixed) {
      return Is.Uuid(this.getToken(token))
    }

    return Is.Uuid(token)
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
   * Change the prefix of and uuid token
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
