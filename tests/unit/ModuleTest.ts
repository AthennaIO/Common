/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception, Module, Path } from '#src'
import { Test, type Context, AfterEach } from '@athenna/test'

export default class ModuleTest {
  @AfterEach()
  public afterEach() {
    if (process.argv.includes('--experimental-import-meta-resolve')) {
      process.argv.splice(process.argv.indexOf('--experimental-import-meta-resolve'), 1)
    }
  }

  @Test()
  public async shouldBeAbleToGetTheModuleFirstExportMatchOrDefault({ assert }: Context) {
    const moduleDefault = await Module.get(import('../fixtures/config/app.js'))

    assert.equal(moduleDefault.name, 'Athenna')

    const moduleFirstExport = await Module.get(import('#src/helpers/Options'))

    assert.equal(moduleFirstExport.name, 'Options')
  }

  @Test()
  public async shouldBeAbleToGetAllModulesFirstExportMatchOrDefault({ assert }: Context) {
    const modules = [import('../fixtures/config/app.js'), import('#src/helpers/Options')]

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
    const moduleDefault = await Module.getFrom(Path.fixtures('config/app.ts'))

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
  public async shouldBeAbleToResolveImportAliasByParentURLUsingRequireResolveAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve('#src/helpers/Exception', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasByParentURLUsingImportMetaResolveAndImportIt({ assert }: Context) {
    process.argv.push('--experimental-import-meta-resolve')

    const Exception = await Module.resolve('#src/helpers/Exception', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasWithDotsInThePathByParentURLUsingRequireResolveAndImportIt({
    assert
  }: Context) {
    const AppController = await Module.resolve('#tests/fixtures/controllers/app.controller', import.meta.url)

    assert.equal(AppController.name, 'AppController')
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasWithDotsInThePathByParentURLUsingImportMetaResolveAndImportIt({
    assert
  }: Context) {
    process.argv.push('--experimental-import-meta-resolve')

    const AppController = await Module.resolve('#tests/fixtures/controllers/app.controller', import.meta.url)

    assert.equal(AppController.name, 'AppController')
  }

  @Test()
  public async shouldBeAbleToResolveRelativePathsByParentURLUsingURLAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve('../../src/helpers/Exception.js', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveRelativePathsWithDotsByParentURLUsingURLAndImportIt({ assert }: Context) {
    const AppController = await Module.resolve('../fixtures/controllers/app.controller.js', import.meta.url)

    assert.equal(AppController.name, 'AppController')
  }

  @Test()
  public async shouldBeAbleToResolveAbsolutePathsByParentURLAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(Path.src('helpers/Exception.js'), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveAbsolutePathsWithDotsByParentURLAndImportIt({ assert }: Context) {
    const AppController = await Module.resolve(Path.fixtures('controllers/app.controller.js'), import.meta.url)

    assert.equal(AppController.name, 'AppController')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedImportAliasByParentURLAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(`#src/helpers/Exception?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedRelativePathsByParentURLAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(`../../src/helpers/Exception.js?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveVersionedAbsolutePathsByParentURLAndImportIt({ assert }: Context) {
    const Exception = await Module.resolve(Path.src(`helpers/Exception.js?version=${Math.random()}`), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  }

  @Test()
  public async shouldBeAbleToResolveModulesFromNodeModulesUsingRequireResolve({ assert }: Context) {
    const chalk = await Module.resolve('chalk', import.meta.url)

    assert.deepEqual(chalk, (await import('chalk')).default)
  }

  @Test()
  public async shouldBeAbleToResolveModulesFromNodeModulesUsingImportMetaResolve({ assert }: Context) {
    process.argv.push('--experimental-import-meta-resolve')

    const chalk = await Module.resolve('chalk', import.meta.url)

    assert.deepEqual(chalk, (await import('chalk')).default)
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasPathAndGetThePathAsResult({ assert }: Context) {
    const path = await Module.resolve('#src/helpers/Exception', import.meta.url, { import: false })

    assert.isTrue(path.startsWith('file:'))
    assert.isTrue(path.includes('src/helpers/Exception.js'))
  }

  @Test()
  public async shouldBeAbleToResolveRelativePathAndGetThePathAsResult({ assert }: Context) {
    const path = await Module.resolve('../../src/helpers/Exception.js', import.meta.url, { import: false })

    assert.isTrue(path.startsWith('file:'))
    assert.isTrue(path.includes('src/helpers/Exception.js'))
  }

  @Test()
  public async shouldBeAbleToResolveAbsolutePathAndGetThePathAsResult({ assert }: Context) {
    const path = await Module.resolve(Path.src('helpers/Exception.js'), import.meta.url, { import: false })

    assert.isTrue(path.startsWith('file:'))
    assert.isTrue(path.includes('src/helpers/Exception.js'))
  }

  @Test()
  public async shouldBeAbleToResolveLibsFromNodeModulesAndGetThePathAsResult({ assert }: Context) {
    const path = await Module.resolve('chalk', import.meta.url, { import: false })

    assert.isTrue(path.startsWith('file:'))
    assert.isTrue(path.includes('node_modules/chalk/source/index.js'))
  }

  @Test()
  public async shouldBeAbleToResolveImportAliasPathAndGetAllTheModuleAsResult({ assert }: Context) {
    const module = await Module.resolve('#src/helpers/Exception', import.meta.url, { import: true, getModule: false })

    assert.deepEqual(module.Exception, Exception)
  }

  @Test()
  public async shouldBeAbleToResolveRelativePathAndGetAllTheModuleAsResult({ assert }: Context) {
    const module = await Module.resolve('../../src/helpers/Exception.js', import.meta.url, {
      import: true,
      getModule: false
    })

    assert.deepEqual(module.Exception, Exception)
  }

  @Test()
  public async shouldBeAbleToResolveAbsolutePathAndGetAllTheModuleAsResult({ assert }: Context) {
    const module = await Module.resolve(Path.src('helpers/Exception.js'), import.meta.url, {
      import: true,
      getModule: false
    })

    assert.deepEqual(module.Exception, Exception)
  }

  @Test()
  public async shouldBeAbleToResolveLibsFromNodeModulesAndGetAllTheModuleThePathAsResult({ assert }: Context) {
    const module = await Module.resolve('chalk', import.meta.url, {
      import: true,
      getModule: false
    })

    assert.deepEqual(module, await import('chalk'))
  }
}
