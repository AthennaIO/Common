/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from '#src/helpers/String'

export class AthennaString {
  public constructor(private value: string) {}

  /**
   * Check if at least one of the provided search strings
   * is included in the given string value.
   *
   * @example
   * ```ts
   * 'Hello model.id'.athenna.includesSome('models.id', 'models.provider') // false
   * 'Hello models.id'.athenna.includesSome(['models.id', 'provider']) // true
   * ```
   */
  public includesSome(...searches: (string | string[])[]): boolean {
    return String.includesSome(this.value, ...searches)
  }

  /**
   * Check if every provided search string is included
   * in the given string value.
   *
   * @example
   * ```ts
   * 'Hello model.id'.athenna.includesEvery('models.id', 'models.provider') // false
   * 'Hello model.id'.athenna.includesEvery(['model.id', 'Hello']) // true
   * ```
   */
  public includesEvery(...searches: (string | string[])[]): boolean {
    return String.includesEvery(this.value, ...searches)
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface String {
    athenna: AthennaString
  }
}

if (!String.prototype.athenna) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(String.prototype, 'athenna', {
    get: function () {
      return new AthennaString(this)
    }
  })
}
