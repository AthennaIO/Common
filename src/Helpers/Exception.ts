/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Youch from 'youch'
import chalk from 'chalk'
import changeCase from 'change-case'
import YouchTerminal from 'youch-terminal'

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
  /**
   * This method returns the Exception as
   * an ErrorConstructor class. This method
   * is very usefull when doing assertions.
   *
   * @example
   *  assert.throws(() => throw new Exception(), Exception.erc())
   */
  public static erc(): ErrorConstructor {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this
  }

  public code?: string
  public help?: any
  public status?: number

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
    prefix?: string
    hideMessage?: boolean
    hideErrorTitle?: boolean
    displayShortPath?: boolean
    displayMainFrameOnly?: boolean
  }): Promise<string> {
    options = Options.create(options, {
      displayShortPath: false,
      prefix: '',
      hideErrorTitle: false,
      hideMessage: false,
      displayMainFrameOnly: false,
    })

    this.name = this.code
    const helpKey = chalk.green.bold('HELP')
    const messageKey = chalk.yellow.bold('MESSAGE')

    if (this.message && this.message !== '') {
      this.message = `${messageKey}\n   ${this.message}`
    }

    if (this.help && this.help !== '') {
      this.message = `${this.message}\n\n ${helpKey}\n   ${this.help}`
    }

    const pretty = await new Youch(this, {}).toJSON()

    if (!pretty.error.frames.find(frame => frame.isApp)) {
      pretty.error.frames = pretty.error.frames.map(frame => {
        frame.isApp = true
        return frame
      })
    }

    return YouchTerminal(pretty, options).concat('\n')
  }
}
