/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug } from '#src'
import { test } from '@japa/runner'

test.group('DebugTest', () => {
  test('should be able to create debug logs in any namespace', () => {
    Debug.log('Hello debug API!')
    Debug.log({ hello: 'world' }, 'api:testing')
  })
})
