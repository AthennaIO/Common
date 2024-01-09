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

export default class CollectionTest {
  @Test()
  public async shouldBeAbleToRemoveDuplicatedValuesFromCollection({ assert }: Context) {
    const collection = new Collection([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])

    assert.deepEqual(collection.removeDuplicated(), [1, 2, 3, 4, 5])
  }

  @Test()
  public async shouldBeAbleToExtendCollectionsByStaticMacroMethod({ assert }: Context) {
    Collection.macro('test', () => ({ hello: 'world' }))

    assert.deepEqual(new Collection().test(), { hello: 'world' })
  }

  @Test()
  public async shouldBeAbleToExecuteTheToJSONMethodInsideObjectsOfCollections({ assert }: Context) {
    const models = [
      undefined,
      {},
      {
        toJSON: () => ({ id: 1 })
      }
    ]

    assert.deepEqual(models.toAthennaJSON(), [{ id: 1 }])
    assert.deepEqual(models.toAthennaCollection().toJSON(), [{ id: 1 }])
    assert.deepEqual(new Collection(models).toJSON(), [{ id: 1 }])
  }

  @Test()
  public async shouldBeAbleToExecuteTheToResourceMethodInsideObjectsOfCollections({ assert }: Context) {
    const models = [
      undefined,
      {},
      {
        toResource: () => ({ id: 1 })
      },
      { toResource: criterias => criterias }
    ]

    assert.deepEqual(models.toAthennaResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
    assert.deepEqual(models.toAthennaCollection().toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
    assert.deepEqual(new Collection(models).toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
  }
}
