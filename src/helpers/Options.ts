/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '#src/helpers/Is'

export class Options {
  /**
   * Creates an option object with default values.
   */
  public static create<T = any>(object: T, defaultValues?: Partial<T>): T {
    return Object.assign({}, defaultValues, object)
  }

  /**
   * Creates a bind closure from an object method.
   */
  public static bind<T = any>(object: T, method: keyof T) {
    const closure = object[method]

    if (!closure || !Is.Function(closure)) {
      return null
    }

    return closure.bind(object)
  }

  /**
   * Execute some closure when a statement is defined.
   */
  public static whenDefined<T = any, K = any>(
    statement: T,
    closure: (statement: T) => K,
  ): K {
    if (!Is.Defined(statement)) {
      return
    }

    return closure(statement)
  }
}
