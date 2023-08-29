/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/helpers/Exception'

export class NodeCommandException extends Exception {
  public constructor(command: string, error: any) {
    let help = ''

    help = help.concat(`Command stdout:\n\n    ${error.stdout}`)
    help = help.concat(`\n\n  Command stderr:\n\n    ${error.stderr}`)

    delete error.stdout
    delete error.stderr

    help = help.concat(`\n\n  Error name:\n\n    ${error.name}}`)
    help = help.concat(`\n\n  Error message:\n\n    ${error.message}}`)
    help = help.concat(`\n\n  Error stack:\n\n    ${error.stack}}`)

    super({
      help,
      code: 'E_NODE_EXEC',
      message: `Error has occurred when executing the command "${command}"`,
    })
  }
}
