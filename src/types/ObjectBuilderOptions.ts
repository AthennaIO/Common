/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type ObjectBuilderOptions = {
  /**
   * If referenced values are false (by default, is `false`),
   * Athenna will make a copy of the value that you are
   * setting or getting of the ObjectBuilder object.
   * Check the example:
   *
   * @default false
   * @example
   *  const user = { name: 'Victor' }
   *  const builder = Json.builder({ referencedValues: false })
   *    .set('user', user)
   *
   *  console.log(builder.get('user.name')) // 'Victor'
   *
   *  user.name = 'João'
   *
   *  console.log(builder.get('user.name')) // 'Victor'
   *
   * Now let's check the example with referencedValues as true:
   *
   * @example
   * const user = { name: 'Victor' }
   *  const builder = Json.builder({ referencedValues: true })
   *    .set('user', user)
   *
   *  console.log(builder.get('user.name')) // 'Victor'
   *
   *  user.name = 'João'
   *
   *  console.log(builder.get('user.name')) // 'João'
   */
  referencedValues?: any

  /**
   * The global default value that is going
   * to be used if the value that is being set
   * is undefined or null.
   *
   * @default null
   */
  defaultValue?: any

  /**
   * Ignore null values that are going to be set
   * in the object. If some value is null, it will
   * not be set inside the object.
   *
   * @default false
   */
  ignoreNull?: boolean

  /**
   * Ignore undefined values that are going to be set
   * in the object. If some value is undefined, it will
   * not be set inside the object.
   *
   * @default true
   */
  ignoreUndefined?: boolean
}
