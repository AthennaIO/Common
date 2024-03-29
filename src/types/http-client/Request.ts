/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Readable } from 'node:stream'
import type { Except } from '#src/types'
import type { OptionsInit, ResponseType } from 'got'
import type { FormDataLike } from 'form-data-encoder'

export type Request = Except<OptionsInit, 'body' | 'responseType'> &
  Partial<{
    get body():
      | string
      | Record<string, any>
      | Buffer
      | Readable
      | Generator
      | AsyncGenerator
      | FormDataLike
      | undefined
    set body(
      value:
        | string
        | Record<string, any>
        | Buffer
        | Readable
        | Generator
        | AsyncGenerator
        | FormDataLike
        | undefined
    )
    get responseType(): ResponseType | string
    set responseType(value: ResponseType | string)
  }>
