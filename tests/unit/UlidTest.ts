/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ulid } from 'ulid'
import { Ulid } from '#src'
import { Test, type Context } from '@athenna/test'
import { InvalidUlidException } from '#src/exceptions/InvalidUlidException'

export default class UlidTest {
  private ulid = ulid()

  @Test()
  public shouldVerifyIfUlidIsAValidUlidEventIfItIsPrefixed({ assert }: Context) {
    const tokenPrefixed = Ulid.generate('tkn')

    const verify = Ulid.verify(this.ulid)
    const verifyError = Ulid.verify('falseUlid')
    const verifyPrefixed = Ulid.verify(tokenPrefixed)

    assert.isTrue(verify)
    assert.isFalse(verifyError)
    assert.isTrue(verifyPrefixed)
  }

  @Test()
  public shouldGetOnlyTheTokenFromPrefixedUlid({ assert }: Context) {
    const tokenUlid = Ulid.generate('tkn')

    assert.equal(Ulid.getToken(tokenUlid), tokenUlid.replace('tkn::', ''))
  }

  @Test()
  public shouldGetOnlyThePrefixFromPrefixedUlid({ assert }: Context) {
    const tokenUlid = Ulid.generate('tkn')

    assert.isNull(Ulid.getPrefix(this.ulid), null)
    assert.equal(Ulid.getPrefix(tokenUlid), 'tkn')
  }

  @Test()
  public shouldInjectThePrefixInTheToken({ assert }: Context) {
    const tokenUlid = Ulid.generate()
    const injectedPrefix = Ulid.injectPrefix('tkn', tokenUlid)
    const tokenPrefixedChange = Ulid.changePrefix('any', injectedPrefix)

    assert.equal(injectedPrefix, `tkn::${tokenUlid}`)
    assert.equal(tokenPrefixedChange, `any::${tokenUlid}`)

    const useCase = () => Ulid.injectPrefix('tkn', 'not-valid-ulid')

    assert.throws(useCase, InvalidUlidException)
  }

  @Test()
  public shouldChangeOrGenerateANewToken({ assert }: Context) {
    const tokenGenerated = Ulid.changeOrGenerate('tkn', undefined)
    const tokenChanged = Ulid.changeOrGenerate('tkn', `ooo::${this.ulid}`)

    assert.isDefined(tokenGenerated)
    assert.equal(tokenChanged, `tkn::${this.ulid}`)

    const useCase = () => Ulid.changePrefix('tkn', 'not-valid-ulid')

    assert.throws(useCase, InvalidUlidException)
  }
}
