/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { dirname } from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { Path, File, Folder } from '#src/index'

export class Module {
  /**
   * Get the module first export match or default.
   */
  public static async get(module: any | Promise<any>): Promise<any> {
    module = await module

    if (module.default) {
      return module.default
    }

    return module[Object.keys(module)[0]]
  }

  /**
   * Get the module first export match or default with an alias.
   *
   * @example
   *  const _module = import('#app/Services/MyService')
   *  const _alias = 'App/Services'
   *
   *  const { alias, module } = Module.getWithAlias(_module, _alias)
   *
   *  console.log(alias) // 'App/Services/MyService'
   *  console.log(module) // [class MyService]
   */
  public static async getWithAlias(
    module: any | Promise<any>,
    subAlias: string,
  ): Promise<{ alias: string; module: any }> {
    module = await Module.get(module)

    if (!subAlias.endsWith('/')) {
      subAlias = subAlias.concat('/')
    }

    const alias = subAlias.concat(module.name)

    return { alias, module }
  }

  /**
   * Get all modules first export match or default and return
   * as array.
   */
  public static async getAll(modules: any[]): Promise<any[]> {
    const promises = modules.map(m => Module.get(m))

    return Promise.all(promises)
  }

  /**
   * Get all modules first export match or default with an alias.
   *
   * @example
   *  const _modules = [import('#app/Services/MyService')]
   *  const _alias = 'App/Services'
   *
   *  const [{ alias, module }] = Module.getAllWithAlias(_modules, _alias)
   *
   *  console.log(alias) // 'App/Services/MyService'
   *  console.log(module) // [class MyService]
   */
  public static async getAllWithAlias(
    modules: any[],
    subAlias: string,
  ): Promise<{ alias: string; module: any }[]> {
    const promises = modules.map(m => Module.getWithAlias(m, subAlias))

    return Promise.all(promises)
  }

  /**
   * Same as get method, but import the path directly.
   */
  public static async getFrom(path: string): Promise<any> {
    const module = await Module.import(path)

    return Module.get(module)
  }

  /**
   * Same as getWithAlias method, but import the path directly.
   */
  public static async getFromWithAlias(
    path: string,
    subAlias: string,
  ): Promise<{ alias: string; module: any }> {
    const module = await Module.import(path)

    return Module.getWithAlias(module, subAlias)
  }

  /**
   * Same as getAll method but import everything in the path directly.
   */
  public static async getAllFrom(path: string): Promise<any[]> {
    const files = await Module.getAllJSFilesFrom(path)

    const promises = files.map(file => Module.getFrom(file.path))

    return Promise.all(promises)
  }

  /**
   * Same as getAllWithAlias method but import everything in the path directly.
   */
  public static async getAllFromWithAlias(
    path: string,
    subAlias: string,
  ): Promise<{ alias: string; module: any }[]> {
    const files = await Module.getAllJSFilesFrom(path)

    const promises = files.map(f => Module.getFromWithAlias(f.path, subAlias))

    return Promise.all(promises)
  }

  /**
   * Verify if folder exists and get all .js files inside.
   */
  public static async getAllJSFilesFrom(path: string): Promise<File[]> {
    if (!(await Folder.exists(path))) {
      return []
    }

    if (!(await Folder.isFolder(path))) {
      return []
    }

    const folder = await new Folder(path).load()

    // FIXME Why glob pattern *.js is retrieving .d.ts and .js.map files?
    return folder
      .getFilesByPattern(`*/**/*.${Path.ext()}`, true)
      .filter(file => file.extension.endsWith(`.${Path.ext()}`))
  }

  /**
   * Import a full path using the path href to ensure compatibility
   * between OS's.
   */
  public static async import(path: string): Promise<any> {
    return import(pathToFileURL(path).href)
  }

  /**
   * Create the __dirname property. Set in global if necessary.
   */
  public static createDirname(
    url = import.meta.url,
    setInGlobal = false,
  ): string {
    const __dirname = dirname(Module.createFilename(url, false))

    if (setInGlobal) {
      global.__dirname = __dirname
    }

    return __dirname
  }

  /**
   * Create the __filename property. Set in global if necessary.
   */
  public static createFilename(
    url = import.meta.url,
    setInGlobal = false,
  ): string {
    const __filename = fileURLToPath(url)

    if (setInGlobal) {
      global.__filename = __filename
    }

    return __filename
  }

  /**
   * Create the require function. Set in global if necessary.
   */
  public static createRequire(
    url = import.meta.url,
    setInGlobal = false,
  ): typeof require {
    const require = createRequire(url)

    if (setInGlobal) {
      global.require = require
    }

    return require
  }
}
