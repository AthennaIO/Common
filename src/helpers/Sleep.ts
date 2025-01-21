/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ms from 'ms'
import deasync from 'deasync'

export class SleepBuilder {
  private delays: number[] = []

  public constructor(private value: number) {}

  /**
   * Define that will be blocking the process for X milliseconds.
   *
   * @example
   * ```ts
   * await Sleep.for(100).milliseconds().wait()
   * ```
   */
  public milliseconds() {
    this.delays.push(this.value)

    return this
  }

  /**
   * Define that will be blocking the process for X seconds.
   *
   * @example
   * ```ts
   * await Sleep.for(5).seconds().wait()
   * ```
   */
  public seconds() {
    this.delays.push(ms(`${this.value}s`))

    return this
  }

  /**
   * Define that will be blocking the process for X minutes.
   *
   * @example
   * ```ts
   * await Sleep.for(1).minutes().wait()
   * ```
   */
  public minutes() {
    this.delays.push(ms(`${this.value}m`))

    return this
  }

  /**
   * Chain more time to wait.
   *
   * @example
   * ```ts
   * await Sleep.for(1).minutes().and(30).seconds().wait()
   * ```
   */
  public and(value: number) {
    this.value = value

    return this
  }

  /**
   * Sleep while a given closure returns false.
   *
   * @example
   * ```ts
   * await Sleep.for(1).minutes().while(() => !done)
   * ```
   */
  public async while(condition: () => boolean | Promise<boolean>) {
    while (await condition()) {
      this.wait()
    }
  }

  /**
   * Wait until the time has passed to release the process.
   *
   * @example
   * ```ts
   * await Sleep.for(1).minutes().and(30).seconds().wait()
   * ```
   */
  public async wait() {
    return Sleep.sleep(this.delays.athenna.sum())
  }
}

export class SleepBuilderSync {
  private delays: number[] = []

  public constructor(private value: number) {}

  /**
   * Define that will be blocking the process for X milliseconds.
   *
   * @example
   * ```ts
   * Sleep.forSync(100).milliseconds().wait()
   * ```
   */
  public milliseconds() {
    this.delays.push(this.value)

    return this
  }

  /**
   * Define that will be blocking the process for X seconds.
   *
   * @example
   * ```ts
   * Sleep.forSync(5).seconds().wait()
   * ```
   */
  public seconds() {
    this.delays.push(ms(`${this.value}s`))

    return this
  }

  /**
   * Define that will be blocking the process for X minutes.
   *
   * @example
   * ```ts
   * Sleep.forSync(1).minutes().wait()
   * ```
   */
  public minutes() {
    this.delays.push(ms(`${this.value}m`))

    return this
  }

  /**
   * Chain more time to wait.
   *
   * @example
   * ```ts
   * Sleep.forSync(1).minutes().and(30).seconds().wait()
   * ```
   */
  public and(value: number) {
    this.value = value

    return this
  }

  /**
   * Sleep while a given closure returns false.
   *
   * @example
   * ```ts
   * Sleep.for(1).minutes().while(() => !done)
   * ```
   */
  public while(condition: () => boolean) {
    while (condition()) {
      this.wait()
    }
  }

  /**
   * Wait until the time has passed to release the process.
   *
   * @example
   * ```ts
   * Sleep.forSync(1).minutes().and(30).seconds().wait()
   * ```
   */
  public wait() {
    return Sleep.sleepSync(this.delays.athenna.sum())
  }
}

export class Sleep {
  /**
   * Block the process until the time defined has passed.
   *
   * @example
   * ```ts
   * await Sleep.for(1).minutes().wait()
   *
   * // This will not run until 1 minute has passed.
   * console.log('hello')
   * ```
   */
  public static for(value: number) {
    return new SleepBuilder(value)
  }

  /**
   * Same as `for()` method, but instead work with synchronous
   * functions to wait the time to pass.
   *
   * @example
   * ```ts
   * Sleep.forSync(1).minutes().wait()
   *
   * // This will not run until 1 minute has passed.
   * console.log('hello')
   * ```
   */
  public static forSync(value: number) {
    return new SleepBuilderSync(value)
  }

  /**
   * Simpler sleep function implementation that only works
   * with milliseconds.
   *
   * @example
   * ```ts
   * await Sleep.sleep(100)
   *
   * // This will not run until 100 milliseconds has passed.
   * console.log('hello')
   * ```
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Same as `sleep()` method, but synchronous wait for the time
   * to be passed.
   *
   * @example
   * ```ts
   * Sleep.sleepSync(100)
   *
   * // This will not run until 100 milliseconds has passed.
   * console.log('hello')
   * ```
   */
  public static sleepSync(ms: number) {
    return deasync.sleep(ms)
  }
}
