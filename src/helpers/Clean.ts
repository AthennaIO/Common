/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '#src/helpers/Is'
import { Options } from '#src/helpers/Options'
import { Macroable } from '#src/helpers/Macroable'

export class Clean extends Macroable {
  /**
   * Remove all falsy values from an array.
   */
  public static cleanArray(
    array: any[],
    options: {
      removeEmpty?: boolean
      recursive?: boolean
    } = {}
  ) {
    options = Options.create(options, {
      removeEmpty: false,
      recursive: false
    })

    return array
      .map(item => {
        if (!item) {
          return null
        }

        if (options.removeEmpty && Is.Empty(item)) {
          return null
        }

        if (options.recursive) {
          if (Is.Array(item)) return this.cleanArray(item, options)
          if (Is.Object(item)) return this.cleanObject(item, options)
        }

        return item
      })
      .filter(Is.Defined)
  }

  /**
   * Remove all falsy values from object.
   */
  public static cleanObject<T = any>(
    object: T,
    options: {
      removeEmpty?: boolean
      recursive?: boolean
    } = {}
  ): T {
    options = Options.create(options, {
      removeEmpty: false,
      recursive: false
    })

    const cleanedObject: any = {}

    Object.keys(object).forEach(key => {
      let value = object[key]

      if (options.recursive) {
        if (Is.Array(value)) value = this.cleanArray(value, options)
        if (Is.Object(value)) value = this.cleanObject(value, options)
      }

      if (!value) {
        return
      }

      if (options.removeEmpty && Is.Empty(value)) {
        return
      }

      cleanedObject[key] = value
    })

    return cleanedObject
  }
}
