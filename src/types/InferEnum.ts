/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type InferEnum<T> = {
  [K in keyof T]: T[K] extends string | number ? T[K] : never
}[keyof T]
