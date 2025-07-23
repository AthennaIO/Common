/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Retrier } from '@humanwhocodes/retry'
import type { Exception } from '#src/helpers/Exception'

export class RetryBuilder {
  private fn: (error: Error | Exception) => Promise<any>
  private options: {
    timeout?: number
    maxDelay?: number
    concurrency?: number
  } = {}

  /**
   * Set the timeout for the retry.
   */
  public setTimeout(timeout: number) {
    this.options.timeout = timeout

    return this
  }

  /**
   * Set the maximum delay between retries.
   */
  public setMaxDelay(maxDelay: number) {
    this.options.maxDelay = maxDelay

    return this
  }

  /**
   * Set the number of concurrent retries.
   */
  public setConcurrency(concurrency: number) {
    this.options.concurrency = concurrency

    return this
  }

  /**
   * Create a new retry instance to retry a function when it
   * throws an error. Firstly define which errors should be
   * retried and then define the function to retry.
   *
   * @example
   * ```ts
   * const text = await Retry
   *    .build()
   *    .whenError(error => error.code === 'ENFILE')
   *    .retry(() => fs.readFile('README.md', 'utf8'))
   * ```
   */
  public whenError(fn: (error: Exception) => any | Promise<any>) {
    this.fn = fn

    return new Retrier(this.fn, this.options)
  }
}

export class Retry {
  /**
   * Create a new retry builder instance.
   */
  public static build() {
    return new RetryBuilder()
  }
}
