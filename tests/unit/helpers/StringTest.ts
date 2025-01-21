/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from '#src'
import { Test, type Context } from '@athenna/test'
import { OrdinalNanException } from '#src/exceptions/OrdinalNanException'

export default class StringTest {
  @Test()
  public async shouldGenerateRandomStringsBySize({ assert }: Context) {
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
