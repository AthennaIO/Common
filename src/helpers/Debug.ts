/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import debug from 'debug'
import chalk from 'chalk'

import { Is } from '#src/helpers/Is'

export class Debug {
  /**
   * Get the timestamp ms.
   */
  private static getTimestamp() {
    const localeStringOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    }

    return new Date(Date.now()).toLocaleString(undefined, localeStringOptions)
  }

  /**
   * Format the message using Chalk API.
   */
  public static format(message: string) {
    if (Is.Object(message)) {
      message = JSON.stringify(message)
    }

    const pid = chalk.yellow(`PID: ${process.pid}`)
    const timestamp = Debug.getTimestamp()

    return `${chalk.yellow(`[Debug]`)} - ${pid} - ${timestamp} ${chalk.yellow(
      message,
    )}`
  }

  /**
   * Format and throw the message in the stdout accordingly to the namespace.
   */
  public static log(message: any, namespace = 'api:main'): void {
    debug(namespace)(Debug.format(message))
  }
}
