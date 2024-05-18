/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Enum } from '#src'
import { Test, type Context } from '@athenna/test'

export default class EnumTest {
  @Test()
  public async shouldBeAbleToCreateAEnumAndReadItValues({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 'PENDING'
      static BLOCKED = 'BLOCKED'
      static DELETED = 'DELETED'
    }

    assert.deepEqual(Status.PENDING, 'PENDING')
    assert.deepEqual(Status.BLOCKED, 'BLOCKED')
    assert.deepEqual(Status.DELETED, 'DELETED')
  }

  @Test()
  public async shouldBeAbleToSetNumbersAsEnumValue({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
    }

    assert.deepEqual(Status.PENDING, 0)
    assert.deepEqual(Status.BLOCKED, 1)
    assert.deepEqual(Status.DELETED, 2)
  }

  @Test()
  public async shouldBeAbleToGetAllKeysFromEnum({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
    }

    assert.deepEqual(Status.keys(), ['PENDING', 'BLOCKED', 'DELETED'])
  }

  @Test()
  public async shouldBeAbleToGetAllValuesFromEnum({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
    }

    assert.deepEqual(Status.values(), [0, 1, 2])
  }

  @Test()
  public async shouldBeAbleToGetAllEntriesFromEnum({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
    }

    assert.deepEqual(Status.entries(), [
      ['PENDING', 0],
      ['BLOCKED', 1],
      ['DELETED', 2]
    ])
  }

  @Test()
  public async shouldIgnoreAllKeysThatAreNotUpperCase({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
      static approved = 3
    }

    assert.deepEqual(Status.entries(), [
      ['PENDING', 0],
      ['BLOCKED', 1],
      ['DELETED', 2]
    ])
  }

  @Test()
  public async shouldIgnoreAllUpperCaseGetters({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
      static get HELLO() {
        return 'hello'
      }
    }

    assert.deepEqual(Status.entries(), [
      ['PENDING', 0],
      ['BLOCKED', 1],
      ['DELETED', 2]
    ])
  }

  @Test()
  public async shouldIgnoreAllUpperCaseMethods({ assert }: Context) {
    class Status extends Enum {
      static PENDING = 0
      static BLOCKED = 1
      static DELETED = 2
      static HELLO() {
        return 'hello'
      }
    }

    assert.deepEqual(Status.entries(), [
      ['PENDING', 0],
      ['BLOCKED', 1],
      ['DELETED', 2]
    ])
  }
}
