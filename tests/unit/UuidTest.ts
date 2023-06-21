/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4 } from 'uuid'
import { Uuid } from '#src'
import { Test, Context } from '@athenna/test'
import { InvalidUuidException } from '#src/exceptions/InvalidUuidException'

export default class UuidTest {
  private uuid = v4()

  @Test()
  public shouldVerifyIfUuidIsAValidUuidEventIfItIsPrefixed({ assert }: Context) {
    const tokenPrefixed = Uuid.generate('tkn')

    const verify = Uuid.verify(this.uuid)
    const verifyError = Uuid.verify('falseUuid')
    const verifyPrefixed = Uuid.verify(tokenPrefixed, true)

    assert.isTrue(verify)
    assert.isFalse(verifyError)
    assert.isTrue(verifyPrefixed)
  }

  @Test()
  public shouldGetOnlyTheTokenFromPrefixedUuid({ assert }: Context) {
    const tokenUuid = Uuid.generate('tkn')

    assert.equal(Uuid.getToken(tokenUuid), tokenUuid.replace('tkn::', ''))
  }

  @Test()
  public shouldGetOnlyThePrefixFromPrefixedUuid({ assert }: Context) {
    const tokenUuid = Uuid.generate('tkn')

    assert.isNull(Uuid.getPrefix(this.uuid), null)
    assert.equal(Uuid.getPrefix(tokenUuid), 'tkn')
  }

  @Test()
  public shouldInjectThePrefixInTheToken({ assert }: Context) {
    const tokenUuid = Uuid.generate()
    const injectedPrefix = Uuid.injectPrefix('tkn', tokenUuid)
    const tokenPrefixedChange = Uuid.changePrefix('any', injectedPrefix)

    assert.equal(injectedPrefix, `tkn::${tokenUuid}`)
    assert.equal(tokenPrefixedChange, `any::${tokenUuid}`)

    const useCase = () => Uuid.injectPrefix('tkn', 'not-valid-uuid')

    assert.throws(useCase, InvalidUuidException)
  }

  @Test()
  public shouldChangeOrGenerateANewToken({ assert }: Context) {
    const tokenGenerated = Uuid.changeOrGenerate('tkn', undefined)
    const tokenChanged = Uuid.changeOrGenerate('tkn', `ooo::${this.uuid}`)

    assert.isDefined(tokenGenerated)
    assert.equal(tokenChanged, `tkn::${this.uuid}`)

    const useCase = () => Uuid.changePrefix('tkn', 'not-valid-uuid')

    assert.throws(useCase, InvalidUuidException)
  }
}
