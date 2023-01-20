/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class NodeCommandException extends Exception {
  constructor(command: string, error: any) {
    let help = ''

    if (error.stdout) {
      help = help.concat(`Command stdout:\n\n${error.stdout}\n\n`)
    }

    if (error.stderr) {
      help = help.concat(`Command stderr:\n\n${error.stderr}\n\n`)
    }

    if (!error.stdout && !error.stdout) {
      help = `Command error:\n\n${JSON.stringify(error)}\n\n`
    }

    super({
      help,
      code: 'E_NODE_EXEC',
      message: `Error has occurred when executing the command "${command}"`,
    })
  }
}
