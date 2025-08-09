/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { Path, Json, type PathDirs } from '#src'
import { Test, BeforeEach, type Context } from '@athenna/test'

export default class PathTest {
  public defaultPathDirs: PathDirs = Json.copy(Path.dirs)

  @BeforeEach()
  public async beforeEach() {
    Path.dirs = this.defaultPathDirs
  }

  @Test()
  public async shouldGetTheExtensionJsAndTs({ assert }: Context) {
    process.env.IS_TS = 'false'
    assert.equal(Path.ext(), 'js')

    process.env.IS_TS = 'true'
    assert.equal(Path.ext(), 'ts')

    assert.isTrue(Path.pwd(`artisan.${Path.ext()}`).includes(`${sep}artisan.ts`))

    process.env.IS_TS = 'true'
  }

  @Test()
  public async shouldGetPwdPath({ assert }: Context) {
    const mainPath = process.cwd()
    const srcPath = mainPath.concat(sep, 'src')
    const srcAppPath = srcPath.concat(sep, 'app')

    assert.equal(Path.pwd(), mainPath)
    assert.equal(Path.pwd(sep.concat('src')), srcPath)
    assert.equal(Path.pwd(sep.concat('src', sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep, 'app', sep, sep, sep)), srcAppPath)
  }

  @Test()
  public async shouldGetTheMainApplicationPaths({ assert }: Context) {
    const mainPath = process.cwd()

    assert.equal(Path.bin(), mainPath.concat(sep, 'bin'))
    assert.equal(Path.src(), mainPath.concat(sep, 'src'))
    assert.equal(Path.app(), mainPath.concat(sep, 'app'))
    assert.equal(Path.bootstrap(), mainPath.concat(sep, 'bootstrap'))
    assert.equal(Path.nodeModules(), mainPath.concat(sep, 'node_modules'))
    assert.equal(Path.public(), mainPath.concat(sep, 'public'))
    assert.equal(Path.tests(), mainPath.concat(sep, 'tests'))
    assert.isDefined(Path.vmTmp())
    assert.isDefined(Path.vmHome())
    assert.isTrue(Path.this().endsWith('helpers'))
    assert.isFalse(Path.this('../../').endsWith('unit'))
    assert.isTrue(Path.this('../../package.json').endsWith('package.json'))
  }

  @Test()
  public async shouldGetTheSubPathsOfSrcMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src')

    assert.equal(Path.http(), mainPath.concat(sep, 'http'))
    assert.equal(Path.cron(), mainPath.concat(sep, 'cron'))
    assert.equal(Path.console(), mainPath.concat(sep, 'console'))
    assert.equal(Path.models(), mainPath.concat(sep, 'models'))
    assert.equal(Path.services(), mainPath.concat(sep, 'services'))
    assert.equal(Path.jobs(), mainPath.concat(sep, 'jobs'))
    assert.equal(Path.workers(), mainPath.concat(sep, 'workers'))
    assert.equal(Path.validators(), mainPath.concat(sep, 'validators'))
    assert.equal(Path.exceptions(), mainPath.concat(sep, 'exceptions'))
    assert.equal(Path.repositories(), mainPath.concat(sep, 'repositories'))
  }

  @Test()
  public async shouldGetTheSubPathsOfHttpMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src', sep, 'http')

    assert.equal(Path.controllers(), mainPath.concat(sep, 'controllers'))
    assert.equal(Path.middlewares(), mainPath.concat(sep, 'middlewares'))
    assert.equal(Path.interceptors(), mainPath.concat(sep, 'interceptors'))
    assert.equal(Path.terminators(), mainPath.concat(sep, 'terminators'))
  }

  @Test()
  public async shouldGetTheSubPathsOfConsoleMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src', sep, 'console')

    assert.equal(Path.commands(), mainPath.concat(sep, 'commands'))
  }

  @Test()
  public async shouldGetTheSubPathsOfCronMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src', sep, 'cron')

    assert.equal(Path.schedulers(), mainPath.concat(sep, 'schedulers'))
  }

  @Test()
  public async shouldGetTheSubPathsOfDatabaseMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src', sep, 'database')

    assert.equal(Path.seeders(), mainPath.concat(sep, 'seeders'))
    assert.equal(Path.migrations(), mainPath.concat(sep, 'migrations'))
  }

  @Test()
  public async shouldGetTheDotBinFolderOfNodeModulesMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'node_modules')

    assert.equal(Path.nodeModulesBin(), mainPath.concat(sep, '.bin'))
  }

  @Test()
  public async shouldGetTheSubPathsOfPublicMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'public')

    assert.equal(Path.static(), mainPath.concat(sep, 'static'))
    assert.equal(Path.assets(), mainPath.concat(sep, 'assets'))
  }

  @Test()
  public async shouldGetTheSubOPathsOfTestsMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'tests')

    assert.equal(Path.fixtures(), mainPath.concat(sep, 'fixtures'))
  }

  @Test()
  public async shouldGetTheSubPathsOfStorageMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'src', sep, 'storage')

    assert.equal(Path.logs(), mainPath.concat(sep, 'logs'))
  }

  @Test()
  public async shouldGetTheSubPathsOfResourcesMainPath({ assert }: Context) {
    const mainPath = process.cwd().concat(sep, 'resources')

    assert.equal(Path.views(), mainPath.concat(sep, 'views'))
    assert.equal(Path.locales(), mainPath.concat(sep, 'locales'))
  }

  @Test()
  public async shouldBeAbleToSetupDifferentPathsForAllMethodsOfPathClass({ assert }: Context) {
    Path.setBin('build/bin')
      .setSrc('build/src')
      .setApp('build/app')
      .setModels('build/src/models')
      .setServices('build/src/services')
      .setJobs('build/src/jobs')
      .setWorkers('build/src/workers')
      .setValidators('build/src/validators')
      .setExceptions('build/src/exceptions')
      .setRepositories('build/src/repositories')
      .setConsole('build/src/console')
      .setCommands('build/src/console/commands')
      .setHttp('build/src/http')
      .setGuards('build/src/http/guards')
      .setControllers('build/src/http/controllers')
      .setMiddlewares('build/src/http/middlewares')
      .setInterceptors('build/src/http/interceptors')
      .setTerminators('build/src/http/terminators')
      .setCron('build/src/cron')
      .setSchedulers('/build/src/cron/schedulers')
      .setBootstrap('build/bootstrap')
      .setConfig('build/src/config')
      .setDatabase('build/src/database')
      .setSeeders('build/src/database/seeders')
      .setMigrations('build/src/database/migrations')
      .setLang('build/src/lang')
      .setResources('build/resources')
      .setApiResources('build/src/resources')
      .setViews('build/resources/views')
      .setLocales('build/resources/locales')
      .setNodeModules('build/node_modules')
      .setNodeModulesBin('build/node_modules/.bin')
      .setProviders('build/src/providers')
      .setFacades('build/src/facades')
      .setPublic('build/public')
      .setStatic('build/public/static')
      .setAssets('build/public/assets')
      .setRoutes('build/src/routes')
      .setStorage('build/src/storage')
      .setLogs('build/src/storage/logs')
      .setTests('build/tests')
      .setStubs('build/tests/stubs')
      .setFixtures('build/tests/fixtures')

    assert.isTrue(Path.bin().endsWith(`build${sep}bin`))
    assert.isTrue(Path.src().endsWith(`build${sep}src`))
    assert.isTrue(Path.app().endsWith(`build${sep}app`))
    assert.isTrue(Path.models().endsWith(`build${sep}src${sep}models`))
    assert.isTrue(Path.services().endsWith(`build${sep}src${sep}services`))
    assert.isTrue(Path.jobs().endsWith(`build${sep}src${sep}jobs`))
    assert.isTrue(Path.workers().endsWith(`build${sep}src${sep}workers`))
    assert.isTrue(Path.validators().endsWith(`build${sep}src${sep}validators`))
    assert.isTrue(Path.exceptions().endsWith(`build${sep}src${sep}exceptions`))
    assert.isTrue(Path.repositories().endsWith(`build${sep}src${sep}repositories`))
    assert.isTrue(Path.console().endsWith(`build${sep}src${sep}console`))
    assert.isTrue(Path.commands().endsWith(`build${sep}src${sep}console${sep}commands`))
    assert.isTrue(Path.http().endsWith(`build${sep}src${sep}http`))
    assert.isTrue(Path.guards().endsWith(`build${sep}src${sep}http${sep}guards`))
    assert.isTrue(Path.controllers().endsWith(`build${sep}src${sep}http${sep}controllers`))
    assert.isTrue(Path.middlewares().endsWith(`build${sep}src${sep}http${sep}middlewares`))
    assert.isTrue(Path.interceptors().endsWith(`build${sep}src${sep}http${sep}interceptors`))
    assert.isTrue(Path.terminators().endsWith(`build${sep}src${sep}http${sep}terminators`))
    assert.isTrue(Path.cron().endsWith(`build${sep}src${sep}cron`))
    assert.isTrue(Path.schedulers().endsWith(`build${sep}src${sep}cron${sep}schedulers`))
    assert.isTrue(Path.bootstrap().endsWith(`build${sep}bootstrap`))
    assert.isTrue(Path.config().endsWith(`build${sep}src${sep}config`))
    assert.isTrue(Path.database().endsWith(`build${sep}src${sep}database`))
    assert.isTrue(Path.seeders().endsWith(`build${sep}src${sep}database${sep}seeders`))
    assert.isTrue(Path.migrations().endsWith(`build${sep}src${sep}database${sep}migrations`))
    assert.isTrue(Path.resources().endsWith(`build${sep}src${sep}resources`))
    assert.isTrue(Path.apiResources().endsWith(`build${sep}src${sep}resources${sep}resources`))
    assert.isTrue(Path.views().endsWith(`build${sep}src${sep}resources${sep}views`))
    assert.isTrue(Path.locales().endsWith(`build${sep}src${sep}resources${sep}locales`))
    assert.isTrue(Path.nodeModules().endsWith(`build${sep}node_modules`))
    assert.isTrue(Path.nodeModulesBin().endsWith(`build${sep}node_modules${sep}.bin`))
    assert.isTrue(Path.providers().endsWith(`build${sep}src${sep}providers`))
    assert.isTrue(Path.facades().endsWith(`build${sep}src${sep}facades`))
    assert.isTrue(Path.public().endsWith(`build${sep}public`))
    assert.isTrue(Path.static().endsWith(`build${sep}public${sep}static`))
    assert.isTrue(Path.assets().endsWith(`build${sep}public${sep}assets`))
    assert.isTrue(Path.routes().endsWith(`build${sep}src${sep}routes`))
    assert.isTrue(Path.storage().endsWith(`build${sep}src${sep}storage`))
    assert.isTrue(Path.logs().endsWith(`build${sep}src${sep}storage${sep}logs`))
    assert.isTrue(Path.tests().endsWith(`build${sep}tests`))
    assert.isTrue(Path.stubs().endsWith(`build${sep}tests${sep}stubs`))
    assert.isTrue(Path.fixtures().endsWith(`build${sep}tests${sep}fixtures`))
  }

  @Test()
  public shouldBeAbleToMergeCustomDirectoriesWithDefaults({ assert }: Context) {
    Path.mergeDirs({
      app: 'build/app'
    })

    assert.isTrue(Path.bin().endsWith('bin'))
    assert.isTrue(Path.src().endsWith('src'))
    assert.isTrue(Path.app().endsWith('app'))
  }

  @Test()
  public shouldBeAbleToRemoveExtensionOfFilePath({ assert }: Context) {
    assert.equal(Path.removeExt('file.ts'), 'file')
    assert.equal(Path.removeExt('file.js'), 'file')
    assert.equal(Path.removeExt('file'), 'file')
    assert.equal(Path.removeExt(Path.app('hello.js')), Path.app('hello'))
    assert.equal(Path.removeExt(Path.app('hello.java')), Path.app('hello'))
    assert.equal(Path.removeExt(Path.app('hello')), Path.app('hello'))
    assert.equal(Path.removeExt(Path.app('hello.service.js')), Path.app('hello.service'))
    assert.equal(Path.removeExt(Path.app('hello.service.ts')), Path.app('hello.service'))
  }

  @Test()
  public shouldBeAbleToParseExtensionOfFilePathUsingPathExt({ assert }: Context) {
    assert.equal(Path.parseExt('file.ts'), 'file.ts')
    assert.equal(Path.parseExt('file.js'), 'file.ts')
    assert.equal(Path.parseExt('file'), 'file')
    assert.equal(Path.parseExt(Path.app('hello.js')), Path.app('hello.ts'))
    assert.equal(Path.parseExt(Path.app('hello.java')), Path.app('hello.ts'))
    assert.equal(Path.parseExt(Path.app('hello')), Path.app('hello'))
    assert.equal(Path.parseExt(Path.app('hello.service.js')), Path.app('hello.service.ts'))
    assert.equal(Path.parseExt(Path.app('hello.service.ts')), Path.app('hello.service.ts'))
  }
}
