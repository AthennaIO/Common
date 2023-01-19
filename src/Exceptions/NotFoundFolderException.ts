/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class NotFoundFolderException extends Exception {
  constructor(filePath: string) {
    const content = `The folder ${filePath} doesnt exist.`

    super(
      content,
      500,
      'E_NOT_FOUND_FILE',
      'Try using Folder.create method to create the folder.',
    )
  }
}
