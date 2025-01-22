/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Macroable } from '#src'
import { Test, type Context } from '@athenna/test'

export default class MacroableTest {
  @Test()
  public async shouldBeAbleToAddAPropertyToTheClassPrototype({ expectTypeOf, assert }: Context) {
    class Parent extends Macroable {
      declare foo: string
    }

    Parent.macro('foo', 'bar')
    const parent = new Parent()

    expectTypeOf(Parent.macro<typeof Parent, 'foo'>).parameters.toEqualTypeOf<['foo', string]>()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expectTypeOf(Parent.macro<typeof Parent, 'bar'>).parameters.toEqualTypeOf<['bar', string]>()
    assert.equal(parent.foo, 'bar')
    assert.isFalse(Object.hasOwn(parent, 'foo'))
  }

  @Test()
  public async shouldBeAbleToAddAPropertyAsAFunctionToThePrototype({ expectTypeOf, assert }: Context) {
    class Parent extends Macroable {
      declare foo: () => string
      bar = 'bar'
    }

    Parent.macro('foo', function foo(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this.bar
    })

    const parent = new Parent()
    assert.equal(parent.foo(), 'bar')
    assert.isFalse(Object.hasOwn(parent, 'foo'))
  }

  @Test()
  public async shouldBeAbleToAddAPropertyAsAnArrowFunctionToThePrototype({ assert }: Context) {
    class Parent extends Macroable {
      declare foo: () => string
      bar = 'bar'
    }

    Parent.macro('foo', () => {
      return 'bar'
    })

    const parent = new Parent()
    assert.equal(parent.foo(), 'bar')
  }

  @Test()
  public async shouldBeAbleToAddAGetterToThePrototype({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter('getCount', function getCount() {
      counter++
      return counter
    })

    const parent = new Parent()
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 3)
    assert.isFalse(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 3)
  }

  @Test()
  public async shouldBeAbleToAddASingletonGetterToThePrototype({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 1)
    assert.equal(parent.getCount, 1)
    assert.isTrue(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 1)
  }

  @Test()
  public async shouldBeAbleToCallGetterWithParentThisContext({ expectTypeOf, assert }: Context) {
    class Parent extends Macroable {
      declare getter: any
    }

    Parent.getter('getter', function getter(this: Parent) {
      expectTypeOf(this).toEqualTypeOf<Parent>()
      return this
    })

    const parent = new Parent()
    assert.equal(parent.getter, parent)
  }

  @Test()
  public async shouldBeAbleToReAssignGetterInPrototype({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    Parent.getter(
      'getCount',
      function getCount() {
        counter += 2
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 2)
    assert.equal(parent.getCount, 2)
    assert.isTrue(Object.hasOwn(parent, 'getCount'))
    assert.equal(counter, 2)
  }

  @Test()
  public async shouldThrowWhenTryingToOverwriteInstanceValueWithALiteralValue({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.equal(parent.getCount, 1)
    assert.throws(() => (parent.getCount = 2), /Cannot assign to read only property/)
  }

  @Test()
  public async shouldThrowWhenTryingToOverwriteGetterWithALiteralValue({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare getCount: number
    }

    Parent.getter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    const parent = new Parent()
    assert.throws(() => (parent.getCount = 2), /Cannot set property/)
  }

  @Test()
  public async shouldBeAbleToAddAStaticPropertyToTheClass({ expectTypeOf, assert }: Context) {
    class Parent extends Macroable {
      declare static foo: string
    }

    Parent.staticMacro('foo', 'bar')

    expectTypeOf(Parent.staticMacro<typeof Parent, 'foo'>).parameters.toEqualTypeOf<['foo', string]>()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expectTypeOf(Parent.staticMacro<typeof Parent, 'bar'>).parameters.toEqualTypeOf<['bar', string]>()
    assert.equal(Parent.foo, 'bar')
  }

  @Test()
  public async shouldBeAbleToAddAStaticPropertyAsAFunctionToTheClass({ expectTypeOf, assert }: Context) {
    class Parent extends Macroable {
      declare static foo: () => string
      static bar = 'bar'
    }

    Parent.staticMacro('foo', function foo(this: typeof Parent) {
      expectTypeOf(this).toEqualTypeOf<typeof Parent>()
      return this.bar
    })

    assert.equal(Parent.foo(), 'bar')
  }

  @Test()
  public async shouldBeAbleToAddAStaticPropertyAsAnArrowFunctionToTheClass({ assert }: Context) {
    class Parent extends Macroable {
      declare static foo: () => string
      static bar = 'bar'
    }

    Parent.staticMacro('foo', () => {
      return 'bar'
    })

    assert.equal(Parent.foo(), 'bar')
  }

  @Test()
  public async shouldBeAbleToAddAStaticGetterToTheClass({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare static getCount: number
    }

    Parent.staticGetter('getCount', function getCount() {
      counter++
      return counter
    })

    assert.equal(Parent.getCount, 1)
    assert.equal(Parent.getCount, 2)
    assert.equal(Parent.getCount, 3)
    assert.equal(counter, 3)
  }

  @Test()
  public async shouldBeAbleToAddASingletonStaticGetterToTheClass({ assert }: Context) {
    let counter = 0

    class Parent extends Macroable {
      declare static getCount: number
    }

    Parent.staticGetter(
      'getCount',
      function getCount() {
        counter++
        return counter
      },
      true
    )

    assert.equal(Parent.getCount, 1)
    assert.equal(Parent.getCount, 1)
    assert.equal(Parent.getCount, 1)
    assert.isTrue(Object.hasOwn(Parent, 'getCount'))
    assert.equal(counter, 1)
  }
}
