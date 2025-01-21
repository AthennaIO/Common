/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Sleep } from '#src'
import { Test, type Context } from '@athenna/test'

export default class SleepTest {
  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeMilliseconds({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(10).milliseconds().wait()

    const endDate = Date.now()

    const possibleValues = [10, 11, 12, 13, 14, 15]

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeSeconds({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(1).seconds().wait()

    const endDate = Date.now()

    const possibleValues = [1000, 1001, 1002, 1003, 1004, 1005]

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeMinutes({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(0.01).minutes().wait()

    const endDate = Date.now()

    const possibleValues = [600, 601, 602, 603, 604, 605]

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeSecondsFollowedByMilliseconds({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(1).seconds().and(100).milliseconds().wait()

    const endDate = Date.now()

    const possibleValues = [1100, 1101, 1102, 1103, 1104, 1105]

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }
}
