/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prependFile from 'prepend-file'

import type { StreamOptions } from 'node:stream'
import type { FileJson, ObjectBuilderOptions } from '#src/types'

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
  WriteStream
} from 'node:fs'

import { debug } from '#src/debug'
import { lookup } from 'mime-types'
import { Is } from '#src/helpers/Is'
import { pathToFileURL } from 'node:url'
import { Path } from '#src/helpers/Path'
import { randomBytes } from 'node:crypto'
import { Parser } from '#src/helpers/Parser'
import { Module } from '#src/helpers/Module'
import { Options } from '#src/helpers/Options'
import { isAbsolute, parse, sep } from 'node:path'
import { Json, ObjectBuilder } from '#src/helpers/Json'
import { NotFoundFileException } from '#src/exceptions/NotFoundFileException'

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
  public fileSize: string

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

  public constructor(
    filePath: string,
    content: string | Buffer = undefined,
    mockedValues = false,
    isCopy = false
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
    this.content = Is.String(content) ? Buffer.from(content) : content
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
  public static async safeRemove(filePath: string): Promise<void> {
    const { path } = File.parsePath(filePath)

    if (!(await File.exists(path))) {
      return
    }

    await promises.rm(path, { recursive: false })
  }

  /**
   * Verify if file exists.
   */
  public static existsSync(filePath: string): boolean {
    const { path } = File.parsePath(filePath)

    return existsSync(path)
  }

  /**
   * Verify if file exists.
   */
  public static async exists(filePath: string): Promise<boolean> {
    const { path } = File.parsePath(filePath)

    return promises
      .access(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Verify if path is from file or directory.
   */
  public static isFileSync(path: string): boolean {
    const { path: parsedPath } = File.parsePath(path)

    return statSync(parsedPath).isFile()
  }

  /**
   * Verify if path is from file or directory.
   */
  public static async isFile(path: string): Promise<boolean> {
    const { path: parsedPath } = File.parsePath(path)

    return promises.stat(parsedPath).then(stat => stat.isFile())
  }

  /**
   * Create fake file with determined size.
   */
  public static async createFileOfSize(
    filePath: string,
    size: number
  ): Promise<typeof File> {
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
    ext: string
    path: string
    root: string
    mime: string
    name: string
    dir: string
    base: string
  } {
    if (!isAbsolute(filePath)) {
      filePath = Path.this(filePath, 3)
    }

    let { name, base, dir, root, ext } = parse(filePath)

    const baseArray = base.split('.')

    if (base.endsWith('.d.ts')) {
      ext = '.d.ts'
      name = baseArray.splice(0, 1)[0]
    }

    if (base.endsWith('.js.map')) {
      ext = '.js.map'
      name = baseArray.splice(0, 1)[0]
    }

    const mime = lookup(dir + sep + base)

    return { ext, dir, name, root, base, mime, path: dir + sep + base }
  }

  /**
   * Returns the file as a JSON object.
   */
  public toJSON(): FileJson {
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
      content: this.content
    })
  }

  /**
   * Load or create the file.
   */
  public loadSync(options?: {
    withContent?: boolean
    isInternalLoad?: boolean
  }): File {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false
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
      debug(
        `file %s with %s has been loaded in heap memory.`,
        this.base,
        this.fileSize
      )
    }

    this.content = this.content || readFileSync(this.path)

    return this
  }

  /**
   * Load or create the file.
   */
  public async load(options?: {
    withContent?: boolean
    isInternalLoad?: boolean
  }): Promise<File> {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false
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
          debug(
            `file %s with %s has been loaded in heap memory.`,
            this.base,
            this.fileSize
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
  public removeSync(): void {
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
  public async remove(): Promise<void> {
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
  public copySync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean }
  ): File {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      true
    ).loadSync(options)
  }

  /**
   * Create a copy of the file.
   */
  public async copy(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean }
  ): Promise<File> {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      await this.getContent(),
      options.mockedValues,
      true
    ).load(options)
  }

  /**
   * Move the file to another path.
   */
  public moveSync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean }
  ): File {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      false
    ).loadSync(options)

    this.removeSync()

    return movedFile
  }

  /**
   * Move the file to other path.
   */
  public async move(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean }
  ): Promise<File> {
    path = File.parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = await new File(
      path,
      await this.getContent(),
      options.mockedValues,
      false
    ).load(options)

    await this.remove()

    return movedFile
  }

  /**
   * Append any data to the file.
   */
  public appendSync(data: string | Buffer): File {
    this.loadSync({ isInternalLoad: true, withContent: false })

    appendFileSync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Append any data to the file.
   */
  public async append(data: string | Buffer): Promise<File> {
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
  public prependSync(data: string | Buffer): File {
    this.loadSync({ isInternalLoad: true, withContent: false })

    prependFile.sync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Prepend any data to the file.
   */
  public async prepend(data: string | Buffer): Promise<File> {
    await this.load({ isInternalLoad: true, withContent: false })

    await prependFile(this.path, data)
    await this.load({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Set content in file overwriting all his content.
   */
  public async setContent(
    content: string | Buffer,
    options?: { withContent?: boolean }
  ): Promise<File> {
    options = Options.create(options, {
      withContent: false
    })

    await this.load({ isInternalLoad: true, withContent: false })

    const stream = this.createWriteStream()

    await new Promise((resolve, reject) => {
      stream.write(content)
      stream.end(resolve)
      stream.on('error', reject)
    })

    if (options.withContent) {
      this.content = Is.String(content) ? Buffer.from(content) : content
    }

    return this
  }

  /**
   * Set content in file overwriting all his content.
   */
  public setContentSync(
    content: string | Buffer,
    options?: { withContent?: boolean }
  ): File {
    options = Options.create(options, {
      withContent: false
    })

    this.loadSync({ isInternalLoad: true, withContent: false })

    writeFileSync(this.path, content)

    if (options.withContent) {
      this.content = Is.String(content) ? Buffer.from(content) : content
    }

    return this
  }

  /**
   * Get only the content of the file.
   */
  public async getContent(options?: {
    saveContent?: boolean
  }): Promise<Buffer> {
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
   * Get only the content of the file.
   */
  public getContentSync(options?: { saveContent?: boolean }): Buffer {
    this.loadSync({ isInternalLoad: true, withContent: false })

    options = Options.create(options, { saveContent: false })

    const content = readFileSync(this.path)

    if (options.saveContent) {
      this.content = content
    }

    return content
  }

  /**
   * Get only the content of the file as string.
   */
  public async getContentAsString(options?: {
    saveContent?: boolean
  }): Promise<string> {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = await this.getContent(options)

    return content.toString()
  }

  /**
   * Get only the content of the file as string.
   */
  public getContentAsStringSync(options?: { saveContent?: boolean }): string {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = this.getContentSync(options)

    return content.toString()
  }

  /**
   * Get only the content of the file as json.
   */
  public async getContentAsJson(options?: {
    saveContent?: boolean
  }): Promise<any | any[]> {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = await this.getContentAsString(options)

    return Json.parse(content)
  }

  /**
   * Get only the content of the file as json.
   */
  public getContentAsJsonSync(options?: {
    saveContent?: boolean
  }): any | any[] {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = this.getContentAsStringSync(options)

    return Json.parse(content)
  }

  /**
   * Get only the content of the file as yaml.
   */
  public async getContentAsYaml(options?: {
    saveContent?: boolean
  }): Promise<any | any[]> {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = await this.getContentAsString(options)

    return Parser.yamlStringToObject(content)
  }

  /**
   * Get only the content of the file as yaml.
   */
  public getContentAsYamlSync(options?: {
    saveContent?: boolean
  }): any | any[] {
    this.loadSync({ isInternalLoad: true, withContent: false })

    const content = this.getContentAsStringSync(options)

    return Parser.yamlStringToObject(content)
  }

  /**
   * Get only the content of the file as an instance of ObjectBuilder.
   */
  public async getContentAsBuilder(options?: {
    saveContent?: boolean
    builder?: ObjectBuilderOptions
  }): Promise<ObjectBuilder> {
    return this.getContentAsJson(options).then(content =>
      new ObjectBuilder().set(content)
    )
  }

  /**
   * Get only the content of the file as an instance of ObjectBuilder.
   */
  public getContentAsBuilderSync(options?: {
    saveContent?: boolean
    builder?: ObjectBuilderOptions
  }): ObjectBuilder {
    return new ObjectBuilder().set(this.getContentAsJsonSync(options))
  }

  /**
   * Create a readable stream of the file.
   */
  public createReadStream(
    options?: BufferEncoding | StreamOptions<any>
  ): ReadStream {
    return createReadStream(this.originalPath, options)
  }

  /**
   * Create a writable stream of the file.
   */
  public createWriteStream(
    options?: BufferEncoding | StreamOptions<any>
  ): WriteStream {
    if (!this.fileExists) {
      this.loadSync()
    }

    return createWriteStream(this.originalPath, options)
  }

  /**
   * Import the file assuming that the file is a valid module.
   */
  public async import(meta?: string): Promise<any> {
    await this.load({ isInternalLoad: true, withContent: false })

    if (meta) {
      return Module.resolve(this.href, meta)
    }

    return Module.get(import(this.href))
  }

  /**
   * Safe import the file assuming that the file COULD be a valid module.
   */
  public async safeImport(meta?: string): Promise<any | null> {
    try {
      const _module = await this.import(meta)

      if (!_module) {
        return null
      }

      return _module
    } catch (_err) {
      return null
    }
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
