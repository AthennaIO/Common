/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Get all types from some object without selected ones.
 *
 * @example
 *  Except<{
 *    name: string,
 *    email: string,
 *    age: number
 *  }, 'name' | 'email'>
 */
export type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>
