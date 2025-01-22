/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Collection } from '#src'
import { Test, type Context } from '@athenna/test'

export default class GlobalArrayTest {
  @Test()
  public async shouldBeAbleToSumNumberValuesInsideAnArray({ assert }: Context) {
    const values = [1, 2, 3]

    assert.deepEqual(values.athenna.sum(), 6)
  }

  @Test()
  public async shouldBeAbleToSumStringValuesInsideAnArray({ assert }: Context) {
    const values = ['a', 'b', 'c']

    assert.deepEqual(values.athenna.sum(), 'abc')
  }

  @Test()
  public async shouldBeAbleToGetRandomValuesFromAnArray({ assert }: Context) {
    const values = ['a', 'b', 'c']

    assert.isTrue(values.includes(values.athenna.random()))
  }

  @Test()
  public async shouldBeAbleToRunClosureInParallelForEachValueInTheArray({ assert }: Context) {
    const values = [1, 2, 3]

    const results = await values.athenna.concurrently(async n => {
      return n + 1
    })

    assert.deepEqual(results, [2, 3, 4])
  }

  @Test()
  public async shouldBeAbleToRunClosureInParallelForEachValueInTheArrayAndGetIndexValue({ assert }: Context) {
    const values = [1, 2, 3]

    const results = await values.athenna.concurrently(async (n, i) => {
      return n + i + 1
    })

    assert.deepEqual(results, [2, 4, 6])
  }

  @Test()
  public async shouldBeAbleToRunClosureInParallelForEachValueInTheArrayAndGetTheArrayValues({ assert }: Context) {
    const values = [1, 2, 3]

    const results = await values.athenna.concurrently(async (n, i, items) => {
      return n + items[i]
    })

    assert.deepEqual(results, [2, 4, 6])
  }

  @Test()
  public async shouldBeAbleToRemoveDuplicatedValuesFromArray({ assert }: Context) {
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    assert.deepEqual(values.athenna.unique(), [1, 2, 3, 4, 5])
  }

  @Test()
  public async shouldBeAbleToRemoveDuplicatedValuesFromArrayByObjectKey({ assert }: Context) {
    const values = [{ name: 'lenon' }, { name: 'gabi' }, { name: 'lenon' }]

    assert.deepEqual(values.athenna.unique('name'), [{ name: 'lenon' }, { name: 'gabi' }])
  }

  @Test()
  public async shouldBeAbleToExecuteTheToJSONMethodInsideObjectsOfTheArray({ assert }: Context) {
    const models = [
      undefined,
      {},
      {
        toJSON: () => ({ id: 1 })
      }
    ]

    assert.deepEqual(models.athenna.toJSON(), [{ id: 1 }])
  }

  @Test()
  public async shouldBeAbleToExecuteTheToResourceMethodInsideObjectsOfTheArray({ assert }: Context) {
    const models = [
      undefined,
      {},
      {
        toResource: () => ({ id: 1 })
      },
      { toResource: criterias => criterias }
    ]

    assert.deepEqual(models.athenna.toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
  }

  @Test()
  public async shouldBeAbleToParseAnArrayToACollection({ assert }: Context) {
    const values = [1, 2, 3]
    const collection = values.athenna.toCollection()

    assert.instanceOf(collection, Collection)
    assert.deepEqual(collection.all(), values)
  }
}
