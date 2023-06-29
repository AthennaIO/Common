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

export class Clean {
  /**
   * Remove all falsy values from an array.
   */
  public static cleanArray(
    array: any[],
    options: {
      removeEmpty?: boolean
      cleanInsideObjects?: boolean
    } = {},
  ): any[] {
    options = Options.create(options, {
      removeEmpty: false,
      cleanInsideObjects: false,
    })

    return array.filter((item, i) => {
      let returnItem = !!item

      if (options.removeEmpty && Is.Empty(item)) {
        returnItem = false
      }

      if (
        typeof item === 'object' &&
        !Is.Array(item) &&
        options.cleanInsideObjects &&
        returnItem
      ) {
        this.cleanObject(item, options)
      }

      if (!returnItem) {
        array.splice(i, 1)
      }

      return returnItem
    })
  }

  /**
   * Remove all falsy values from object.
   */
  public static cleanObject(
    object: any,
    options: {
      removeEmpty?: boolean
      cleanInsideArrays?: boolean
    } = {},
  ): void {
    options = Options.create(options, {
      removeEmpty: false,
      cleanInsideArrays: false,
    })

    Object.keys(object).forEach(prop => {
      if (options.removeEmpty && Is.Empty(object[prop])) {
        delete object[prop]

        return
      }

      if (Is.Array(object[prop]) && options.cleanInsideArrays) {
        this.cleanArray(object[prop], {
          removeEmpty: options.removeEmpty,
          cleanInsideObjects: true,
        })
      }

      if (!object[prop]) {
        delete object[prop]
      }
    })
  }
}
