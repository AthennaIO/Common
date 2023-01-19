/* eslint-disable no-extend-native */
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
  content?: string
  help?: string
  stack?: any
}

export class Exception extends Error {
  public code: string
  public status: number
  public content: string
  public help?: string

  /**
   * Creates a new instance of Exception.
   */
  public constructor(
    content: string,
    status = 500,
    code?: string,
    help?: string,
  ) {
    super(content)

    this.name = this.constructor.name
    this.status = status
    this.code = code || changeCase.constantCase(this.name)
    this.content = content

    if (help) {
      this.help = help
    }

    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Transform the exception to a valid JSON Object.
   */
  public toJSON(stack = true): ExceptionJSON {
    const json: ExceptionJSON = {}

    json.code = this.code
    json.name = this.name
    json.status = this.status
    json.content = this.content

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
