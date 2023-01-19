/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class RouteMatchException extends Exception {
  constructor(routeWithParams: string, routeWithValues: string) {
    const content = `The route ${routeWithParams} does not match ${routeWithValues}`

    super(
      content,
      500,
      'E_ROUTE_MATCH',
      'Please open an issue in https://github.com/SecJS/Utils.git',
    )
  }
}
