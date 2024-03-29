/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface ExceptionJson {
  code?: string
  name?: string
  status?: number
  message?: string
  help?: any
  details?: any[]
  otherInfos?: any
  stack?: string
}
