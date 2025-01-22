/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import otpGenerator from 'otp-generator'

import { Otp } from '#src'
import { Test, type Context } from '@athenna/test'

export default class OtpTest {
  private otp = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    upperCaseAlphabets: true,
    lowerCaseAlphabets: false
  })

  @Test()
  public shouldGetOnlyTheTokenFromPrefixedOtp({ assert }: Context) {
    const tokenOtp = Otp.generate('tkn')

    assert.equal(Otp.getToken(tokenOtp), tokenOtp.replace('tkn::', ''))
  }

  @Test()
  public shouldGetOnlyThePrefixFromPrefixedOtp({ assert }: Context) {
    const tokenOtp = Otp.generate('tkn')

    assert.isNull(Otp.getPrefix(this.otp), null)
    assert.equal(Otp.getPrefix(tokenOtp), 'tkn')
  }

  @Test()
  public shouldInjectThePrefixInTheToken({ assert }: Context) {
    const tokenOtp = Otp.generate()
    const injectedPrefix = Otp.injectPrefix('tkn', tokenOtp)
    const tokenPrefixedChange = Otp.changePrefix('any', injectedPrefix)

    assert.equal(injectedPrefix, `tkn::${tokenOtp}`)
    assert.equal(tokenPrefixedChange, `any::${tokenOtp}`)
  }

  @Test()
  public shouldChangeOrGenerateANewToken({ assert }: Context) {
    const tokenGenerated = Otp.changeOrGenerate('tkn', undefined)
    const tokenChanged = Otp.changeOrGenerate('tkn', `ooo::${this.otp}`)

    assert.isDefined(tokenGenerated)
    assert.equal(tokenChanged, `tkn::${this.otp}`)
  }
}
