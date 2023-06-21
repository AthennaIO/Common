/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { test } from '@japa/runner'
import { Json } from '#src/index'
import * as process from 'process'

test.group('PathTest', group => {
  let defaultDirs: any = {}

  group.each.setup(() => {
    defaultDirs = Json.copy(Path.dirs)
  })

  group.each.teardown(() => {
    Path.dirs = defaultDirs
  })

  test('should get the extension js and ts', async ({ assert }) => {
    process.env.IS_TS = 'false'
    assert.equal(Path.ext(), 'js')

    process.env.IS_TS = 'true'
    assert.equal(Path.ext(), 'ts')

    assert.isTrue(Path.pwd(`artisan.${Path.ext()}`).includes(`${sep}artisan.ts`))

    process.env.IS_TS = 'true'
  })

  test('should get pwd path', async ({ assert }) => {
    const mainPath = process.cwd()
    const srcPath = mainPath.concat(sep, 'src')
    const srcAppPath = srcPath.concat(sep, 'app')

    assert.equal(Path.pwd(), mainPath)
    assert.equal(Path.pwd(sep.concat('src')), srcPath)
    assert.equal(Path.pwd(sep.concat('src', sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep, 'app', sep, sep, sep)), srcAppPath)
  })

  test('should get the main application paths', async ({ assert }) => {
    const mainPath = process.cwd()

    assert.equal(Path.app(), mainPath.concat(sep, 'app'))
    assert.equal(Path.src(), mainPath.concat(sep, 'src'))
    assert.equal(Path.bootstrap(), mainPath.concat(sep, 'bootstrap'))
    assert.equal(Path.config(), mainPath.concat(sep, 'config'))
    assert.equal(Path.database(), mainPath.concat(sep, 'database'))
    assert.equal(Path.lang(), mainPath.concat(sep, 'lang'))
    assert.equal(Path.nodeModules(), mainPath.concat(sep, 'node_modules'))
    assert.equal(Path.providers(), mainPath.concat(sep, 'providers'))
    assert.equal(Path.public(), mainPath.concat(sep, 'public'))
    assert.equal(Path.resources(), mainPath.concat(sep, 'resources'))
    assert.equal(Path.routes(), mainPath.concat(sep, 'routes'))
    assert.equal(Path.storage(), mainPath.concat(sep, 'storage'))
    assert.equal(Path.tests(), mainPath.concat(sep, 'tests'))
    assert.isDefined(Path.vmTmp())
    assert.isDefined(Path.vmHome())
    assert.isTrue(Path.this().endsWith('unit'))
    assert.isFalse(Path.this('../../').endsWith('tests'))
    assert.isTrue(Path.this('../../package.json').endsWith('package.json'))
  })

  test('should get the sub paths of app main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'app')

    console.log('MAIN', mainPath)
    console.log('IMPL', Path.http())

    assert.equal(Path.http(), mainPath.concat(sep, 'http'))
    assert.equal(Path.console(), mainPath.concat(sep, 'console'))
    assert.equal(Path.services(), mainPath.concat(sep, 'services'))
    assert.equal(Path.exceptions(), mainPath.concat(sep, 'exceptions'))
    assert.equal(Path.repositories(), mainPath.concat(sep, 'repositories'))
  })

  test('should get the sub paths of http main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'app', sep, 'http')

    assert.equal(Path.controllers(), mainPath.concat(sep, 'controllers'))
    assert.equal(Path.middlewares(), mainPath.concat(sep, 'middlewares'))
    assert.equal(Path.interceptors(), mainPath.concat(sep, 'interceptors'))
    assert.equal(Path.terminators(), mainPath.concat(sep, 'terminators'))
  })

  test('should get the sub paths of console main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'app', sep, 'console')

    assert.equal(Path.commands(), mainPath.concat(sep, 'commands'))
  })

  test('should get the sub paths of database main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'database')

    assert.equal(Path.seeders(), mainPath.concat(sep, 'seeders'))
    assert.equal(Path.migrations(), mainPath.concat(sep, 'migrations'))
  })

  test('should get the .bin folder of node_modules main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'node_modules')

    assert.equal(Path.nodeModulesBin(), mainPath.concat(sep, '.bin'))
  })

  test('should get the sub paths of public main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'public')

    assert.equal(Path.static(), mainPath.concat(sep, 'static'))
    assert.equal(Path.assets(), mainPath.concat(sep, 'assets'))
  })

  test('should get the sub paths of tests main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'tests')

    assert.equal(Path.stubs(), mainPath.concat(sep, 'stubs'))
  })

  test('should get the sub paths of storage main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'storage')

    assert.equal(Path.logs(), mainPath.concat(sep, 'logs'))
  })

  test('should get the sub paths of resources main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'resources')

    assert.equal(Path.views(), mainPath.concat(sep, 'views'))
    assert.equal(Path.locales(), mainPath.concat(sep, 'locales'))
  })

  test('should get the sub paths of providers main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'providers')

    assert.equal(Path.facades(), mainPath.concat(sep, 'facades'))
  })

  test('should be able to setup different paths for all methods of Path class', async ({ assert }) => {
    Path.setBin('build/bin')
      .setSrc('build/src')
      .setApp('build/app')
      .setServices('build/app/services')
      .setExceptions('build/app/exceptions')
      .setRepositories('build/app/repositories')
      .setConsole('build/app/console')
      .setCommands('build/app/console/commands')
      .setHttp('build/app/http')
      .setControllers('build/app/http/controllers')
      .setMiddlewares('build/app/http/middlewares')
      .setInterceptors('build/app/http/interceptors')
      .setTerminators('build/app/http/terminators')
      .setBootstrap('build/bootstrap')
      .setConfig('build/config')
      .setDatabase('build/database')
      .setSeeders('build/database/seeders')
      .setMigrations('build/database/migrations')
      .setLang('build/lang')
      .setResources('build/resources')
      .setViews('build/resources/views')
      .setLocales('build/resources/locales')
      .setNodeModules('build/node_modules')
      .setNodeModulesBin('build/node_modules/.bin')
      .setProviders('build/providers')
      .setFacades('build/providers/facades')
      .setPublic('build/public')
      .setStatic('build/public/static')
      .setAssets('build/public/assets')
      .setRoutes('build/routes')
      .setStorage('build/storage')
      .setLogs('build/storage/logs')
      .setTests('build/tests')
      .setStubs('build/tests/stubs')

    assert.isTrue(Path.bin().endsWith(`build${sep}bin`))
    assert.isTrue(Path.src().endsWith(`build${sep}src`))
    assert.isTrue(Path.app().endsWith(`build${sep}app`))
    assert.isTrue(Path.services().endsWith(`build${sep}app${sep}services`))
    assert.isTrue(Path.exceptions().endsWith(`build${sep}app${sep}exceptions`))
    assert.isTrue(Path.repositories().endsWith(`build${sep}app${sep}repositories`))
    assert.isTrue(Path.console().endsWith(`build${sep}app${sep}console`))
    assert.isTrue(Path.commands().endsWith(`build${sep}app${sep}console${sep}commands`))
    assert.isTrue(Path.http().endsWith(`build${sep}app${sep}http`))
    assert.isTrue(Path.controllers().endsWith(`build${sep}app${sep}http${sep}controllers`))
    assert.isTrue(Path.middlewares().endsWith(`build${sep}app${sep}http${sep}middlewares`))
    assert.isTrue(Path.interceptors().endsWith(`build${sep}app${sep}http${sep}interceptors`))
    assert.isTrue(Path.terminators().endsWith(`build${sep}app${sep}http${sep}terminators`))
    assert.isTrue(Path.bootstrap().endsWith(`build${sep}bootstrap`))
    assert.isTrue(Path.config().endsWith(`build${sep}config`))
    assert.isTrue(Path.database().endsWith(`build${sep}database`))
    assert.isTrue(Path.seeders().endsWith(`build${sep}database${sep}seeders`))
    assert.isTrue(Path.migrations().endsWith(`build${sep}database${sep}migrations`))
    assert.isTrue(Path.resources().endsWith(`build${sep}resources`))
    assert.isTrue(Path.views().endsWith(`build${sep}resources${sep}views`))
    assert.isTrue(Path.locales().endsWith(`build${sep}resources${sep}locales`))
    assert.isTrue(Path.nodeModules().endsWith(`build${sep}node_modules`))
    assert.isTrue(Path.nodeModulesBin().endsWith(`build${sep}node_modules${sep}.bin`))
    assert.isTrue(Path.providers().endsWith(`build${sep}providers`))
    assert.isTrue(Path.facades().endsWith(`build${sep}providers${sep}facades`))
    assert.isTrue(Path.public().endsWith(`build${sep}public`))
    assert.isTrue(Path.static().endsWith(`build${sep}public${sep}static`))
    assert.isTrue(Path.assets().endsWith(`build${sep}public${sep}assets`))
    assert.isTrue(Path.routes().endsWith(`build${sep}routes`))
    assert.isTrue(Path.storage().endsWith(`build${sep}storage`))
    assert.isTrue(Path.logs().endsWith(`build${sep}storage${sep}logs`))
    assert.isTrue(Path.tests().endsWith(`build${sep}tests`))
    assert.isTrue(Path.stubs().endsWith(`build${sep}tests${sep}stubs`))
  })

  test('should be able to merge custom directories with defaults', async ({ assert }) => {
    Path.mergeDirs({
      app: 'build/app',
    })

    assert.isTrue(Path.bin().endsWith('bin'))
    assert.isTrue(Path.src().endsWith('src'))
    assert.isTrue(Path.app().endsWith('app'))
  })
})
