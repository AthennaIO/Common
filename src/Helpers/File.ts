/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prependFile from 'prepend-file'

import {
  appendFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  promises,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
  ReadStream,
  WriteStream,
} from 'node:fs'

import { lookup } from 'mime-types'
import { pathToFileURL } from 'node:url'
import { Path } from '#src/Helpers/Path'
import { Json } from '#src/Helpers/Json'
import { randomBytes } from 'node:crypto'
import { Debug } from '#src/Helpers/Debug'
import { StreamOptions } from 'node:stream'
import { Parser } from '#src/Helpers/Parser'
import { Options } from '#src/Helpers/Options'
import { isAbsolute, parse, sep } from 'node:path'
import { NotFoundFileException } from '#src/Exceptions/NotFoundFileException'

export interface FileJSON {
  dir: string,
  name: string,
  base: string,
  path: string,
  mime: string,
  createdAt: Date,
  accessedAt: Date,
  modifiedAt: Date,
  fileSize: number,
  extension: string,
  isCopy: boolean,
  originalDir: string,
  originalName: string,
  originalPath: string,
  originalHref: string,
  originalFileExists: boolean,
  content: string,
}

export class File {
  /**
   * The original or faked file directory.
   */
  public dir: string

  /**
   * The original or faked file name.
   */
  public name: string

  /**
   * The original or faked file base.
   */
  public base: string

  /**
   * The original or faked file path.
   */
  public path: string

  /**
   * The original or faked href path.
   */
  public href: string

  /**
   * The file mime type.
   */
  public mime: string

  /**
   * Set if original or fake file exists.
   */
  public fileExists: boolean

  /**
   * Date when the file was created.
   */
  public createdAt: Date

  /**
   * Date when the file was last accessed.
   */
  public accessedAt: Date

  /**
   * Date when the file was last modified.
   */
  public modifiedAt: Date

  /**
   * The file size.
   */
  public fileSize: number

  /**
   * The file extension.
   */
  public extension: string

  /**
   * Set if file is a copy or not.
   */
  public isCopy: boolean

  /**
   * Original file directory.
   */
  public originalDir: string

  /**
   * Original file name.
   */
  public originalName: string

  /**
   * Original file base.
   */
  public originalBase: string

  /**
   * Original file path.
   */
  public originalPath: string

  /**
   * Original file href.
   */
  public originalHref: string

  /**
   * Set if original file exists.
   */
  public originalFileExists: boolean

  /**
   * The file content as Buffer.
   */
  public content: Buffer

  constructor(
    filePath: string,
    content: Buffer = undefined,
    mockedValues = false,
    isCopy = false,
  ) {
    const { ext, dir, name, base, mime, path } = File.parsePath(filePath)

    this.originalDir = dir
    this.originalName = name
    this.originalBase = base
    this.originalPath = path
    this.originalHref = pathToFileURL(path).href
    this.isCopy = isCopy
    this.originalFileExists = File.existsSync(this.originalPath) && !this.isCopy
    this.fileExists = this.originalFileExists
    this.content = content
    this.mime = mime
    this.extension = ext
    this.createFileValues(mockedValues)

    if (!this.originalFileExists && !this.content) {
      throw new NotFoundFileException(this.originalPath)
    }
  }

  /**
   * Remove the file it's existing or not.
   */
  static async safeRemove(filePath: string): Promise<void> {
    const { path } = File.parsePath(filePath)

    if (!(await File.exists(path))) {
      return
    }

    await promises.rm(path, { recursive: false })
  }

  /**
   * Verify if file exists.
   */
  static existsSync(filePath: string): boolean {
    const { path } = File.parsePath(filePath)

    return existsSync(path)
  }

  /**
   * Verify if file exists.
   */
  static async exists(filePath: string): Promise<boolean> {
    const { path } = File.parsePath(filePath)

    return promises
      .access(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Verify if path is from file or directory.
   */
  static isFileSync(path: string): boolean {
    const { path: parsedPath } = File.parsePath(path)

    return statSync(parsedPath).isFile()
  }

  /**
   * Verify if path is from file or directory.
   */
  static async isFile(path: string): Promise<boolean> {
    const { path: parsedPath } = File.parsePath(path)

    return promises.stat(parsedPath).then(stat => stat.isFile())
  }

  /**
   * Create fake file with determined size.
   */
  static async createFileOfSize(filePath: string, size: number): Promise<typeof File> {
    const { dir, path } = File.parsePath(filePath)

    await promises.mkdir(dir, { recursive: true })

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(path)

      writable.write(Buffer.alloc(Math.max(0, size - 2), 'l'))

      writable.end(() => resolve(this))
      writable.on('error', reject)
    })
  }

  /**
   * Parse the file path.
   */
  private static parsePath(filePath: string): {
    ext: string,
    path: string,
    root: string,
    mime: string,
    name: string,
    dir: string,
    base: string
  } {
    if (!isAbsolute(filePath)) {
      filePath = Path.this(filePath, 3)
    }

    const { base, dir, root } = parse(filePath)

    const baseArray = base.split('.')

    const name = baseArray.splice(0, 1)[0]
    const ext = baseArray.reduce((accumulator, current) => {
      return accumulator.concat('.').concat(current)
    }, '')

    const mime = lookup(dir + sep + base)

    return { ext, dir, name, root, base, mime, path: dir + sep + base }
  }

  /**
   * Returns the file as a JSON object.
   */
  toJSON(): FileJSON {
    return Json.copy({
      dir: this.dir,
      name: this.name,
      base: this.base,
      path: this.path,
      href: this.href,
      mime: this.mime,
      createdAt: this.createdAt,
      accessedAt: this.accessedAt,
      modifiedAt: this.modifiedAt,
      fileSize: this.fileSize,
      extension: this.extension,
      fileExists: this.fileExists,
      isCopy: this.isCopy,
      originalDir: this.originalDir,
      originalName: this.originalName,
      originalPath: this.originalPath,
      originalHref: this.originalHref,
      originalFileExists: this.originalFileExists,
      content: this.content,
    })
  }

  /**
   * Load or create the file.
   */
  loadSync(options?: { withContent?: boolean, isInternalLoad?: boolean }): File {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false,
    })

    if (!this.fileExists && this.content) {
      mkdirSync(this.dir, { recursive: true })
      writeFileSync(this.path, this.content)

      this.fileExists = true
    }

    if (this.fileSize && options.isInternalLoad) {
      return this
    }

    const fileStat = statSync(this.path)

    this.createdAt = fileStat.birthtime
    this.accessedAt = fileStat.atime
    this.modifiedAt = fileStat.mtime
    this.fileSize = Parser.sizeToByte(fileStat.size)

    if (!options.withContent) {
      this.content = undefined

      return this
    }

    // 200MB
    if (fileStat.size >= 2e8) {
      Debug.log(
        `File ${this.base} with ${this.fileSize} has been loaded in heap memory.`,
      )
    }

    this.content = this.content || readFileSync(this.path)

    return this
  }

  /**
   * Load or create the file.
   */
  async load(options: { withContent?: boolean, isInternalLoad?: boolean }): Promise<File> {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false,
    })

    if (!this.fileExists && this.content) {
      await promises.mkdir(this.dir, { recursive: true })

      await new Promise((resolve, reject) => {
        const writable = createWriteStream(this.path, { flags: 'w' })

        writable.write(this.content)

        writable.end(() => {
          this.content = undefined
          this.fileExists = true

          resolve(this)
        })

        writable.on('error', reject)
      })
    }

    if (this.fileSize && options.isInternalLoad) {
      return this
    }

    const fileStat = await promises.stat(this.path)

    this.accessedAt = fileStat.atime
    this.modifiedAt = fileStat.mtime
    this.createdAt = fileStat.birthtime
    this.fileSize = Parser.sizeToByte(fileStat.size)

    if (!options.withContent) {
      this.content = undefined

      return this
    }

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this.path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        this.content = Buffer.concat(chunks)

        // 200mb
        if (fileStat.size >= 2e8) {
          Debug.log(
            `File ${this.base} with ${this.fileSize} has been loaded in heap memory.`,
          )
        }

        resolve(this)
      })

      readable.on('error', reject)
    })
  }

  /**
   * Remove the file.
   */
  removeSync(): void {
    if (!this.fileExists) {
      throw new NotFoundFileException(this.path)
    }

    this.content = undefined
    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.fileSize = undefined
    this.fileExists = false
    this.originalFileExists = false

    rmSync(this.path, { recursive: true })
  }

  /**
   * Remove the file.
   */
  async remove(): Promise<void> {
    if (!this.fileExists) {
      throw new NotFoundFileException(this.path)
    }

    this.content = undefined
    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.fileSize = undefined
    this.fileExists = false
    this.originalFileExists = false

    await promises.rm(this.path, { recursive: true })
  }

  /**
   * Create a copy of the file.
   */
  copySync(path: string, options?: { withContent?: boolean, mockedValues?: boolean }): File {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      true,
    ).loadSync(options)
  }

  /**
   * Create a copy of the file.
   */
  async copy(path: string, options?: { withContent?: boolean, mockedValues?: boolean }): Promise<File> {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      await this.getContent(),
      options.mockedValues,
      true,
    ).load(options)
  }

  /**
   * Move the file to other path.
   */
  moveSync(path: string, options?: { withContent?: boolean, mockedValues?: boolean }): File {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      false,
    ).loadSync(options)

    this.removeSync()

    return movedFile
  }

  /**
   * Move the file to other path.
   */
  async move(path: string, options?: { withContent?: boolean, mockedValues?: boolean }): Promise<File> {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = await new File(
      path,
      await this.getContent(),
      options.mockedValues,
      false,
    ).load(options)

    await this.remove()

    return movedFile
  }

  /**
   * Append any data to the file.
   */
  appendSync(data: string | Buffer): File {
    this.loadSync({ isInternalLoad: true, withContent: false })

    appendFileSync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Append any data to the file.
   */
  async append(data: string | Buffer): Promise<File> {
    await this.load({ isInternalLoad: true, withContent: false })

    const writeStream = createWriteStream(this.path, { flags: 'a' })

    await new Promise((resolve, reject) => {
      writeStream.write(data)
      writeStream.end(resolve)
      writeStream.on('error', reject)
    })
    await this.load({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Prepend any data to the file.
   */
  prependSync(data: string | Buffer): File {
    this.loadSync({ isInternalLoad: true, withContent: false })

    prependFile.sync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Prepend any data to the file.
   */
  async prepend(data: string | Buffer): Promise<File> {
    await this.load({ isInternalLoad: true, withContent: false })

    await prependFile(this.path, data)
    await this.load({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Get only the content of the file.
   */
  getContentSync(options?: { saveContent?: boolean }): Buffer {
    this.loadSync({ isInternalLoad: true, withContent: false })

    options = Options.create(options, { saveContent: false })

    const content = readFileSync(this.path)

    if (options.saveContent) {
      this.content = content
    }

    return content
  }

  /**
   * Get only the content of the file.
   */
  async getContent(options?: { saveContent?: boolean }): Promise<Buffer> {
    await this.load({ isInternalLoad: true, withContent: false })

    options = Options.create(options, { saveContent: false })

    if (this.content) {
      return this.content
    }

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this.path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        const content = Buffer.concat(chunks)

        if (options.saveContent) {
          this.content = content
        }

        resolve(content)
      })

      readable.on('error', reject)
    })
  }

  /**
   * Create a readable stream of the file.
   */
  createReadStream(options?: BufferEncoding | StreamOptions<any>): ReadStream {
    return createReadStream(this.originalPath, options)
  }

  /**
   * Create a writable stream of the file.
   */
  createWriteStream(options?: BufferEncoding | StreamOptions<any>): WriteStream {
    if (!this.fileExists) {
      this.loadSync()
    }

    return createWriteStream(this.originalPath, options)
  }

  /**
   * Create file values.
   */
  private createFileValues(mockedValues?: boolean): void {
    if (mockedValues && !this.originalFileExists) {
      const bytes = randomBytes(30)
      const buffer = Buffer.from(bytes)

      this.dir = this.originalDir
      this.name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this.base = this.name + this.extension
      this.path = this.dir + sep + this.base
      this.href = pathToFileURL(this.path).href

      return
    }

    this.dir = this.originalDir
    this.name = this.originalName
    this.base = this.originalBase
    this.path = this.originalPath
    this.href = this.originalHref
  }
}
