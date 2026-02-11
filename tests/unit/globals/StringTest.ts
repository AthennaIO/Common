/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from '#src'
import { Test, type Context } from '@athenna/test'

export default class GlobalStringTest {
  @Test()
  public async shouldBeAbleToUseStaticMethodsFromStringHelper({ assert }: Context) {
    const value = 'Hello model.id and some text'

    assert.isTrue(String.includesSome(value, 'model.id', 'nope'))
    assert.isTrue(String.includesEvery(value, 'Hello', 'model.id'))
  }

  @Test()
  public async shouldReturnTrueIfAtLeastOneTermMatchesUsingMultipleParams({ assert }: Context) {
    const value = 'Hello model.id and some other text'

    assert.isTrue(value.athenna.includesSome('model.id', 'nope'))
    assert.isTrue(value.athenna.includesSome('some', 'anything'))
    assert.isFalse(value.athenna.includesSome('not-found', 'nope'))
  }

  @Test()
  public async shouldReturnTrueIfAtLeastOneTermMatchesUsingAnArray({ assert }: Context) {
    const value = 'Hello model.id and some other text'

    assert.isTrue(value.athenna.includesSome(['model.id', 'random']))
    assert.isFalse(value.athenna.includesSome(['aaa', 'bbb']))
  }

  @Test()
  public async shouldReturnFalseForIncludesSomeWithEmptyTerms({ assert }: Context) {
    const value = 'anything'

    assert.isFalse(value.athenna.includesSome())
    assert.isFalse(value.athenna.includesSome([]))
  }

  @Test()
  public async shouldReturnTrueOnlyIfAllTermsMatchUsingMultipleParams({ assert }: Context) {
    const value = 'Hello model.id and some text'

    assert.isFalse(value.athenna.includesEvery('Hello', 'somethingElse'))
    assert.isTrue(value.athenna.includesEvery('Hello', 'model.id'))
    assert.isFalse(value.athenna.includesEvery('model.id', 'not-found'))
  }

  @Test()
  public async shouldReturnTrueOnlyIfAllTermsMatchUsingAnArray({ assert }: Context) {
    const value = 'Hello model.id and some text'

    assert.isTrue(value.athenna.includesEvery(['Hello', 'model.id']))
    assert.isFalse(value.athenna.includesEvery(['Hello', 'random']))
  }

  @Test()
  public async shouldReturnTrueForIncludesEveryWithEmptyTerms({ assert }: Context) {
    const value = 'anything'

    assert.isTrue(value.athenna.includesEvery())
    assert.isTrue(value.athenna.includesEvery([]))
  }
}
