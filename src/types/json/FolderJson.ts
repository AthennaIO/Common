/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FileJson } from '#src/types'

export interface FolderJson {
  dir: string
  name: string
  base: string
  path: string
  files: FileJson[]
  // eslint-disable-next-line no-use-before-define
  folders: FolderJson[]
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
