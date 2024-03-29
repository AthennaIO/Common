/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type ModuleResolveOptions = {
  /**
   * Automatically import the module instead of returning
   * the module path.
   */
  import?: boolean

  /**
   * Automatically get the imported module using `Module.get()`
   * method.
   */
  getModule?: boolean
}
