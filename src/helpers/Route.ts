/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src/helpers/Parser'
import { Macroable } from '#src/helpers/Macroable'
import { RouteMatchException } from '#src/exceptions/RouteMatchException'

export class Route extends Macroable {
  /**
   * Get the query string in form data format.
   */
  public static getQueryString(route: string): string {
    const queryIndex = route.search(/\?(.*)/)

    if (queryIndex === -1) return null

    return route.substring(queryIndex)
  }

  /**
   * Remove query params from the route.
   */
  public static removeQueryParams(route: string): string {
    const queryString = this.getQueryString(route)

    if (!queryString) return route

    return route.replace(queryString, '')
  }

  /**
   * Get object with ?&queryParams values from route.
   */
  public static getQueryParamsValue(route: string): any {
    const queryString = this.getQueryString(route)

    if (!queryString) return {}

    return Parser.formDataToJson(queryString)
  }

  /**
   * Get array with ?&queryParams name from route.
   */
  public static getQueryParamsName(route: string): string[] {
    const queryNames = []
    let queryString = this.getQueryString(route)

    if (!queryString) return []

    queryString = queryString.replace('?', '')

    queryString
      .split('&')
      .forEach(queries =>
        queryNames.push(decodeURIComponent(queries.split('=')[0]))
      )

    return queryNames
  }

  /**
   * Get object with :params values from route.
   */
  public static getParamsValue(
    routeWithParams: string,
    routeWithValues: string
  ): any {
    routeWithParams = this.removeQueryParams(routeWithParams)
    routeWithValues = this.removeQueryParams(routeWithValues)

    const params = {}

    const routeWithParamsArray = routeWithParams.split('/')
    const routeWithValuesArray = routeWithValues.split('/')

    if (routeWithParamsArray.length !== routeWithValuesArray.length) {
      throw new RouteMatchException(routeWithParams, routeWithValues)
    }

    routeWithParamsArray.forEach((param, i) => {
      if (!param.startsWith(':')) return

      params[decodeURIComponent(param.replace(':', ''))] = decodeURIComponent(
        routeWithValuesArray[i]
      )
    })

    return params
  }

  /**
   * Get array with :params name from route.
   */
  public static getParamsName(route: string): string[] {
    route = this.removeQueryParams(route)

    const replaceDots = value => decodeURIComponent(value.replace(':', ''))

    return route.split('/').reduce((results, r) => {
      if (r.match(':')) {
        results.push(replaceDots(r))
      }

      return results
    }, [])
  }

  /**
   * Create a matcher RegExp for any route.
   */
  public static createMatcher(route: string): RegExp {
    route = this.removeQueryParams(route)

    const routeArray = route.split('/')

    routeArray.forEach((r, i) => {
      if (r === '') return
      if (r.startsWith(':')) {
        // Match with any word and - value RegExp
        routeArray[i] = `(?:\\/[\\w-]+)`

        return
      }

      // Match only with value of ${r} RegExp
      routeArray[i] = `(?:\\/${r}\\b)`
    })

    route = routeArray.join('')

    if (!route) route = '[/]'

    return new RegExp(`^${route}$`)
  }
}
