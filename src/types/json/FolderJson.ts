/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { File } from '#src/helpers/File'
import type { Folder } from '#src/helpers/Folder'

export interface FolderJson {
  dir: string
  name: string
  base: string
  path: string
  files: File[]
  // eslint-disable-next-line no-use-before-define
  folders: Folder[]
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  folderSize: string
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFolderExists: boolean
}
