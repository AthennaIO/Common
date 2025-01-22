/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { format } from 'node:util'
import { Is } from '#src/helpers/Is'
import { Chalk, type ChalkInstance } from 'chalk'
import { Macroable } from '#src/helpers/Macroable'

export class Color extends Macroable {
  /**
   * Chalk instance.
   */
  public static chalk = new Chalk()

  /**
   * Paint as bold.
   */
  public static get bold(): ChalkInstance {
    return Color.chalk.bold
  }

  /**
   * Paint as dim.
   */
  public static get dim(): ChalkInstance {
    return Color.chalk.dim
  }

  /**
   * Paint as italic.
   */
  public static get italic(): ChalkInstance {
    return Color.chalk.italic
  }

  /**
   * Paint as underline.
   */
  public static get underline(): ChalkInstance {
    return Color.chalk.underline
  }

  /**
   * Paint as inverse.
   */
  public static get inverse(): ChalkInstance {
    return Color.chalk.inverse
  }

  /**
   * Paint as strikethrough.
   */
  public static get strikethrough(): ChalkInstance {
    return Color.chalk.strikethrough
  }

  /**
   * Paint as black.
   */
  public static get black(): ChalkInstance {
    return Color.chalk.black
  }

  /**
   * Paint as gray.
   */
  public static get gray(): ChalkInstance {
    return Color.chalk.gray
  }

  /**
   * Paint as purple.
   */
  public static get purple(): ChalkInstance {
    return Color.chalk.hex('#7628c8')
  }

  /**
   * Paint as yellow.
   */
  public static get yellow(): ChalkInstance {
    return Color.chalk.yellow
  }

  /**
   * Paint as cyan.
   */
  public static get cyan(): ChalkInstance {
    return Color.chalk.cyan
  }

  /**
   * Paint as white.
   */
  public static get white(): ChalkInstance {
    return Color.chalk.white
  }

  /**
   * Paint as orange.
   */
  public static get orange(): ChalkInstance {
    return Color.chalk.hex('#f18b0e')
  }

  /**
   * Paint as green.
   */
  public static get green(): ChalkInstance {
    return Color.chalk.green
  }

  /**
   * Paint as red.
   */
  public static get red(): ChalkInstance {
    return Color.chalk.red
  }

  /**
   * Paint debugs.
   */
  public static get trace(): ChalkInstance {
    return this.gray
  }

  /**
   * Paint debugs.
   */
  public static get debug(): ChalkInstance {
    return this.purple
  }

  /**
   * Paint infos.
   */
  public static get info(): ChalkInstance {
    return this.cyan
  }

  /**
   * Paint success.
   */
  public static get success(): ChalkInstance {
    return this.green
  }

  /**
   * Paint warning.
   */
  public static get warn(): ChalkInstance {
    return this.orange
  }

  /**
   * Paint error.
   */
  public static get error(): ChalkInstance {
    return this.red
  }

  /**
   * Paint fatal.
   */
  public static get fatal(): ChalkInstance {
    return Color.chalk.bgRed
  }

  /**
   * Paint http method.
   */
  public static get GET(): ChalkInstance {
    return Color.chalk.bgHex('#7628c8').bold
  }

  /**
   * Paint http method.
   */
  public static get HEAD(): ChalkInstance {
    return Color.chalk.bgCyan.bold
  }

  /**
   * Paint http method.
   */
  public static get PUT(): ChalkInstance {
    return Color.chalk.bgHex('#f18b0e').bold
  }

  /**
   * Paint http method.
   */
  public static get PATCH(): ChalkInstance {
    return Color.chalk.bgYellow.bold
  }

  /**
   * Paint http method.
   */
  public static get POST(): ChalkInstance {
    return Color.chalk.bgGreen.bold
  }

  /**
   * Paint http method.
   */
  public static get DELETE(): ChalkInstance {
    return Color.chalk.bgRed.bold
  }

  /**
   * Paint http method.
   */
  public static get OPTIONS(): ChalkInstance {
    return Color.chalk.bgCyan.bold
  }

  /**
   * Get the color by status code.
   */
  public static statusCode(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) {
      return Color.chalk.bgGreen.bold(` ${statusCode} `)
    }

    if (statusCode >= 300 && statusCode < 400) {
      return Color.chalk.bgCyan.bold(` ${statusCode} `)
    }

    if (statusCode >= 400 && statusCode < 500) {
      return Color.chalk.bgHex('#f18b0e').bold(` ${statusCode} `)
    }

    if (statusCode >= 500) {
      return Color.chalk.bgRed.bold(` ${statusCode} `)
    }

    return Color.chalk.bgGray.bold(` ${statusCode} `)
  }

  /**
   * Remove all colors and special chars of string.
   */
  public static removeColors(value: string): string {
    return Color.chalk.reset(value).replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      ''
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
  public static httpMethod(method: string): string {
    return this[method](` ${method} `)
  }

  /**
   * Applies the engine to execute chalk methods inside string.
   *
   * @example
   * ```ts
   * const message = Color.apply('The file ({yellow, bold} "src/services/Service") has been created.')
   *
   * console.log(message)
   * ```
   * Output:
   * ```bash
   * The file "src/services/Service" has been created.
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
        /\{(.*?)}/
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
