/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface PaginatedResponse<T = any> {
  data?: T[]
  meta?: {
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    itemCount: number
  }
  links?: {
    next: string
    previous: string
    last: string
    first: string
  }
}
