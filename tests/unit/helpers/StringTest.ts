/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from '#src'
import { AfterEach, Mock, Test, type Context } from '@athenna/test'
import { OrdinalNanException } from '#src/exceptions/OrdinalNanException'
import { NotFoundAthennaConfig } from '#src/exceptions/NotFoundAthennaConfig'

export default class StringTest {
  @AfterEach()
  public async afterEach() {
    Mock.restoreAll()
  }

  @Test()
  public async shouldBeAbleToHashStringValues({ assert }: Context) {
    const value = 'lenon'

    assert.deepEqual(
      String.hash(value, { key: 'secret1' }),
      'f48760e603c17c6abf2eff3dad2495b291ccbac943836518d0db3f41c3853f8b'
    )
    assert.deepEqual(
      String.hash(value, { key: 'secret2' }),
      'b2f908b59c94fafe5a1f72e3cbef5bd3c547f9a1c15a3b70953e62e46b676a9a'
    )
    assert.deepEqual(
      String.hash(value, { key: 'secret1', prefix: 'token_' }),
      'token_f48760e603c17c6abf2eff3dad2495b291ccbac943836518d0db3f41c3853f8b'
    )
    assert.deepEqual(
      String.hash(value, { key: 'secret2', prefix: 'token_' }),
      'token_b2f908b59c94fafe5a1f72e3cbef5bd3c547f9a1c15a3b70953e62e46b676a9a'
    )
  }

  @Test()
  public async shouldBeAbleToHashStringValuesUsingConfigAppKey({ assert }: Context) {
    const value = 'lenon'

    global.Config = null

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Mock.when(global, 'Config').value({
      get: () => 'secret1'
    })

    assert.deepEqual(String.hash(value), 'f48760e603c17c6abf2eff3dad2495b291ccbac943836518d0db3f41c3853f8b')
  }

  @Test()
  public async shouldThrownNotFoundAthennaConfigExceptionIfNotProvidingASecretKeyForHash({ assert }: Context) {
    const value = 'lenon'

    assert.throws(() => String.hash(value), NotFoundAthennaConfig)
  }

  @Test()
  public async shouldGenerateRandomStrings({ assert }: Context) {
    assert.lengthOf(String.random(10), 10)
    assert.lengthOf(String.random(20), 20)

    assert.lengthOf(String.random(40, { suffixCRC: true }), 40)

    assert.lengthOf(String.generateRandom(10), 10)
    assert.lengthOf(String.generateRandom(20), 20)
  }

  @Test()
  public async shouldGenerateRandomColorsInHexadecimalFormat({ assert }: Context) {
    assert.isTrue(String.generateRandomColor().startsWith('#'))
    assert.isTrue(String.generateRandomColor().startsWith('#'))
    assert.isTrue(String.generateRandomColor().startsWith('#'))
  }

  @Test()
  public async shouldNormalizeABase64StringValue({ assert }: Context) {
    assert.equal(String.normalizeBase64('+++///==='), '---___')
  }

  @Test()
  public async shouldChangeTheCaseOfTheString({ assert }: Context) {
    const string = 'Hello world' // Sentence case

    assert.equal(String.toCamelCase(string), 'helloWorld')
    assert.equal(String.toPascalCase(string), 'HelloWorld')
    assert.equal(String.toSnakeCase(string), 'hello_world')
    assert.equal(String.toSnakeCase(string, true), 'Hello_World')
    assert.equal(String.toConstantCase(string), 'HELLO_WORLD')
    assert.equal(String.toDotCase(string), 'hello.world')
    assert.equal(String.toDotCase(string, true), 'Hello.World')
    assert.equal(String.toSentenceCase(string), 'Hello world')
    assert.equal(String.toSentenceCase(string, true), 'Hello World')
    assert.equal(String.toNoCase(string), 'hello world')
    assert.equal(String.toDashCase(string), 'hello-world')
    assert.equal(String.toDashCase(string, true), 'Hello-World')
  }

  @Test()
  public async shouldTransformTheStringToSingularPluralAndOrdinal({ assert }: Context) {
    const string = 'Hello world'

    assert.equal(String.pluralize(string), 'Hello worlds')
    assert.equal(String.singularize(String.pluralize(string)), 'Hello world')

    assert.equal(String.ordinalize('1'), '1st')
    assert.equal(String.ordinalize('2'), '2nd')
    assert.equal(String.ordinalize('3'), '3rd')
    assert.equal(String.ordinalize('0.1'), '0.1th')
    assert.equal(String.ordinalize('10'), '10th')
    assert.equal(String.ordinalize('100'), '100th')
    assert.equal(String.ordinalize('1000'), '1000th')

    const useCase = () => String.ordinalize(Number.NaN)

    assert.throws(useCase, OrdinalNanException)
  }
}
