/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Response as GotResponse, CancelableRequest } from 'got'

export type Response<T = any> = CancelableRequest<GotResponse<T>>
