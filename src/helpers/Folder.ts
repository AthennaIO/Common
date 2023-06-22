/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import minimatch from 'minimatch'

import type { FolderJson } from '#src/types'

import {
  existsSync,
  mkdirSync,
  promises,
  readdirSync,
  rmSync,
  statSync,
  Dirent,
} from 'node:fs'

import { Json } from '#src/helpers/Json'
import { File } from '#src/helpers/File'
import { Path } from '#src/helpers/Path'
import { randomBytes } from 'node:crypto'
import { Parser } from '#src/helpers/Parser'
import { Options } from '#src/helpers/Options'
import { isAbsolute, join, parse, resolve, sep } from 'node:path'
import { NotFoundFolderException } from '#src/exceptions/NotFoundFolderException'

export class Folder {
  /**
   * The original or faked folder directory.
   */
  public dir: string

  /**
   * The original or faked folder name.
   */
  public name: string

  /**
   * The original or faked folder base.
   */
  public base: string

  /**
   * The original or faked folder path.
   */
  public path: string

  /**
   * All the files inside of the folder.
   */
  public files: File[]

  /**
   * All the folders inside of the folder.
   */
  // eslint-disable-next-line no-use-before-define
  public folders: Folder[]

  /**
   * Set if original or fake folder exists.
   */
  public folderExists: boolean

  /**
   * Date when the folder was created.
   */
  public createdAt: Date

  /**
   * Date when the folder was last accessed.
   */
  public accessedAt: Date

  /**
   * Date when the folder was last modified.
   */
  public modifiedAt: Date

  /**
   * The folder size.
   */
  public folderSize: string

  /**
   * Set if folder is a copy or not.
   */
  public isCopy: boolean

  /**
   * Original folder directory.
   */
  public originalDir: string

  /**
   * Original folder name.
   */
  public originalName: string

  /**
   * Original folder base.
   */
  public originalBase: string

  /**
   * Original folder path.
   */
  public originalPath: string

  /**
   * Set if original folder exists.
   */
  public originalFolderExists: boolean

  public constructor(folderPath: string, mockedValues = false, isCopy = false) {
    const { dir, name, path } = Folder.parsePath(folderPath)

    this.files = []
    this.folders = []
    this.originalDir = dir
    this.originalName = name
    this.originalPath = path
    this.isCopy = isCopy
    this.originalFolderExists =
      Folder.existsSync(this.originalPath) && !this.isCopy
    this.folderExists = this.originalFolderExists

    this.createFolderValues(mockedValues)
  }

  /**
   * Get the size of the folder.
   */
  public static folderSizeSync(folderPath: string): number {
    const files = readdirSync(folderPath)
    const stats = files.map(file => statSync(join(folderPath, file)))

    return stats.reduce((accumulator, { size }) => accumulator + size, 0)
  }

  /**
   * Get the size of the folder.
   */
  public static async folderSize(folderPath: string): Promise<number> {
    const files = await promises.readdir(folderPath)
    const stats = files.map(file => promises.stat(join(folderPath, file)))

    return (await Promise.all(stats)).reduce(
      (accumulator, { size }) => accumulator + size,
      0,
    )
  }

  /**
   * Remove the folder it's existing or not.
   */
  public static async safeRemove(folderPath: string): Promise<void> {
    const { path } = Folder.parsePath(folderPath)

    if (!(await Folder.exists(path))) {
      return
    }

    await promises.rm(path, { recursive: true })
  }

  /**
   * Verify if folder exists.
   */
  public static existsSync(folderPath: string): boolean {
    const { path } = Folder.parsePath(folderPath)

    return existsSync(path)
  }

  /**
   * Verify if folder exists.
   */
  public static async exists(folderPath: string): Promise<boolean> {
    const { path } = Folder.parsePath(folderPath)

    return promises
      .access(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Verify if path is from folder or file.
   */
  public static isFolderSync(path: string): boolean {
    const { path: parsedPath } = Folder.parsePath(path)

    return statSync(parsedPath).isDirectory()
  }

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  public static async isFolder(path: string): Promise<boolean> {
    const { path: parsedPath } = Folder.parsePath(path)

    return promises.stat(parsedPath).then(stat => stat.isDirectory())
  }

  /**
   * Get sub files of folder.
   */
  private static getSubFiles(folders: Folder[], pattern?: string): File[] {
    const files = []

    folders.forEach(folder => {
      folder.files.forEach(file => {
        if (!pattern) {
          files.push(file)

          return
        }

        if (minimatch(file.path, pattern)) {
          files.push(file)
        }
      })

      if (folder.folders.length) {
        files.push(...this.getSubFiles(folder.folders, pattern))
      }
    })

    return files
  }

  /**
   * Get sub folders of folder.
   */
  private static getSubFolders(
    folder: Folder,
    recursive: boolean,
    pattern?: string,
  ): Folder[] {
    const subFolders = []

    folder.folders.forEach(f => {
      if (!pattern) {
        subFolders.push(f)
      }

      if (recursive && f.folders.length) {
        subFolders.push(...this.getSubFolders(f, recursive, pattern))
      }

      if (pattern && minimatch(f.path, pattern)) {
        subFolders.push(f)
      }
    })

    return subFolders
  }

  /**
   * Parse the folder path.
   */
  private static parsePath(folderPath: string): {
    path: string
    name: string
    dir: string
  } {
    if (!isAbsolute(folderPath)) {
      folderPath = Path.this(folderPath, 3)
    }

    const { dir, name, ext } = parse(folderPath)

    let path = dir.concat(sep, name)

    if (ext) {
      path = path.concat(ext)
    }

    return { dir, name, path }
  }

  /**
   * Returns the file as a JSON object.
   */
  public toJSON(): FolderJson {
    return Json.copy({
      dir: this.dir,
      name: this.name,
      path: this.path,
      files: this.files.map(file => file.toJSON()),
      folders: this.folders.map(folder => folder.toJSON()),
      createdAt: this.createdAt,
      accessedAt: this.accessedAt,
      modifiedAt: this.modifiedAt,
      folderSize: this.folderSize,
      originalDir: this.originalDir,
      originalName: this.originalName,
      originalPath: this.originalPath,
      folderExists: this.folderExists,
      isCopy: this.isCopy,
      originalFolderExists: this.originalFolderExists,
    })
  }

  /**
   * Load or create the folder.
   */
  public loadSync(options?: {
    withSub?: boolean
    withContent?: boolean
    isInternalLoad?: boolean
  }): Folder {
    options = Options.create(options, {
      withSub: true,
      withContent: false,
      isInternalLoad: false,
    })

    if (!this.folderExists) {
      mkdirSync(this.path, { recursive: true })

      this.folderExists = true
    }

    if (this.folderSize && options.isInternalLoad) {
      return this
    }

    const folderStat = statSync(this.path)

    this.createdAt = folderStat.birthtime
    this.accessedAt = folderStat.atime
    this.modifiedAt = folderStat.mtime
    this.folderSize = Parser.sizeToByte(Folder.folderSizeSync(this.path))

    if (!options.withSub) {
      return this
    }

    this.loadSubSync(
      this.path,
      readdirSync(this.path, { withFileTypes: true }),
      options.withContent,
    )

    return this
  }

  /**
   * Load or create the folder.
   */
  public async load(options?: {
    withSub?: boolean
    withContent?: boolean
    isInternalLoad?: boolean
  }): Promise<Folder> {
    options = Options.create(options, {
      withSub: true,
      withContent: false,
      isInternalLoad: false,
    })

    if (!this.folderExists) {
      await promises.mkdir(this.path, { recursive: true })

      this.folderExists = true
    }

    if (this.folderSize && options.isInternalLoad) {
      return this
    }

    const folderStat = await promises.stat(this.path)

    this.createdAt = folderStat.birthtime
    this.accessedAt = folderStat.atime
    this.modifiedAt = folderStat.mtime
    this.folderSize = Parser.sizeToByte(await Folder.folderSize(this.path))

    if (!options.withSub) {
      return this
    }

    await this.loadSub(
      this.path,
      await promises.readdir(this.path, { withFileTypes: true }),
      options.withContent,
    )

    return this
  }

  /**
   * Remove the folder.
   */
  public removeSync(): void {
    if (!this.folderExists) {
      throw new NotFoundFolderException(this.name)
    }

    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.folderSize = undefined
    this.folderExists = false
    this.originalFolderExists = false
    this.files = []
    this.folders = []

    rmSync(this.path, { recursive: true })
  }

  /**
   * Remove the folder.
   */
  public async remove(): Promise<void> {
    if (!this.folderExists) {
      throw new NotFoundFolderException(this.name)
    }

    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.folderSize = undefined
    this.folderExists = false
    this.originalFolderExists = false
    this.files = []
    this.folders = []

    await promises.rm(this.path, { recursive: true })
  }

  /**
   * Create a copy of the folder.
   */
  public copySync(
    path: string,
    options?: {
      withSub?: boolean
      withContent?: boolean
      mockedValues?: boolean
    },
  ): Folder {
    path = Folder.parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withContent: false,
      mockedValues: false,
    })

    this.loadSync({
      withSub: options.withSub,
      withContent: options.withContent,
      isInternalLoad: true,
    })

    const folder = new Folder(path, options.mockedValues, true).loadSync(
      options,
    )

    folder.files = this.files.map(f => {
      return f.copySync(`${folder.path}/${f.base}`, {
        mockedValues: options.mockedValues,
        withContent: options.withContent,
      })
    })

    folder.folders = this.folders.map(f => {
      return f.copySync(`${folder.path}/${f.base}`, {
        withSub: options.withSub,
        withContent: options.withContent,
        mockedValues: options.mockedValues,
      })
    })

    return folder
  }

  /**
   * Create a copy of the folder.
   */
  public async copy(
    path: string,
    options?: {
      withSub?: boolean
      withContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder> {
    path = Folder.parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withContent: false,
      mockedValues: false,
    })

    await this.load({
      withSub: options.withSub,
      withContent: options.withContent,
      isInternalLoad: true,
    })

    const folder = await new Folder(path, options.mockedValues, true).load(
      options,
    )

    folder.files = await Promise.all(
      this.files.map(f => {
        return f.copy(`${folder.path}/${f.base}`, {
          mockedValues: options.mockedValues,
          withContent: options.withContent,
        })
      }),
    )

    folder.folders = await Promise.all(
      this.folders.map(f => {
        return f.copy(`${folder.path}/${f.name}`, {
          withSub: options.withSub,
          mockedValues: options.mockedValues,
          withContent: options.withContent,
        })
      }),
    )

    return folder
  }

  /**
   * Move the folder to other path.
   */
  public moveSync(
    path: string,
    options?: {
      withSub?: boolean
      withContent?: boolean
      mockedValues?: boolean
    },
  ): Folder {
    path = Folder.parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withContent: false,
      mockedValues: false,
    })

    this.loadSync({
      withSub: options.withSub,
      withContent: options.withContent,
      isInternalLoad: true,
    })

    const folder = new Folder(path, options.mockedValues, true).loadSync(
      options,
    )

    folder.files = this.files.map(f => {
      return f.moveSync(`${folder.path}/${f.base}`, {
        mockedValues: options.mockedValues,
        withContent: options.withContent,
      })
    })

    folder.folders = this.folders.map(f => {
      return f.moveSync(`${folder.path}/${f.name}`, {
        withSub: options.withSub,
        mockedValues: options.mockedValues,
        withContent: options.withContent,
      })
    })

    this.removeSync()

    return folder
  }

  /**
   * Move the folder to other path.
   */
  public async move(
    path: string,
    options?: {
      withSub?: boolean
      withContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder> {
    path = Folder.parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withContent: false,
      mockedValues: false,
    })

    await this.load({
      withSub: options.withSub,
      withContent: options.withContent,
      isInternalLoad: true,
    })

    const folder = await new Folder(path, options.mockedValues, true).load(
      options,
    )

    folder.files = await Promise.all(
      this.files.map(f => {
        return f.move(`${folder.path}/${f.base}`, {
          mockedValues: options.mockedValues,
          withContent: options.withContent,
        })
      }),
    )

    folder.folders = await Promise.all(
      this.folders.map(f => {
        return f.move(`${folder.path}/${f.name}`, {
          withSub: options.withSub,
          mockedValues: options.mockedValues,
          withContent: options.withContent,
        })
      }),
    )

    await this.remove()

    return folder
  }

  /**
   * Get all the files of folder using glob pattern.
   */
  public getFilesByPattern(pattern?: string): File[] {
    this.loadSync({ withSub: true, isInternalLoad: true })

    if (pattern) {
      pattern = `${this.path.replace(/\\/g, '/')}/${pattern}`
    }

    const files = []

    this.files.forEach(file => {
      if (pattern && !minimatch(file.path, pattern)) {
        return
      }

      files.push(file)
    })

    files.push(...Folder.getSubFiles(this.folders, pattern))

    return files
  }

  /**
   * Get all the folders of folder using glob pattern.
   */
  public getFoldersByPattern(pattern?: string): Folder[] {
    this.loadSync({ withSub: true, isInternalLoad: true })

    if (pattern) {
      pattern = `${this.path.replace(/\\/g, '/')}/${pattern}`
    }

    const folders = []

    this.folders.forEach(folder => {
      if (folder.folders.length) {
        folders.push(...Folder.getSubFolders(folder, true, pattern))
      }

      if (pattern && minimatch(folder.path, pattern)) {
        folders.push(folder)

        return
      }

      folders.push(folder)
    })

    return folders
  }

  /**
   * Create folder values.
   */
  private createFolderValues(mockedValues?: boolean): void {
    if (mockedValues && !this.originalFolderExists) {
      const bytes = randomBytes(8)
      const buffer = Buffer.from(bytes)

      this.dir = this.originalDir
      this.name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this.path = this.dir + '/' + this.name

      return
    }

    this.dir = this.originalDir
    this.name = this.originalName
    this.path = this.originalPath
  }

  /**
   * Load sub files/folder of folder.
   */
  private loadSubSync(
    path: string,
    dirents: Dirent[],
    withContent: boolean,
  ): void {
    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        const folder = new Folder(name).loadSync({
          withSub: true,
          withContent,
          isInternalLoad: true,
        })

        this.folders.push(folder)

        return
      }

      const file = new File(name).loadSync({
        withContent,
        isInternalLoad: true,
      })

      this.files.push(file)
    })
  }

  /**
   * Load sub files/folder of folder.
   */
  private async loadSub(
    path: string,
    dirents: Dirent[],
    withContent?: boolean,
  ): Promise<void> {
    const files = []
    const folders = []

    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        const folder = new Folder(name).load({
          withSub: true,
          withContent,
          isInternalLoad: true,
        })

        folders.push(folder)

        return
      }

      const file = new File(name).load({
        withContent,
        isInternalLoad: true,
      })

      files.push(file)
    })

    this.files = await Promise.all(files)
    this.folders = await Promise.all(folders)
  }
}
