/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { debug } from '#src/debug'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, extname, isAbsolute } from 'node:path'
import { Path, File, Folder, type ModuleResolveOptions, Options } from '#src'

export class Module {
  /**
   * Get the module first export match or default.
   */
  public static async get<T = any>(module: any | Promise<any>): Promise<T> {
    module = await module

    if (module.default) {
      return module.default
    }

    const exported = Object.keys(module)

    debug(
      'not found a default module, picking the first one %s from %s',
      exported[0],
      exported
    )

    return module[exported[0]]
  }

  /**
   * Get the module first export match or default with an alias.
   *
   * @example
   *  const _module = import('#app/services/MyService')
   *  const _alias = 'App/Services'
   *
   *  const { alias, module } = Module.getWithAlias(_module, _alias)
   *
   *  console.log(alias) // 'App/Services/MyService'
   *  console.log(module) // [class MyService]
   */
  public static async getWithAlias<T = any>(
    module: any | Promise<any>,
    subAlias: string
  ): Promise<{ alias: string; module: T }> {
    module = await Module.get(module)

    if (!subAlias.endsWith('/')) {
      subAlias = subAlias.concat('/')
    }

    const alias = subAlias.concat(module.name)

    return { alias, module }
  }

  /**
   * Get all modules first export match or default and return
   * as an array.
   */
  public static async getAll(modules: any[]): Promise<any[]> {
    const promises = modules.map(m => Module.get(m))

    return Promise.all(promises)
  }

  /**
   * Get all modules first export match or default with an alias.
   *
   * @example
   *  const _modules = [import('#app/services/MyService')]
   *  const _alias = 'App/Services'
   *
   *  const [{ alias, module }] = Module.getAllWithAlias(_modules, _alias)
   *
   *  console.log(alias) // 'App/Services/MyService'
   *  console.log(module) // [class MyService]
   */
  public static async getAllWithAlias(
    modules: any[],
    subAlias: string
  ): Promise<{ alias: string; module: any }[]> {
    const promises = modules.map(m => Module.getWithAlias(m, subAlias))

    return Promise.all(promises)
  }

  /**
   * Same as get method, but import the path directly.
   */
  public static async getFrom<T = any>(path: string): Promise<T> {
    const module = await Module.import(path)

    return Module.get(module)
  }

  /**
   * Same as getWithAlias method, but import the path directly.
   */
  public static async getFromWithAlias<T = any>(
    path: string,
    subAlias: string
  ): Promise<{ alias: string; module: T }> {
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
    subAlias: string
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

    return folder.getFilesByPattern(`**/*.${Path.ext()}`)
  }

  /**
   * Import a full path using the path href to ensure compatibility
   * between OS's.
   */
  public static async import<T = any>(path: string): Promise<T> {
    debug('trying to import the path: %s', path)

    if (!isAbsolute(path)) {
      return import(path)
    }

    return import(pathToFileURL(path).href)
  }

  /**
   * Same as import method, but safeImport return null if the
   * module does not exist, catching the error throw from bad
   * import.
   */
  public static async safeImport<T = any>(path: string): Promise<T | null> {
    try {
      return await Module.import(path)
    } catch (err) {
      return null
    }
  }

  /**
   * Resolve the module path by parent URL.
   */
  public static async resolve<T = any>(
    path: string,
    parentURL: string,
    options: ModuleResolveOptions = {}
  ): Promise<T> {
    options = Options.create(options, {
      import: true,
      getModule: true
    })

    const splitted = path.split('?')
    const queries = splitted[1] || ''

    path = splitted[0]

    const resolve = async (path: string) => {
      if (queries) {
        path = path.concat('?', queries)
      }

      if (!options.import) {
        return path
      }

      if (!options.getModule) {
        return import(path)
      }

      return Module.get(import(path))
    }

    if (isAbsolute(path)) {
      debug(
        "path is absolute and don't need to be resolved, importing path: %s and query params: %s",
        path,
        queries
      )

      return resolve(pathToFileURL(path).href)
    }

    if (!path.startsWith('#') && extname(path)) {
      debug(
        'trying to resolve relative path: %s, with parent URL: %s and query params: %s',
        path,
        parentURL,
        queries
      )

      return resolve(new URL(path, parentURL).href)
    }

    if (process.argv.includes('--experimental-import-meta-resolve')) {
      debug(
        'trying to resolve import alias path: %s with parent URL: %s and query params: %s using import.meta.resolve',
        path,
        parentURL,
        queries
      )

      return resolve(await import.meta.resolve(path, parentURL))
    }

    const require = Module.createRequire(parentURL)

    debug(
      'trying to resolve import alias path: %s with parent URL: %s and query params: %s using require.resolve',
      path,
      parentURL,
      queries
    )

    try {
      path = require.resolve(path)
    } catch (error) {
      path = error.message.match(/'(.*?)'/)[1]
    }

    return resolve(pathToFileURL(path).href)
  }

  /**
   * Create the __dirname property. Set in global if necessary.
   */
  public static createDirname(
    url = import.meta.url,
    setInGlobal = false
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
    setInGlobal = false
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
    setInGlobal = false
  ): NodeRequire {
    const require = createRequire(url)

    if (setInGlobal) {
      global.require = require
    }

    return require
  }
}
