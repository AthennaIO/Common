/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as changeCase from 'change-case'

import Youch from 'youch'
import YouchTerminal from 'youch-terminal'

import { Color } from '#src/Helpers/Color'
import { Options } from '#src/Helpers/Options'

export interface ExceptionJSON {
  code?: string
  name?: string
  status?: number
  message?: string
  help?: any
  stack?: string
}

export class Exception extends Error {
  public code?: string
  public help?: any
  public status?: number
  public isAthennaException = true

  /**
   * Creates a new instance of Exception.
   */
  public constructor(options?: ExceptionJSON) {
    super(options?.message || '')

    options = Options.create(options, {
      message: '',
      status: 500,
      help: null,
      stack: null,
      name: this.constructor.name,
      code: changeCase.constantCase(this.constructor.name),
    })

    this.name = options.name
    this.code = options.code
    this.status = options.status
    this.message = options.message

    if (options.help) {
      this.help = options.help
    }

    if (options.stack) {
      this.stack = options.stack
    } else {
      Exception.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Transform the exception to a valid JSON Object.
   */
  public toJSON(stack = true): ExceptionJSON {
    const json: ExceptionJSON = {}

    json.code = this.code
    json.name = this.name
    json.status = this.status
    json.message = this.message

    if (this.help) json.help = this.help
    if (stack) json.stack = this.stack

    return json
  }

  /**
   * Prettify the error using Youch API.
   */
  public async prettify(options?: {
    displayShortPath?: boolean
    prefix?: string
    hideErrorTitle?: boolean
    hideMessage?: boolean
    displayMainFrameOnly?: boolean
    framesMaxLimit?: number
  }): Promise<string> {
    options = Options.create(options, {
      displayShortPath: false,
      prefix: '',
      hideErrorTitle: true,
      hideMessage: false,
      displayMainFrameOnly: false,
      framesMaxLimit: 3,
    })

    const separator = Color.cyan('-----')
    const helpKey = Color.gray.bold.bgGreen(' HELP ')
    const title = Color.gray.bold.bgRed(` ${this.code || this.name} `)

    this.message = `${title}\n\n${Color.apply(this.message)}`

    if (this.help && this.help !== '') {
      this.help = `${helpKey}\n\n  ${Color.green(
        Color.apply(this.help),
      )}\n\n  ${separator}`
    } else {
      this.message = this.message.concat(`\n\n${separator}`)
    }

    const pretty = await new Youch(this, {}).toJSON()

    pretty.error.frames = pretty.error.frames.map(frame => {
      frame.isApp = true
      frame.isNative = true
      frame.isModule = true

      return frame
    })

    return YouchTerminal(pretty, options)
  }
}
