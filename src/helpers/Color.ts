/**
 * @athenna/logger
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { format } from 'node:util'
import { Is } from '#src/helpers/Is'
import { Chalk, ChalkInstance } from 'chalk'

export class Color {
  /**
   * Chalk instance.
   */
  public static chalk = new Chalk()

  /**
   * Paint as bold.
   */
  static get bold(): ChalkInstance {
    return Color.chalk.bold
  }

  /**
   * Paint as dim.
   */
  static get dim(): ChalkInstance {
    return Color.chalk.dim
  }

  /**
   * Paint as italic.
   */
  static get italic(): ChalkInstance {
    return Color.chalk.italic
  }

  /**
   * Paint as underline.
   */
  static get underline(): ChalkInstance {
    return Color.chalk.underline
  }

  /**
   * Paint as inverse.
   */
  static get inverse(): ChalkInstance {
    return Color.chalk.inverse
  }

  /**
   * Paint as strikethrough.
   */
  static get strikethrough(): ChalkInstance {
    return Color.chalk.strikethrough
  }

  /**
   * Paint as black.
   */
  static get black(): ChalkInstance {
    return Color.chalk.black
  }

  /**
   * Paint as gray.
   */
  static get gray(): ChalkInstance {
    return Color.chalk.gray
  }

  /**
   * Paint as purple.
   */
  static get purple(): ChalkInstance {
    return Color.chalk.hex('#7628c8')
  }

  /**
   * Paint as yellow.
   */
  static get yellow(): ChalkInstance {
    return Color.chalk.yellow
  }

  /**
   * Paint as cyan.
   */
  static get cyan(): ChalkInstance {
    return Color.chalk.cyan
  }

  /**
   * Paint as white.
   */
  static get white(): ChalkInstance {
    return Color.chalk.white
  }

  /**
   * Paint as orange.
   */
  static get orange(): ChalkInstance {
    return Color.chalk.hex('#f18b0e')
  }

  /**
   * Paint as green.
   */
  static get green(): ChalkInstance {
    return Color.chalk.green
  }

  /**
   * Paint as red.
   */
  static get red(): ChalkInstance {
    return Color.chalk.red
  }

  /**
   * Paint debugs.
   */
  static get trace(): ChalkInstance {
    return this.gray
  }

  /**
   * Paint debugs.
   */
  static get debug(): ChalkInstance {
    return this.purple
  }

  /**
   * Paint infos.
   */
  static get info(): ChalkInstance {
    return this.cyan
  }

  /**
   * Paint success.
   */
  static get success(): ChalkInstance {
    return this.green
  }

  /**
   * Paint warning.
   */
  static get warn(): ChalkInstance {
    return this.orange
  }

  /**
   * Paint error.
   */
  static get error(): ChalkInstance {
    return this.red
  }

  /**
   * Paint fatal.
   */
  static get fatal(): ChalkInstance {
    return Color.chalk.bgRed
  }

  /**
   * Paint http method.
   */
  static get GET(): ChalkInstance {
    return this.purple
  }

  /**
   * Paint http method.
   */
  static get HEAD(): ChalkInstance {
    return this.cyan
  }

  /**
   * Paint http method.
   */
  static get PUT(): ChalkInstance {
    return this.orange
  }

  /**
   * Paint http method.
   */
  static get PATCH(): ChalkInstance {
    return this.yellow
  }

  /**
   * Paint http method.
   */
  static get POST(): ChalkInstance {
    return this.green
  }

  /**
   * Paint http method.
   */
  static get DELETE(): ChalkInstance {
    return this.red
  }

  /**
   * Paint http method.
   */
  static get OPTIONS(): ChalkInstance {
    return this.cyan
  }

  /**
   * Remove all colors and special chars of string.
   */
  public static removeColors(value: string): string {
    return Color.chalk.reset(value).replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      '',
    )
  }

  /**
   * Remove all colors and special chars of string.
   */
  public static remove(value: string): string {
    return Color.removeColors(value)
  }

  /**
   * Paint by the http method.
   */
  public static httpMethod(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD',
  ): ChalkInstance {
    return this[method]
  }

  /**
   * Applies the engine to execute chalk methods inside string.
   *
   * @example
   * ```ts
   * const message = Color.apply('The file ({yellow, bold} "app/Services/Service") has been created.')
   *
   * console.log(message)
   * ```
   * Output:
   * ```bash
   * The file "app/Services/Service" has been created.
   * ```
   */
  public static apply(...args: string[]): string {
    if (!Is.String(args[0])) {
      return args[0]
    }

    let content = format(...args.filter(arg => arg !== undefined))

    const matches = content.match(/\({(.*?)} ([\s\S]*?)\)/g)

    if (!matches) {
      return content
    }

    matches.forEach(match => {
      const [chalkMethodsInBrackets, chalkMethodsString] = match.match(
        /\{(.*?)}/,
      ) as any

      const message = match
        .replace(chalkMethodsInBrackets, '')
        .replace(/\s*\(\s*|\s*\)\s*/g, '')

      const chalkMethodsArray = chalkMethodsString.replace(/\s/g, '').split(',')

      let chalk = new Chalk()

      chalkMethodsArray.forEach(chalkMethod => {
        if (!chalk[chalkMethod]) return

        chalk = chalk[chalkMethod]
      })

      content = content.replace(match, chalk(message))
    })

    return content
  }
}
