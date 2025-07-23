/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Retry } from '#src'
import { readFile } from 'fs/promises'
import { Test, type Context } from '@athenna/test'

export default class RetryTest {
  @Test()
  public async shouldRetryAFunctionWhenItThrowsASpecificError({ assert }: Context) {
    await assert.rejects(() =>
      Retry.build()
        .setTimeout(500)
        .whenError(error => error.code === 'ENOENT')
        .retry(() => readFile('READMEE.md', 'utf8'))
    )
  }

  @Test()
  public async shouldRetryAFunctionWhenItThrowsASpecificErrorAndReturnTheResult({ assert }: Context) {
    const text = await Retry.build()
      .whenError(error => error.code === 'ENOENT')
      .retry(() => readFile('README.md', 'utf8'))

    assert.isDefined(text)
  }
}
