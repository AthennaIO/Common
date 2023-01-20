/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CancelableRequest, Response as GotResponse } from 'got'

export type Response<T = any> =
  | CancelableRequest<T>
  | CancelableRequest<GotResponse>
  | CancelableRequest<GotResponse<T>>
  | CancelableRequest
