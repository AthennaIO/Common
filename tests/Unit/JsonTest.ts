/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec, Json } from '#src'
import { test } from '@japa/runner'

test.group('Json Class', () => {
  test('should return a deep copy from the object', async ({ assert }) => {
    const object = {
      test: 'hello',
      hello: () => 'hy',
    }

    const objectCopy = Json.copy(object)

    objectCopy.test = 'hello from copy'
    objectCopy.hello = () => 'hy from copy'

    assert.equal(object.test, 'hello')
    assert.equal(object.hello(), 'hy')
    assert.equal(objectCopy.test, 'hello from copy')
    assert.equal(objectCopy.hello(), 'hy from copy')
  })

  test('should return all json found inside of the string', async ({ assert }) => {
    const text = 'this is a string with a json inside of it {"text":"hello"} and one more json {"hello":"world"}'

    assert.deepEqual(Json.getJson(text), ['{"text":"hello"}', '{"hello":"world"}'])
  })

  test('should return null if JSON parse goes wrong', async ({ assert }) => {
    const text = 'a string that is not a valid JSON'

    assert.isNull(Json.parse(text))
  })

  test('should return the object when string is a valid JSON', async ({ assert }) => {
    const text = '{"text":"hello"}'

    assert.deepEqual(Json.parse(text), { text: 'hello' })
  })

  test('should clean data object removing all keys that are not in key array', async ({ assert }) => {
    const data = {
      hello: 'hello',
      world: 'world',
    }

    assert.deepEqual(Json.fillable(data, ['world']), { world: 'world' })
    assert.deepEqual(Json.fillable(data, ['world', 'someNullWord']), { world: 'world' })
  })

  test('should be able to observe changes of an object', async ({ assert }) => {
    const object = {
      joao: 'lenon',
      hello: 'world',
    }

    const objectProxy = Json.observeChanges(
      object,
      (value, arg1, arg2, arg3) => {
        assert.equal(value, 'oi')
        assert.equal(arg1, 1)
        assert.equal(arg2, 2)
        assert.equal(arg3, 3)
      },
      1,
      2,
      3,
    )

    objectProxy.joao = 'oi'

    await Exec.sleep(2000)
  })

  test('should be able to remove duplicated values from array', async ({ assert }) => {
    const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    assert.deepEqual(Json.removeDuplicated(array), [1, 2, 3, 4, 5])
  })

  test('should be able to raffle any value from the array', async ({ assert }) => {
    const array = [1, 2, 3, 4, 5]

    const raffledValue = Json.raffle(array)

    assert.isDefined(array.find(a => a === raffledValue))
  })

  test('should be able to get nested properties from object', async ({ assert }) => {
    const object = {
      hello: {
        world: {
          value: {
            hello: 'Hello World!',
          },
        },
      },
    }

    const value = Json.get(object, 'hello.world.value.hello')
    const undefinedValue = Json.get(object, 'hello.worlld.value.hello')
    const defaultValue = Json.get(object, 'hello.worlld.value.hello', 'Hi World!')
    const fullObject = Json.get(object, '')
    const defaultValueInObjectNull = Json.get(undefined, '', { hello: 'world' })
    const falsyDefaultValue = Json.get(object, 'hello.not-found', false)

    assert.equal(value, 'Hello World!')
    assert.equal(defaultValue, 'Hi World!')
    assert.isUndefined(undefinedValue)
    assert.deepEqual(object, fullObject)
    assert.deepEqual(defaultValueInObjectNull, { hello: 'world' })
    assert.deepEqual(falsyDefaultValue, false)
  })

  test('should be able to build objects using the ObjectBuilder', async ({ assert }) => {
    const me = Json.builder()
      .set('name', 'João Lenon')
      .set('email', 'lenon@athenna.io')
      .set('age', 22)
      .set('details.car.color', 'white')
      .set('details.car.name', 'BMW E46 M3')
      .set('details.favoriteColor', 'black')
      .set('details.job', 'Software Engineer')
      .set('createdAt', new Date('2000-12-09').toISOString())
      .set('updatedAt', new Date('2022-12-09').toISOString())
      .set('deletedAt', null)
      .set('willNotBeSet', undefined)
      .set('willSetDefaultOne', null, 'Hello')
      .set('willSetDefaultTwo', undefined, 'Hello')
      .get()

    assert.deepEqual(me, {
      name: 'João Lenon',
      email: 'lenon@athenna.io',
      age: 22,
      details: {
        car: {
          color: 'white',
          name: 'BMW E46 M3',
        },
        job: 'Software Engineer',
        favoriteColor: 'black',
      },
      createdAt: '2000-12-09T00:00:00.000Z',
      updatedAt: '2022-12-09T00:00:00.000Z',
      deletedAt: null,
      willSetDefaultOne: 'Hello',
      willSetDefaultTwo: 'Hello',
    })

    const ignores = Json.builder({ ignoreNull: true, ignoreUndefined: true, defaultValue: 'Global' })
      .set('name', null)
      .set('email', undefined)
      .set('age', 0)
      .set('createdAt', undefined, new Date('2000-12-09').toISOString())
      .get()

    assert.deepEqual(ignores, {
      name: 'Global',
      email: 'Global',
      age: 0,
      createdAt: '2000-12-09T00:00:00.000Z',
    })
  })

  test('should be able to build objects and get the values using nested key path', async ({ assert }) => {
    const builder = Json.builder()
      .set('name', 'João Lenon')
      .set('email', 'lenon@athenna.io')
      .set('age', 22)
      .set('details.car.color', 'white')
      .set('details.car.name', 'BMW E46 M3')
      .set('details.favoriteColor', 'black')
      .set('details.job', 'Software Engineer')
      .set('createdAt', new Date('2000-12-09').toISOString())
      .set('updatedAt', new Date('2022-12-09').toISOString())
      .set('deletedAt', null)
      .set('willNotBeSet', undefined)
      .set('willSetDefaultOne', null, 'Hello')
      .set('willSetDefaultTwo', undefined, 'Hello')

    assert.equal(builder.get('details.car.name'), 'BMW E46 M3')
    assert.equal(builder.get('deletedAt', new Date('2022-12-09').toISOString()), null)
    assert.equal(
      builder.get('deletedAt.notFound', new Date('2022-12-09').toISOString()),
      new Date('2022-12-09').toISOString(),
    )
  })

  test('should be able to build objects and validate the values using nested key path', async ({ assert }) => {
    const builder = Json.builder()
      .set('name', 'João Lenon')
      .set('email', 'lenon@athenna.io')
      .set('age', 22)
      .set('details.car.color', 'white')
      .set('details.car.name', 'BMW E46 M3')
      .set('details.favoriteColor', 'black')
      .set('details.job', 'Software Engineer')
      .set('createdAt', new Date('2000-12-09').toISOString())
      .set('updatedAt', new Date('2022-12-09').toISOString())
      .set('deletedAt', null)
      .set('willNotBeSet', undefined)
      .set('willSetDefaultOne', null, 'Hello')
      .set('willSetDefaultTwo', undefined, 'Hello')

    assert.isTrue(builder.existsAll('name', 'details.car', 'details.car.name'))
    assert.isFalse(builder.notExistsAll('name', 'details.car', 'details.car.name'))

    assert.isTrue(builder.is('details.car.name', 'FAKE1', 'FAKE2', 'BMW E46 M3'))
    assert.isFalse(builder.is('details.car.name', 'FAKE1', 'FAKE2', 'FAKE3'))
    assert.isFalse(builder.isNot('details.car.name', 'FAKE1', 'FAKE2', 'BMW E46 M3'))
    assert.isTrue(builder.isNot('details.car.name', 'FAKE1', 'FAKE2', 'FAKE3'))

    assert.isTrue(builder.is('details.car.name', ['FAKE1', 'FAKE2', 'BMW E46 M3']))
    assert.isFalse(builder.is('details.car.name', ['FAKE1', 'FAKE2', 'FAKE3']))
    assert.isFalse(builder.isNot('details.car.name', ['FAKE1', 'FAKE2', 'BMW E46 M3']))
    assert.isTrue(builder.isNot('details.car.name', ['FAKE1', 'FAKE2', 'FAKE3']))
  })

  test('should be able to set not referenced values in ObjectBuilder', async ({ assert }) => {
    const user = { name: 'Victor' }
    const builder = Json.builder({ referencedValues: false }).set('user', user)

    assert.equal(builder.get('user.name'), 'Victor')
    user.name = 'João'
    assert.equal(builder.get('user.name'), 'Victor')
  })

  test('should be able to set referenced values in ObjectBuilder', async ({ assert }) => {
    const user = { name: 'Victor' }
    const builder = Json.builder({ referencedValues: true }).set('user', user)

    assert.equal(builder.get('user.name'), 'Victor')
    user.name = 'João'
    assert.equal(builder.get('user.name'), 'João')
  })
})
