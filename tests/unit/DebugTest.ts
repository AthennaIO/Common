/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug } from '#src'
import { Test } from '@athenna/test'

export default class DebugTest {
  @Test()
  public async shouldBeAbleToCreateDebugLogsInAnyNamespace() {
    Debug.log('Hello debug API!')
    Debug.log({ hello: 'world' }, 'api:testing')
  }
}
