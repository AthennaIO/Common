/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/helpers/Exception'

export class NotFoundFileException extends Exception {
  public constructor(filePath: string) {
    super({
      code: 'E_NOT_FOUND_FILE',
      message: `The file ${filePath} doesn't exist.`,
      help: `If your file doesn't exist, you will need to add a content to it as second parameter of File constructor: new File('${filePath}', 'Hello World!'). Also try using file.load() or file.loadSync() method to create the file.`
    })
  }
}
