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

    help = help.concat(`\n\n  ${error.stack}`)

    super({
      help,
      code: 'E_NODE_EXEC',
      message: `Error has occurred when executing the command "${command}"`,
    })
  }
}
