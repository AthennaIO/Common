/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Module, Path } from '#src'
import { Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'
import { NotFoundResolveException } from '#src/exceptions/NotFoundResolveException'

export default class ModuleTest {
  @Test()
  public async shouldBeAbleToGetTheModuleFirstExportMatchOrDefault({ assert }: Context) {
    const moduleDefault = await Module.get(import('../stubs/config/app.js'))

    assert.equal(moduleDefault.name, 'Athenna')

    const moduleFirstExport = await Module.get(import('#src/helpers/Options'))

    assert.equal(moduleFirstExport.name, 'Options')
  }

  @Test()
  public async shouldBeAbleToGetAllModulesFirstExportMatchOrDefault({ assert }: Context) {
    const modules = [import('../stubs/config/app.js'), import('#src/helpers/Options')]

    const modulesResolved = await Module.getAll(modules)

    assert.equal(modulesResolved[0].name, 'Athenna')
    assert.equal(modulesResolved[1].name, 'Options')
  }

  @Test()
  public async shouldBeAbleToGetAllModulesFirstExportMatchOrDefaultWithAlias({ assert }: Context) {
    const modules = [import('#src/helpers/Is'), import('#src/helpers/Options')]

    const modulesResolved = await Module.getAllWithAlias(modules, 'App/Helpers/')

    assert.equal(modulesResolved[0].module.name, 'Is')
    assert.equal(modulesResolved[0].alias, 'App/Helpers/Is')

    assert.equal(modulesResolved[1].module.name, 'Options')
    assert.equal(modulesResolved[1].alias, 'App/Helpers/Options')
  }

  @Test()
  public async shouldBeAbleToGetTheModuleFirstExportMatchOrDefaultFromAnyPath({ assert }: Context) {
    const moduleDefault = await Module.getFrom(Path.stubs('config/app.ts'))

    assert.equal(moduleDefault.name, 'Athenna')

    const moduleFirstExport = await Module.getFrom(Path.src('helpers/Options.ts'))

    assert.equal(moduleFirstExport.name, 'Options')
  }

  @Test()
  public async shouldBeAbleToGetAllModulesFirstExportMatchOrDefaultFromAnyPath({ assert }: Context) {
    const modules = await Module.getAllFrom(Path.src('helpers'))

    assert.lengthOf(modules, 19)
    assert.equal(modules[0].name, 'Clean')
  }

  @Test()
  public async shouldBeAbleToGetAllModulesFirstExportMatchOrDefaultFromAnyPathWithAlias({ assert }: Context) {
    const modules = await Module.getAllFromWithAlias(Path.src('helpers'), 'App/Helpers')

    assert.lengthOf(modules, 19)
    assert.equal(modules[0].module.name, 'Clean')
    assert.equal(modules[0].alias, 'App/Helpers/Clean')
  }

  @Test()
  public async shouldBeAbleToCreate__filenamePropertyInsideNodeGlobal({ assert }: Context) {
    Module.createFilename(import.meta.url, true)

    assert.isTrue(__filename.includes('ModuleTest.ts'))
  }

  @Test()
  public async shouldBeAbleToCreate__dirnamePropertyInsideNodeGlobal({ assert }: Context) {
    Module.createDirname(import.meta.url, true)

    assert.isTrue(__dirname.includes('unit'))
  }

  @Test()
  public async shouldBeAbleToSafeImportSomePathWithoutErrors({ assert }: Context) {
    const nullValue = await Module.safeImport(Path.pwd('not-found.ts'))

    assert.isNull(nullValue)
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve('#src/helpers/Exception', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasWithDotsInThePathByMetaUrlAndImportIt({ assert }: Context) {
    const AppController = await Module.resolve('#tests/stubs/controllers/app.controller', import.meta.url)

    assert.equal(AppController.name, 'AppController')
  }

  @Test()
  public async shouldBeAbleToResolvePartialPathsByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve('./src/helpers/Exception.js', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveAbsolutePathsByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(Path.src('helpers/Exception.js'), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedImportAliasByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(`#src/helpers/Exception?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedPartialPAthsByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(`./src/helpers/Exception.js?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedAbsolutePathsByMetaUrlAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(Path.src(`helpers/Exception.js?version=${Math.random()}`), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveModulesFromNodeModulesUsingResolve({ assert }: Context) {
    const chalk = await Module.resolve('chalk', import.meta.url)

    assert.deepEqual(chalk, (await import('chalk')).default)
  }

  @Test()
  public async shouldThrownAnExceptionWhenTheImportMetaResolveFunctionIsNotDefined({ assert }: Context) {
    process.env.RESOLVE_TESTING = 'true'

    await assert.rejects(() => Module.resolve('chalk', import.meta.url), NotFoundResolveException)

    delete process.env.RESOLVE_TESTING
  }
}
