/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import callSite from 'callsite'

import { homedir, tmpdir } from 'node:os'
import type { PathDirs } from '#src/types'
import { sep, normalize, dirname, parse } from 'node:path'
import { pathToFileURL, fileURLToPath, type URL } from 'node:url'

export class Path {
  public static dirs: PathDirs = {
    bin: 'bin',
    src: 'src',
    app: 'app',
    models: 'app/models',
    services: 'app/services',
    jobs: 'app/jobs',
    workers: 'app/workers',
    exceptions: 'app/exceptions',
    repositories: 'app/repositories',
    console: 'app/console',
    commands: 'app/console/commands',
    http: 'app/http',
    guards: 'app/http/guards',
    controllers: 'app/http/controllers',
    middlewares: 'app/http/middlewares',
    interceptors: 'app/http/interceptors',
    terminators: 'app/http/terminators',
    validators: 'app/validators',
    schedulers: 'app/cron/schedulers',
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
    stubs: 'tests/stubs',
    fixtures: 'tests/fixtures'
  }

  /**
   * Merge your custom directories with the default directories.
   */
  public static mergeDirs(dirs: PathDirs): typeof Path {
    this.dirs = { ...this.dirs, ...dirs }

    return this
  }

  /**
   * Return js or ts extension depending on IS_TS.
   */
  public static ext(): string {
    const isTs = !!(process.env.IS_TS && process.env.IS_TS === 'true')

    if (isTs) {
      return 'ts'
    }

    return 'js'
  }

  /**
   * Remove the extension from a path.
   */
  public static removeExt(path: string): string {
    const parsedPath = parse(path)

    if (!parsedPath.dir) {
      return parsedPath.name
    }

    return parsedPath.dir.concat(sep, parsedPath.name)
  }

  /**
   * Parse the extension of a path using the `Path.ext()` method.
   * If the path ends with .js and `Path.ext()` returns .ts, the
   * path will be parsed to end with .ts. The same happens when
   * the path ends with .ts and `Path.ext()` returns .js.
   */
  public static parseExt(path: string): string {
    if (path.endsWith('.d.ts')) {
      return path
    }

    const { ext } = parse(path)

    if (!ext) {
      return path
    }

    if (ext === `.${Path.ext()}`) {
      return path
    }

    return `${Path.removeExt(path)}.${Path.ext()}`
  }

  /**
   * Convert a path to URL.
   */
  public static toURL(path: string): URL {
    return pathToFileURL(path)
  }

  /**
   * Convert URL or URL href to path.
   */
  public static toPath(url: string | URL): string {
    return fileURLToPath(url)
  }

  /**
   * Convert a path to URL href.
   */
  public static toHref(path: string): string {
    return pathToFileURL(path).href
  }

  /**
   * Return the pwd path of your project.
   */
  public static pwd(subPath: string = sep): string {
    const pwd = normalize(`${process.cwd()}${sep}${normalize(subPath)}`)

    return this.removeSlashes(pwd)
  }

  /**
   * Return the src path of your project.
   */
  public static src(subPath: string = sep): string {
    return this.pwd(normalize(this.dirs.src) + sep + normalize(subPath))
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
  public static bin(subPath: string = sep): string {
    return this.pwd(normalize(this.dirs.bin) + sep + normalize(subPath))
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
  public static app(subPath: string = sep): string {
    return this.pwd(normalize(this.dirs.app) + sep + normalize(subPath))
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
  public static bootstrap(subPath: string = sep): string {
    return this.pwd(normalize(this.dirs.bootstrap) + sep + normalize(subPath))
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
  public static config(subPath: string = sep): string {
    return this.pwd(normalize(this.dirs.config) + sep + normalize(subPath))
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
  public static database(subPath: string = sep): string {
    return this.pwd(this.dirs.database + sep + normalize(subPath))
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
  public static lang(subPath: string = sep): string {
    return this.pwd(this.dirs.lang + sep + normalize(subPath))
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
  public static nodeModules(subPath: string = sep): string {
    return this.pwd(this.dirs.nodeModules + sep + normalize(subPath))
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
  public static providers(subPath: string = sep): string {
    return this.pwd(this.dirs.providers + sep + normalize(subPath))
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
  public static facades(subPath: string = sep): string {
    return this.pwd(this.dirs.facades + sep + normalize(subPath))
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
  public static public(subPath: string = sep): string {
    return this.pwd(this.dirs.public + sep + normalize(subPath))
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
  public static resources(subPath: string = sep): string {
    return this.pwd(this.dirs.resources + sep + normalize(subPath))
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
  public static routes(subPath: string = sep): string {
    return this.pwd(this.dirs.routes + sep + normalize(subPath))
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
  public static storage(subPath: string = sep): string {
    return this.pwd(this.dirs.storage + sep + normalize(subPath))
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
  public static tests(subPath: string = sep): string {
    return this.pwd(this.dirs.tests + sep + normalize(subPath))
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
  public static logs(subPath: string = sep): string {
    return this.pwd(this.dirs.logs + sep + normalize(subPath))
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
  public static views(subPath: string = sep): string {
    return this.pwd(this.dirs.views + sep + normalize(subPath))
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
  public static static(subPath: string = sep): string {
    return this.pwd(this.dirs.static + sep + normalize(subPath))
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
  public static assets(subPath: string = sep): string {
    return this.pwd(this.dirs.assets + sep + normalize(subPath))
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
  public static locales(subPath: string = sep): string {
    return this.pwd(this.dirs.locales + sep + normalize(subPath))
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
  public static stubs(subPath: string = sep): string {
    return this.pwd(this.dirs.stubs + sep + normalize(subPath))
  }

  /**
   * Set the directory of stubs folder.
   */
  public static setStubs(directory: string): typeof Path {
    this.dirs.stubs = directory

    return this
  }

  /**
   * Return the fixtures' path of your project.
   */
  public static fixtures(subPath: string = sep): string {
    return this.pwd(this.dirs.fixtures + sep + normalize(subPath))
  }

  /**
   * Set the directory of fixtures folder.
   */
  public static setFixtures(directory: string): typeof Path {
    this.dirs.fixtures = directory

    return this
  }

  /**
   * Return the http path of your project.
   */
  public static http(subPath: string = sep): string {
    return this.pwd(this.dirs.http + sep + normalize(subPath))
  }

  /**
   * Set the directory of http folder.
   */
  public static setHttp(directory: string): typeof Path {
    this.dirs.http = directory

    return this
  }

  /**
   * Return the guards path of your project.
   */
  public static guards(subPath: string = sep): string {
    return this.pwd(this.dirs.guards + sep + normalize(subPath))
  }

  /**
   * Set the directory of guards folder.
   */
  public static setGuards(directory: string): typeof Path {
    this.dirs.guards = directory

    return this
  }

  /**
   * Return the console path of your project.
   */
  public static console(subPath: string = sep): string {
    return this.pwd(this.dirs.console + sep + normalize(subPath))
  }

  /**
   * Set the directory of console folder.
   */
  public static setConsole(directory: string): typeof Path {
    this.dirs.console = directory

    return this
  }

  /**
   * Return the models' path of your project.
   */
  public static models(subPath: string = sep): string {
    return this.pwd(this.dirs.models + sep + normalize(subPath))
  }

  /**
   * Set the directory of models folder.
   */
  public static setModels(directory: string): typeof Path {
    this.dirs.models = directory

    return this
  }

  /**
   * Return the services' path of your project.
   */
  public static services(subPath: string = sep): string {
    return this.pwd(this.dirs.services + sep + normalize(subPath))
  }

  /**
   * Set the directory of services folder.
   */
  public static setServices(directory: string): typeof Path {
    this.dirs.services = directory

    return this
  }

  /**
   * Return the jobs' path of your project.
   */
  public static jobs(subPath: string = sep): string {
    return this.pwd(this.dirs.jobs + sep + normalize(subPath))
  }

  /**
   * Set the directory of jobs folder.
   */
  public static setJobs(directory: string): typeof Path {
    this.dirs.jobs = directory

    return this
  }

  /**
   * Return the workers' path of your project.
   */
  public static workers(subPath: string = sep): string {
    return this.pwd(this.dirs.workers + sep + normalize(subPath))
  }

  /**
   * Set the directory of workers folder.
   */
  public static setWorkers(directory: string): typeof Path {
    this.dirs.workers = directory

    return this
  }

  /**
   * Return the repositories' path of your project.
   */
  public static repositories(subPath: string = sep): string {
    return this.pwd(this.dirs.repositories + sep + normalize(subPath))
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
  public static commands(subPath: string = sep): string {
    return this.pwd(this.dirs.commands + sep + normalize(subPath))
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
  public static controllers(subPath: string = sep): string {
    return this.pwd(this.dirs.controllers + sep + normalize(subPath))
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
  public static exceptions(subPath: string = sep): string {
    return this.pwd(this.dirs.exceptions + sep + normalize(subPath))
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
  public static middlewares(subPath: string = sep): string {
    return this.pwd(this.dirs.middlewares + sep + normalize(subPath))
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
  public static interceptors(subPath: string = sep): string {
    return this.pwd(this.dirs.interceptors + sep + normalize(subPath))
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
  public static terminators(subPath: string = sep): string {
    return this.pwd(this.dirs.terminators + sep + normalize(subPath))
  }

  /**
   * Set the directory of terminators folder.
   */
  public static setTerminators(directory: string): typeof Path {
    this.dirs.terminators = directory

    return this
  }

  /**
   * Return the validators' path of your project.
   */
  public static validators(subPath: string = sep): string {
    return this.pwd(this.dirs.validators + sep + normalize(subPath))
  }

  /**
   * Set the directory of validators folder.
   */
  public static setValidators(directory: string): typeof Path {
    this.dirs.validators = directory

    return this
  }

  /**
   * Return the schedulers' path of your project.
   */
  public static schedulers(subPath: string = sep): string {
    return this.pwd(this.dirs.schedulers + sep + normalize(subPath))
  }

  /**
   * Set the directory of schedulers folder.
   */
  public static setSchedulers(directory: string): typeof Path {
    this.dirs.schedulers = directory

    return this
  }

  /**
   * Return the migrations' path of your project.
   */
  public static migrations(subPath: string = sep): string {
    return this.pwd(this.dirs.migrations + sep + normalize(subPath))
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
  public static seeders(subPath: string = sep): string {
    return this.pwd(this.dirs.seeders + sep + normalize(subPath))
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
  public static nodeModulesBin(subPath: string = sep): string {
    return this.pwd(this.dirs.nodeModulesBin + sep + normalize(subPath))
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
  public static vmTmp(subPath: string = sep): string {
    const osTmpDir = tmpdir()

    const tmpDir = osTmpDir.concat(sep, normalize(subPath))

    return this.removeSlashes(tmpDir)
  }

  /**
   * Return the home path of your vm.
   */
  public static vmHome(subPath: string = sep): string {
    const osHomeDir = homedir()

    const homeDir = osHomeDir.concat(sep, normalize(subPath))

    return this.removeSlashes(homeDir)
  }

  /**
   * Return the execution path of where this method
   * is being called.
   */
  public static this(subPath: string = sep, stackIndex = 1): string {
    const stack = callSite()
    let fileName = stack[stackIndex].getFileName()

    if (fileName.startsWith('file:')) {
      fileName = Path.toPath(fileName)
    }

    const requester = dirname(fileName)
    const execDir = normalize(requester.concat(sep, normalize(subPath)))

    return this.removeSlashes(execDir)
  }

  /**
   * Remove additional slashes from path.
   */
  private static removeSlashes(path: string): string {
    path = normalize(path)

    if (path.endsWith(sep)) {
      return this.removeSlashes(path.slice(0, -1))
    }

    return path
  }
}
