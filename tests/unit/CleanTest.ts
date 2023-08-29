/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Clean } from '#src'
import { Test, type Context } from '@athenna/test'

export default class CleanTest {
  public getArray() {
    return [1, null, 2, undefined, 3, { joao: 'joao', lenon: null }, '', {}, ['hey', null]]
  }

  public getObject() {
    return {
      key: 'value',
      emptyArray: [],
      emptyObject: {},
      nullValue: null,
      undefinedValue: undefined,
      subObject: { joao: 'joao', array: [null] },
      subArray: [null, 1, { joao: 'joao', lenon: null }, {}, [], ['hey', null]],
    }
  }

  @Test()
  public async shouldCleanAllFalsyValuesFromArray({ assert }: Context) {
    const array = this.getArray()

    assert.deepEqual(Clean.cleanArray(array), [1, 2, 3, { joao: 'joao', lenon: null }, {}, ['hey', null]])
  }

  @Test()
  public async shouldCleanAllFalsyAndEmptyValuesFromArray({ assert }: Context) {
    const array = this.getArray()

    assert.deepEqual(Clean.cleanArray(array, { removeEmpty: true }), [
      1,
      2,
      3,
      { joao: 'joao', lenon: null },
      ['hey', null],
    ])
  }

  @Test()
  public async shouldCleanAllFalsyAndEmptyValuesRecursivelyFromArray({ assert }: Context) {
    const array = this.getArray()

    assert.deepEqual(Clean.cleanArray(array, { removeEmpty: true, recursive: true }), [
      1,
      2,
      3,
      { joao: 'joao' },
      ['hey'],
    ])
  }

  @Test()
  public async shouldCleanAllFalsyValuesFromObject({ assert }: Context) {
    const object = this.getObject()

    assert.deepEqual(Clean.cleanObject(object), {
      key: 'value',
      emptyArray: [],
      emptyObject: {},
      subObject: { joao: 'joao', array: [null] },
      subArray: [null, 1, { joao: 'joao', lenon: null }, {}, [], ['hey', null]],
    })
  }

  @Test()
  public async shouldCleanAllFalsyAndEmptyValuesFromObject({ assert }: Context) {
    const object = this.getObject()

    assert.deepEqual(Clean.cleanObject(object, { removeEmpty: true }), {
      key: 'value',
      subObject: { joao: 'joao', array: [null] },
      subArray: [null, 1, { joao: 'joao', lenon: null }, {}, [], ['hey', null]],
    })
  }

  @Test()
  public async shouldCleanAllFalsyAndEmptyValuesFromObjectRecursively({ assert }: Context) {
    const object = this.getObject()

    assert.deepEqual(Clean.cleanObject(object, { removeEmpty: true, recursive: true }), {
      key: 'value',
      subObject: { joao: 'joao' },
      subArray: [1, { joao: 'joao' }, ['hey']],
    })
  }
}
