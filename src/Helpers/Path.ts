/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import callSite from 'callsite'

import { fileURLToPath } from 'node:url'
import { homedir, tmpdir } from 'node:os'
import { dirname, posix, win32 } from 'node:path'

export class Path {
  public static dirs = {
    bin: 'bin',
    src: 'src',
    app: 'app',
    services: 'app/Services',
    exceptions: 'app/Exceptions',
    repositories: 'app/Repositories',
    console: 'app/Console',
    commands: 'app/Console/Commands',
    http: 'app/Http',
    controllers: 'app/Http/Controllers',
    middlewares: 'app/Http/Middlewares',
    interceptors: 'app/Http/Interceptors',
    terminators: 'app/Http/Terminators',
    bootstrap: 'bootstrap',
    config: 'config',
    database: 'database',
    seeders: 'database/seeders',
    migrations: 'database/migrations',
    lang: 'lang',
    resources: 'resources',
    views: 'resources/views',
    locales: 'resources/locales',
    nodeModules: 'node_modules',
    nodeModulesBin: 'node_modules/.bin',
    providers: 'providers',
    facades: 'providers/facades',
    public: 'public',
    static: 'public/static',
    assets: 'public/assets',
    routes: 'routes',
    storage: 'storage',
    logs: 'storage/logs',
    tests: 'tests',
    stubs: 'tests/Stubs',
  }

  /**
   * Return js or ts extension depending on IS_TS.
   */
  public static ext(): string {
    const isTs = !!(
      process.env.IS_TS &&
      (process.env.IS_TS === 'true' || process.env.IS_TS === '(true)')
    )

    if (isTs) {
      return 'ts'
    }

    return 'js'
  }

  /**
   * Return the pwd path of your project.
   */
  public static pwd(subPath = '/'): string {
    const pwd = posix.normalize(`${process.cwd()}/${posix.normalize(subPath)}`)

    return this.removeSlashes(pwd)
  }

  /**
   * Return the src path of your project.
   */
  public static src(subPath = '/'): string {
    return this.pwd(this.dirs.src + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of src folder.
   */
  public static setSrc(directory: string): typeof Path {
    this.dirs.src = directory

    return this
  }

  /**
   * Return the bin path of your project.
   */
  public static bin(subPath = '/'): string {
    return this.pwd(this.dirs.bin + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of bin folder.
   */
  public static setBin(directory: string): typeof Path {
    this.dirs.bin = directory

    return this
  }

  /**
   * Return the app path of your project.
   */
  public static app(subPath = '/'): string {
    return this.pwd(this.dirs.app + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of app folder.
   */
  public static setApp(directory: string): typeof Path {
    this.dirs.app = directory

    return this
  }

  /**
   * Return the bootstrap path of your project.
   */
  public static bootstrap(subPath = '/'): string {
    return this.pwd(this.dirs.bootstrap + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of bootstrap folder.
   */
  public static setBootstrap(directory: string): typeof Path {
    this.dirs.bootstrap = directory

    return this
  }

  /**
   * Return the config path of your project.
   */
  public static config(subPath = '/'): string {
    return this.pwd(this.dirs.config + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of config folder.
   */
  public static setConfig(directory: string): typeof Path {
    this.dirs.config = directory

    return this
  }

  /**
   * Return the database path of your project.
   */
  public static database(subPath = '/'): string {
    return this.pwd(this.dirs.database + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of database folder.
   */
  public static setDatabase(directory: string): typeof Path {
    this.dirs.database = directory

    return this
  }

  /**
   * Return the lang path of your project.
   */
  public static lang(subPath = '/'): string {
    return this.pwd(this.dirs.lang + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of lang folder.
   */
  public static setLang(directory: string): typeof Path {
    this.dirs.lang = directory

    return this
  }

  /**
   * Return the node_modules path of your project.
   */
  public static nodeModules(subPath = '/'): string {
    return this.pwd(this.dirs.nodeModules + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of node_modules folder.
   */
  public static setNodeModules(directory: string): typeof Path {
    this.dirs.nodeModules = directory

    return this
  }

  /**
   * Return the providers' path of your project.
   */
  public static providers(subPath = '/'): string {
    return this.pwd(this.dirs.providers + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of providers folder.
   */
  public static setProviders(directory: string): typeof Path {
    this.dirs.providers = directory

    return this
  }

  /**
   * Return the facades' path of your project.
   */
  public static facades(subPath = '/'): string {
    return this.pwd(this.dirs.facades + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of facades folder.
   */
  public static setFacades(directory: string): typeof Path {
    this.dirs.facades = directory

    return this
  }

  /**
   * Return the public path of your project.
   */
  public static public(subPath = '/'): string {
    return this.pwd(this.dirs.public + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of public folder.
   */
  public static setPublic(directory: string): typeof Path {
    this.dirs.public = directory

    return this
  }

  /**
   * Return the resources' path of your project.
   */
  public static resources(subPath = '/'): string {
    return this.pwd(this.dirs.resources + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of resources folder.
   */
  public static setResources(directory: string): typeof Path {
    this.dirs.resources = directory

    return this
  }

  /**
   * Return the routes' path of your project.
   */
  public static routes(subPath = '/'): string {
    return this.pwd(this.dirs.routes + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of routes folder.
   */
  public static setRoutes(directory: string): typeof Path {
    this.dirs.routes = directory

    return this
  }

  /**
   * Return the storage path of your project.
   */
  public static storage(subPath = '/'): string {
    return this.pwd(this.dirs.storage + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of storage folder.
   */
  public static setStorage(directory: string): typeof Path {
    this.dirs.storage = directory

    return this
  }

  /**
   * Return the tests' path of your project.
   */
  public static tests(subPath = '/'): string {
    return this.pwd(this.dirs.tests + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of tests folder.
   */
  public static setTests(directory: string): typeof Path {
    this.dirs.tests = directory

    return this
  }

  /**
   * Return the logs' path of your project.
   */
  public static logs(subPath = '/'): string {
    return this.pwd(this.dirs.logs + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of logs folder.
   */
  public static setLogs(directory: string): typeof Path {
    this.dirs.logs = directory

    return this
  }

  /**
   * Return the views' path of your project.
   */
  public static views(subPath = '/'): string {
    return this.pwd(this.dirs.views + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of views folder.
   */
  public static setViews(directory: string): typeof Path {
    this.dirs.views = directory

    return this
  }

  /**
   * Return the static' path of your project.
   */
  public static static(subPath = '/'): string {
    return this.pwd(this.dirs.static + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of static folder.
   */
  public static setStatic(directory: string): typeof Path {
    this.dirs.static = directory

    return this
  }

  /**
   * Return the assets' path of your project.
   */
  public static assets(subPath = '/'): string {
    return this.pwd(this.dirs.assets + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of assets folder.
   */
  public static setAssets(directory: string): typeof Path {
    this.dirs.assets = directory

    return this
  }

  /**
   * Return the locales' path of your project.
   */
  public static locales(subPath = '/'): string {
    return this.pwd(this.dirs.locales + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of locales folder.
   */
  public static setLocales(directory: string): typeof Path {
    this.dirs.locales = directory

    return this
  }

  /**
   * Return the stubs' path of your project.
   */
  public static stubs(subPath = '/'): string {
    return this.pwd(this.dirs.stubs + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of stubs folder.
   */
  public static setStubs(directory: string): typeof Path {
    this.dirs.stubs = directory

    return this
  }

  /**
   * Return the http path of your project.
   */
  public static http(subPath = '/'): string {
    return this.pwd(this.dirs.http + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of http folder.
   */
  public static setHttp(directory: string): typeof Path {
    this.dirs.http = directory

    return this
  }

  /**
   * Return the console path of your project.
   */
  public static console(subPath = '/'): string {
    return this.pwd(this.dirs.console + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of console folder.
   */
  public static setConsole(directory: string): typeof Path {
    this.dirs.console = directory

    return this
  }

  /**
   * Return the services' path of your project.
   */
  public static services(subPath = '/'): string {
    return this.pwd(this.dirs.services + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of services folder.
   */
  public static setServices(directory: string): typeof Path {
    this.dirs.services = directory

    return this
  }

  /**
   * Return the repositories' path of your project.
   */
  public static repositories(subPath = '/'): string {
    return this.pwd(this.dirs.repositories + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of repositories folder.
   */
  public static setRepositories(directory: string): typeof Path {
    this.dirs.repositories = directory

    return this
  }

  /**
   * Return the commands' path of your project.
   */
  public static commands(subPath = '/'): string {
    return this.pwd(this.dirs.commands + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of commands folder.
   */
  public static setCommands(directory: string): typeof Path {
    this.dirs.commands = directory

    return this
  }

  /**
   * Return the controllers' path of your project.
   */
  public static controllers(subPath = '/'): string {
    return this.pwd(this.dirs.controllers + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of controllers folder.
   */
  public static setControllers(directory: string): typeof Path {
    this.dirs.controllers = directory

    return this
  }

  /**
   * Return the exceptions' path of your project.
   */
  public static exceptions(subPath = '/'): string {
    return this.pwd(this.dirs.exceptions + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of exceptions folder.
   */
  public static setExceptions(directory: string): typeof Path {
    this.dirs.exceptions = directory

    return this
  }

  /**
   * Return the middlewares' path of your project.
   */
  public static middlewares(subPath = '/'): string {
    return this.pwd(this.dirs.middlewares + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of middlewares folder.
   */
  public static setMiddlewares(directory: string): typeof Path {
    this.dirs.middlewares = directory

    return this
  }

  /**
   * Return the interceptors' path of your project.
   */
  public static interceptors(subPath = '/'): string {
    return this.pwd(this.dirs.interceptors + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of interceptors folder.
   */
  public static setInterceptors(directory: string): typeof Path {
    this.dirs.interceptors = directory

    return this
  }

  /**
   * Return the terminators' path of your project.
   */
  public static terminators(subPath = '/'): string {
    return this.pwd(this.dirs.terminators + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of terminators folder.
   */
  public static setTerminators(directory: string): typeof Path {
    this.dirs.terminators = directory

    return this
  }

  /**
   * Return the migrations' path of your project.
   */
  public static migrations(subPath = '/'): string {
    return this.pwd(this.dirs.migrations + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of migrations folder.
   */
  public static setMigrations(directory: string): typeof Path {
    this.dirs.migrations = directory

    return this
  }

  /**
   * Return the seeders' path of your project.
   */
  public static seeders(subPath = '/'): string {
    return this.pwd(this.dirs.seeders + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of seeders folder.
   */
  public static setSeeders(directory: string): typeof Path {
    this.dirs.seeders = directory

    return this
  }

  /**
   * Return the .bin path of your node_modules.
   */
  public static nodeModulesBin(subPath = '/'): string {
    return this.pwd(this.dirs.nodeModulesBin + '/' + posix.normalize(subPath))
  }

  /**
   * Set the directory of .bin folder of your node_modules.
   */
  public static setNodeModulesBin(directory: string): typeof Path {
    this.dirs.nodeModulesBin = directory

    return this
  }

  /**
   * Return the tmp path of your vm.
   */
  public static vmTmp(subPath = '/'): string {
    const osTmpDir = tmpdir()

    const tmpDir = osTmpDir.concat('/', posix.normalize(subPath))

    return this.removeSlashes(tmpDir)
  }

  /**
   * Return the home path of your vm.
   */
  public static vmHome(subPath = '/'): string {
    const osHomeDir = homedir()

    const homeDir = osHomeDir.concat('/', posix.normalize(subPath))

    return this.removeSlashes(homeDir)
  }

  /**
   * Return the execution path of where this method
   * is being called.
   */
  public static this(subPath = '/', stackIndex = 1): string {
    const stack = callSite()
    const requester = dirname(fileURLToPath(stack[stackIndex].getFileName()))
    const execDir = posix.normalize(
      requester.concat('/', posix.normalize(subPath)),
    )

    return this.removeSlashes(execDir)
  }

  /**
   * Remove additional slashes from path.
   */
  private static removeSlashes(path: string): string {
    path = posix.normalize(path)

    if (path.endsWith('/')) {
      path = path.slice(0, -1)
    }

    if (process.platform === 'win32') {
      return win32.normalize(path)
    }

    return path
  }
}
