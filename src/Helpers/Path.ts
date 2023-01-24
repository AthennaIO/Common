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
import { dirname, normalize, sep } from 'node:path'

export class Path {
  /**
   * Set a default beforePath for all Path methods that
   * use Path.pwd.
   */
  public static defaultBeforePath = ''

  /**
   * Resolve the environment where the application
   * is running by verifying the import.meta.url.
   *
   * This method will auto set the IS_TS env and the
   * defaultBeforePath if IS_TS is true.
   *
   * The beforePath is always set as '/build' by default.
   */
  public static resolveEnvironment(
    metaUrl: string,
    beforePath = '',
  ): typeof Path {
    const isTs = metaUrl.endsWith('.ts') ? 'true' : 'false'

    process.env.IS_TS = process.env.IS_TS || isTs
    this.defaultBeforePath = process.env.IS_TS === 'true' ? '' : beforePath

    return this
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
  public static pwd(subPath = sep): string {
    if (Path.defaultBeforePath) {
      subPath = normalize(Path.defaultBeforePath).concat(sep, subPath)
    }

    const pwd = normalize(`${process.cwd()}${sep}${normalize(subPath)}`)

    return this.removeSlashes(pwd)
  }

  /**
   * Return the app path of your project.
   */
  public static app(subPath = sep): string {
    return this.pwd('app' + sep + normalize(subPath))
  }

  /**
   * Return the bootstrap path of your project.
   */
  public static bootstrap(subPath = sep): string {
    return this.pwd('bootstrap' + sep + normalize(subPath))
  }

  /**
   * Return the config path of your project.
   */
  public static config(subPath = sep): string {
    return this.pwd('config' + sep + normalize(subPath))
  }

  /**
   * Return the database path of your project.
   */
  public static database(subPath = sep): string {
    return this.pwd('database' + sep + normalize(subPath))
  }

  /**
   * Return the lang path of your project.
   */
  public static lang(subPath = sep): string {
    return this.pwd('lang' + sep + normalize(subPath))
  }

  /**
   * Return the node_modules path of your project.
   */
  public static nodeModules(subPath = sep): string {
    return this.pwd('node_modules' + sep + normalize(subPath))
  }

  /**
   * Return the providers' path of your project.
   */
  public static providers(subPath = sep): string {
    return this.pwd('providers' + sep + normalize(subPath))
  }

  /**
   * Return the public path of your project.
   */
  public static public(subPath = sep): string {
    return this.pwd('public' + sep + normalize(subPath))
  }

  /**
   * Return the resources' path of your project.
   */
  public static resources(subPath = sep): string {
    return this.pwd('resources' + sep + normalize(subPath))
  }

  /**
   * Return the routes' path of your project.
   */
  public static routes(subPath = sep): string {
    return this.pwd('routes' + sep + normalize(subPath))
  }

  /**
   * Return the storage path of your project.
   */
  public static storage(subPath = sep): string {
    return this.pwd('storage' + sep + normalize(subPath))
  }

  /**
   * Return the tests' path of your project.
   */
  public static tests(subPath = sep): string {
    return this.pwd('tests' + sep + normalize(subPath))
  }

  /**
   * Return the logs' path of your project.
   */
  public static logs(subPath = sep): string {
    return this.storage('logs' + sep + normalize(subPath))
  }

  /**
   * Return the views' path of your project.
   */
  public static views(subPath = sep): string {
    return this.resources('views' + sep + normalize(subPath))
  }

  /**
   * Return the assets' path of your project.
   */
  public static assets(subPath = sep): string {
    return this.public('assets' + sep + normalize(subPath))
  }

  /**
   * Return the locales' path of your project.
   */
  public static locales(subPath = sep): string {
    return this.resources('locales' + sep + normalize(subPath))
  }

  /**
   * Return the facades' path of your project.
   */
  public static facades(subPath = sep): string {
    return this.providers('Facades' + sep + normalize(subPath))
  }

  /**
   * Return the stubs' path of your project.
   */
  public static stubs(subPath = sep): string {
    return this.tests('Stubs' + sep + normalize(subPath))
  }

  /**
   * Return the http path of your project.
   */
  public static http(subPath = sep): string {
    return this.app('Http' + sep + normalize(subPath))
  }

  /**
   * Return the console path of your project.
   */
  public static console(subPath = sep): string {
    return this.app('Console' + sep + normalize(subPath))
  }

  /**
   * Return the services' path of your project.
   */
  public static services(subPath = sep): string {
    return this.app('Services' + sep + normalize(subPath))
  }

  /**
   * Return the repositories' path of your project.
   */
  public static repositories(subPath = sep): string {
    return this.app('Repositories' + sep + normalize(subPath))
  }

  /**
   * Return the migrations' path of your project.
   */
  public static migrations(subPath = sep): string {
    return this.database('migrations' + sep + normalize(subPath))
  }

  /**
   * Return the seeders' path of your project.
   */
  public static seeders(subPath = sep): string {
    return this.database('seeders' + sep + normalize(subPath))
  }

  /**
   * Return the .bin path of your node_modules.
   */
  public static bin(subPath = sep): string {
    return this.nodeModules('.bin' + sep + normalize(subPath))
  }

  /**
   * Return the tmp path of your vm.
   */
  public static vmTmp(subPath = sep): string {
    const osTmpDir = tmpdir()

    const tmpDir = osTmpDir.concat(sep, normalize(subPath))

    return this.removeSlashes(tmpDir)
  }

  /**
   * Return the home path of your vm.
   */
  public static vmHome(subPath = sep): string {
    const osHomeDir = homedir()

    const homeDir = osHomeDir.concat(sep, normalize(subPath))

    return this.removeSlashes(homeDir)
  }

  /**
   * Return the execution path of where this method
   * is being called.
   */
  public static this(subPath = sep, stackIndex = 1): string {
    const stack = callSite()
    const requester = dirname(fileURLToPath(stack[stackIndex].getFileName()))
    const execDir = normalize(requester.concat(sep, normalize(subPath)))

    return this.removeSlashes(execDir)
  }

  /**
   * Remove additional slashes from path.
   */
  private static removeSlashes(path: string): string {
    if (path.endsWith(sep)) {
      path = path.slice(0, -1)

      if (path.endsWith(sep)) {
        return this.removeSlashes(path)
      }
    }

    return path
  }
}
