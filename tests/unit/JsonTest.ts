/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec, Json } from '#src'
import { Test, type Context } from '@athenna/test'

export default class JsonTest {
  @Test()
  public async shouldReturnADeepCopyFromObject({ assert }: Context) {
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
  }

  @Test()
  public async shouldReturnAllJsonFoundInsideOfTheString({ assert }: Context) {
    const text = 'this is a string with a json inside of it {"text":"hello"} and one more json {"hello":"world"}'

    assert.deepEqual(Json.getJson(text), ['{"text":"hello"}', '{"hello":"world"}'])
  }

  @Test()
  public async shouldReturnNullIfJSONParseGoesWrong({ assert }: Context) {
    const text = 'a string that is not a valid JSON'

    assert.isNull(Json.parse(text))
  }

  @Test()
  public async shouldReturnTheObjectWhenStringIsAValidJSON({ assert }: Context) {
    const text = '{"text":"hello"}'

    assert.deepEqual(Json.parse(text), { text: 'hello' })
  }

  @Test()
  public async shouldCleanDataObjectRemovingAllKeysThatAreNotInKeyArray({ assert }: Context) {
    const data = {
      hello: 'hello',
      world: 'world',
    }

    assert.deepEqual(Json.fillable(data, ['world']), { world: 'world' })
    assert.deepEqual(Json.fillable(data, ['world', 'someNullWord']), { world: 'world' })
  }

  @Test()
  public async shouldBeAbleToObserveChangesOfAnObject({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToGetNestedPropertiesFromObject({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToBuildObjectsUsingTheObjectBuilder({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToBuildObjectAndGetTheValuesUsigNestedKeyPath({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToBuildObjectsAndValidateTheValuesUsingNestedKeyPath({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToSetNotReferencedValuesInObjectBuilder({ assert }: Context) {
    const user = { name: 'Victor' }
    const builder = Json.builder({ referencedValues: false }).set('user', user)

    assert.equal(builder.get('user.name'), 'Victor')
    user.name = 'João'
    assert.equal(builder.get('user.name'), 'Victor')
  }

  @Test()
  public async shouldBeAbleToSetReferencedValuesInObjectBuilder({ assert }: Context) {
    const user = { name: 'Victor' }
    const builder = Json.builder({ referencedValues: true }).set('user', user)

    assert.equal(builder.get('user.name'), 'Victor')
    user.name = 'João'
    assert.equal(builder.get('user.name'), 'João')
  }

  @Test()
  public async shouldBeAbleToSetAnEntireObjectInSetMethodOfObjectBuilder({ assert }: Context) {
    const me = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 }).get()

    assert.deepEqual(me, {
      name: 'João Lenon',
      email: 'lenon@athenna.io',
      age: 22,
    })
  }

  @Test()
  public async shouldBeAbleToGetTheKeysOfTheObject({ assert }: Context) {
    const keys = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 }).keys()

    assert.deepEqual(keys, ['name', 'email', 'age'])
  }

  @Test()
  public async shouldNotBeAbleToChangeTheObjectKeysChangingTheReturnedValue({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const keys = builder.keys()

    keys[0] = 'full_name'

    assert.deepEqual(builder.keys(), ['name', 'email', 'age'])
  }

  @Test()
  public async shouldBeAbleToGetTheValuesOfTheObject({ assert }: Context) {
    const values = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 }).values()

    assert.deepEqual(values, ['João Lenon', 'lenon@athenna.io', 22])
  }

  @Test()
  public async shouldNotBeAbleToChangeTheObjectValuesChangingTheReturnedValue({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const values = builder.values()

    values[0] = 'Victor Tesoura'

    assert.deepEqual(builder.values(), ['João Lenon', 'lenon@athenna.io', 22])
  }

  @Test()
  public async shouldBeAbleToGetTheEntriesOfTheObject({ assert }: Context) {
    const entries = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 }).entries()

    assert.deepEqual(entries, [
      ['name', 'João Lenon'],
      ['email', 'lenon@athenna.io'],
      ['age', 22],
    ])
  }

  @Test()
  public async shouldNotBeAbleToChangeTheObjectEntriesChangingTheReturnedValue({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const entries = builder.entries()

    entries[0] = ['full_name', 'Victor Tesoura']

    assert.deepEqual(builder.entries(), [
      ['name', 'João Lenon'],
      ['email', 'lenon@athenna.io'],
      ['age', 22],
    ])
  }

  @Test()
  public async shouldBeAbleToExecuteAClosureForEachKeyInTheObject({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const keys = []

    builder.forEachKey(key => keys.push(key))

    assert.deepEqual(keys, ['name', 'email', 'age'])
  }

  @Test()
  public async shouldBeAbleToExecuteAClosureForEachKeyInTheObjectAndGetTheReturnedValue({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const keys = builder.forEachKey(key => key.toUpperCase())

    assert.deepEqual(keys, ['NAME', 'EMAIL', 'AGE'])
  }

  @Test()
  public async shouldBeAbleToExecuteAClosureForEachValueInTheObjectAndGetTheReturnedValue({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: '22' })
    const values = builder.forEachValue(value => value.toUpperCase())

    assert.deepEqual(values, ['JOÃO LENON', 'LENON@ATHENNA.IO', '22'])
  }

  @Test()
  public async shouldBeAbleToExecuteAClosureForEachEntryInTheObject({ assert }: Context) {
    const builder = Json.builder().set({ name: 'João Lenon', email: 'lenon@athenna.io', age: 22 })
    const entries = builder.forEachEntry(entry => [entry[0].toUpperCase(), entry[1]])

    assert.deepEqual(entries, [
      ['NAME', 'João Lenon'],
      ['EMAIL', 'lenon@athenna.io'],
      ['AGE', 22],
    ])
  }
}
