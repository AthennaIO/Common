/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import otpGenerator from 'otp-generator'

export class Otp {
  /**
   * Generate an OTP token.
   */
  public static generate(prefix?: string) {
    if (prefix) {
      return `${prefix}::${otpGenerator.generate(6, {
        digits: true,
        specialChars: false,
        upperCaseAlphabets: true,
        lowerCaseAlphabets: false
      })}`
    }

    return otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: false
    })
  }

  /**
   * Return the token without his prefix.
   */
  public static getToken(token: string): string {
    const prefix = Otp.getPrefix(token)

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
    return `${prefix}::${token}`
  }

  /**
   * Change the prefix of an OTP token.
   */
  public static changePrefix(newPrefix: string, token: string): string {
    const otp = this.getToken(token)

    return `${newPrefix}::${otp}`
  }

  /**
   * Change the token prefix or generate a new one.
   */
  public static changeOrGenerate(prefix: string, token?: string): string {
    if (token) {
      return this.changePrefix(prefix, token)
    }

    return this.generate(prefix)
  }
}
