/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface FileJson {
  dir: string
  name: string
  base: string
  path: string
  mime: string
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  fileSize: string
  extension: string
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalHref: string
  originalFileExists: boolean
  content: Buffer | string
}
