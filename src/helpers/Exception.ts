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

import { Color } from '#src/helpers/Color'
import { Options } from '#src/helpers/Options'
import type { ExceptionJson } from '#src/types'
import { Is } from '@athenna/common'

export class Exception extends Error {
  public code?: string
  public help?: any
  public status?: number
  public details?: any[]
  public isAthennaException = true

  /**
   * Creates a new instance of Exception.
   */
  public constructor(options?: ExceptionJson) {
    super(options?.message || '')

    options = Options.create(options, {
      message: '',
      status: 500,
      help: null,
      stack: null,
      name: this.constructor.name,
      code: changeCase.constantCase(this.constructor.name)
    })

    this.name = options.name
    this.code = options.code
    this.status = options.status
    this.message = options.message

    if (options.help) {
      this.help = options.help
    }

    if (options.details) {
      this.details = options.details
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
  public toJSON(stack = true): ExceptionJson {
    const json: ExceptionJson = {}

    json.code = this.code
    json.name = this.name
    json.status = this.status
    json.message = this.message

    if (this.help) json.help = this.help
    if (this.details) json.details = this.details
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
      framesMaxLimit: 3
    })

    const separator = Color.cyan('-----')
    const helpKey = Color.gray.bold.bgGreen(' HELP ')
    const detailsKey = Color.gray.bold.bgHex('#f18b0e')(' DETAILS ')
    const title = Color.gray.bold.bgRed(` ${this.code || this.name} `)

    let help = ''
    let message = `${title}\n\n${Color.apply(this.message)}`

    if (this.details && this.details.length) {
      message = `${message}\n\n${detailsKey}\n\n${this.details
        .map(detail => {
          if (Is.String(detail)) {
            return Color.orange(Color.apply(detail))
          }

          return Color.orange(JSON.stringify(detail, null, 2))
        })
        .join('\n')}`
    }

    if (this.help && this.help !== '') {
      help = `${helpKey}\n\n  ${Color.green(
        Color.apply(this.help)
      )}\n\n  ${separator}`
    } else {
      message = message.concat(`\n\n${separator}`)
    }

    const pretty = await new Youch(
      new Exception({
        help,
        message,
        code: this.code,
        stack: this.stack,
        status: this.status,
        details: this.details
      }),
      {}
    ).toJSON()

    return YouchTerminal(pretty, options)
  }
}
