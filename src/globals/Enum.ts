/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Enum as EnumImpl } from '#src/helpers/Enum'

declare global {
  export class Enum extends EnumImpl {}
}

const __global: any = global

if (!__global.Enum) {
  __global.Enum = EnumImpl
}
