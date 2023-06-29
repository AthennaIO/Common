/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Options } from '#src'
import { Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'

export default class OptionsTest {
  @Test()
  public async shouldBeAbleToCreateOptionsWithDefaultValuesForBuildingAPIs({ assert }: Context) {
    const api = (options: { name?: string; age?: number } = {}) => {
      options = Options.create(options, {
        name: 'lenon',
        age: 22,
      })

      return options
    }

    assert.deepEqual(api(), { name: 'lenon', age: 22 })
    assert.deepEqual(api({ name: 'victor' }), { name: 'victor', age: 22 })
    assert.deepEqual(api({ age: 23 }), { name: 'lenon', age: 23 })
    assert.deepEqual(api({ name: 'victor', age: 25 }), { name: 'victor', age: 25 })
  }

  @Test()
  public async shouldBeAbleToBindTheObjectIntoTheClosureSafely({ assert }: Context) {
    const object = {
      name: 'lenon',
      age: 22,
      getAge() {
        return this.age
      },
    }

    const closure = Options.bind(object, 'getAge')

    assert.equal(closure(), 22)
  }

  @Test()
  public async shouldBeAbleToExecuteSomeClosureWhenTheValueIsDefined({ assert }: Context) {
    let executed = false

    const resultOfClosure = Options.whenDefined('lenon', name => {
      executed = true
      return name
    })

    assert.isTrue(executed)
    assert.deepEqual(resultOfClosure, 'lenon')
  }

  @Test()
  public async shouldNotExecuteTheClosureIfValueIsNotDefined({ assert }: Context) {
    let executed = false

    const resultOfClosure = Options.whenDefined(undefined, name => {
      executed = true
      return name
    })

    assert.isFalse(executed)
    assert.deepEqual(resultOfClosure, undefined)
  }
}
