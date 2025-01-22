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

    const possibleValues = Array.from({ length: 51 }, (_, i) => 10 + i)

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeSeconds({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(1).seconds().wait()

    const endDate = Date.now()

    const possibleValues = Array.from({ length: 51 }, (_, i) => 1000 + i)

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeMinutes({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(0.01).minutes().wait()

    const endDate = Date.now()

    const possibleValues = Array.from({ length: 51 }, (_, i) => 600 + i)

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeSecondsFollowedByMilliseconds({ assert }: Context) {
    const startDate = Date.now()

    await Sleep.for(1).seconds().and(100).milliseconds().wait()

    const endDate = Date.now()

    const possibleValues = Array.from({ length: 51 }, (_, i) => 1100 + i)

    assert.isTrue(possibleValues.includes(endDate - startDate))
  }
}
