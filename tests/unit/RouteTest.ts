/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Route, Uuid } from '#src'
import { Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { RouteMatchException } from '#src/exceptions/RouteMatchException'

export default class RouteTest {
  @Test()
  public async shouldGetQueryParamsInStringFormatFromTheRoute({ assert }: Context) {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryString(path), '?page=1&limit=10&created_at=1995-12-17T03:24:00')
  }

  @Test()
  public async shouldRemoveAllQueryParamsFromTheRoute({ assert }: Context) {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.removeQueryParams(path), '/users/1/posts')
    assert.deepEqual(Route.removeQueryParams(Route.removeQueryParams(path)), '/users/1/posts')
  }

  @Test()
  public async shouldGetQueryParamsValueFromAnyRoute({ assert }: Context) {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryParamsValue(path), {
      page: '1',
      limit: '10',
      created_at: '1995-12-17T03:24:00',
    })
  }

  @Test()
  public async shouldReturnAnEmptyObjectAndArrayWhenRouteDoesntHaveQueryParams({ assert }: Context) {
    const path = '/users/1/posts'

    assert.deepEqual(Route.getQueryParamsName(path), [])
    assert.deepEqual(Route.getQueryParamsValue(path), {})
  }

  @Test()
  public async shouldGetQueryParamsNamesFromAnyRoute({ assert }: Context) {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryParamsName(path), ['page', 'limit', 'created_at'])
  }

  @Test()
  public async shouldGetParamsValueFromAnyRoute({ assert }: Context) {
    const pathWithParams = '/users/:id/posts/:post_id?page=1&limit=10'
    const pathWithValues = '/users/1/posts/2?page=1&limit=10'

    assert.deepEqual(Route.getParamsValue(pathWithParams, pathWithValues), {
      id: '1',
      post_id: '2',
    })
  }

  @Test()
  public async shouldThrowARouteMatchExceptionWhenRoutesAreDifferent({ assert }: Context) {
    const pathWithParams = '/users/:id/posts/:post_id'
    const pathWithValues = '/users/1/posts/2/extra'

    const useCase = () => Route.getParamsValue(pathWithParams, pathWithValues)

    assert.throws(useCase, RouteMatchException)
  }

  @Test()
  public async shouldGetParamsNamesFromAnyRoute({ assert }: Context) {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    assert.deepEqual(Route.getParamsName(path), ['id', 'post_id'])
  }

  @Test()
  public async shouldCreateAMatcherRegExpToRecognizeTheRoute({ assert }: Context) {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    const pathTest1 = '/users/1/posts/tests'
    const pathTest2 = '/users/1/posts/2/oi'
    const pathTest3 = `/users/${Uuid.generate()}/posts/1`

    const matcher = Route.createMatcher(path)

    assert.deepEqual(matcher, /^(?:\/users\b)(?:\/[\w-]+)(?:\/posts\b)(?:\/[\w-]+)$/)
    assert.isTrue(matcher.test(pathTest1))
    assert.isFalse(matcher.test(pathTest2))
    assert.isTrue(matcher.test(pathTest3))

    const path2 = '/'

    const matcher2 = Route.createMatcher(path2)

    assert.deepEqual(matcher2, /^[/]$/)
    assert.isTrue(matcher2.test(path2))
    assert.isFalse(matcher2.test(pathTest1))
    assert.isFalse(matcher2.test(pathTest2))
    assert.isFalse(matcher2.test(pathTest3))
  }
}
