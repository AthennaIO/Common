/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import __chalk from 'chalk'

import { test } from '@japa/runner'
import { Module, Path } from '#src'

test.group('ModuleTest', () => {
  test('should be able to get the module first export match or default', async ({ assert }) => {
    const moduleDefault = await Module.get(import('../Stubs/config/app.js'))

    assert.equal(moduleDefault.name, 'Athenna')

    const moduleFirstExport = await Module.get(import('#src/Helpers/Options'))

    assert.equal(moduleFirstExport.name, 'Options')
  })

  test('should be able to get all modules first export match or default', async ({ assert }) => {
    const modules = [import('../Stubs/config/app.js'), import('#src/Helpers/Options')]

    const modulesResolved = await Module.getAll(modules)

    assert.equal(modulesResolved[0].name, 'Athenna')
    assert.equal(modulesResolved[1].name, 'Options')
  })

  test('should be able to get all modules first export match or default with alias', async ({ assert }) => {
    const modules = [import('#src/Helpers/Is'), import('#src/Helpers/Options')]

    const modulesResolved = await Module.getAllWithAlias(modules, 'App/Helpers/')

    assert.equal(modulesResolved[0].module.name, 'Is')
    assert.equal(modulesResolved[0].alias, 'App/Helpers/Is')

    assert.equal(modulesResolved[1].module.name, 'Options')
    assert.equal(modulesResolved[1].alias, 'App/Helpers/Options')
  })

  test('should be able to get the module first export match or default from any path', async ({ assert }) => {
    const moduleDefault = await Module.getFrom(Path.stubs('config/app.ts'))

    assert.equal(moduleDefault.name, 'Athenna')

    const moduleFirstExport = await Module.getFrom(Path.src('Helpers/Options.ts'))

    assert.equal(moduleFirstExport.name, 'Options')
  })

  test('should be able to get all modules first export match or default from any path', async ({ assert }) => {
    const modules = await Module.getAllFrom(Path.src('Helpers'))

    assert.lengthOf(modules, 20)
    assert.equal(modules[0].name, 'Clean')
  })

  test('should be able to get all modules first export match or default from any path with alias', async ({
    assert,
  }) => {
    const modules = await Module.getAllFromWithAlias(Path.src('Helpers'), 'App/Helpers')

    assert.lengthOf(modules, 20)
    assert.equal(modules[0].module.name, 'Clean')
    assert.equal(modules[0].alias, 'App/Helpers/Clean')
  })

  test('should be able to create __filename property inside node global', async ({ assert }) => {
    Module.createFilename(import.meta.url, true)

    assert.isTrue(__filename.includes('ModuleTest.ts'))
  })

  test('should be able to create __dirname property inside node global', async ({ assert }) => {
    Module.createDirname(import.meta.url, true)

    assert.isTrue(__dirname.includes('Unit'))
  })

  test('should be able to safe import some path without errors', async ({ assert }) => {
    const nullValue = await Module.safeImport(Path.pwd('not-found.ts'))

    assert.isNull(nullValue)
  })

  test('should be able to resolve import alias by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve('#src/Helpers/Exception', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve partial paths by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve('./src/Helpers/Exception.js', import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve absolute paths by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve(Path.src('Helpers/Exception.js'), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve versionized import alias by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve(`#src/Helpers/Exception?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve versionized partial paths by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve(`./src/Helpers/Exception.js?version=${Math.random()}`, import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve versionized absolute paths by meta url and import it', async ({ assert }) => {
    const Exception = await Module.resolve(Path.src(`Helpers/Exception.js?version=${Math.random()}`), import.meta.url)

    assert.equal(Exception.name, 'Exception')
  })

  test('should be able to resolve modules from node_modules using resolve', async ({ assert }) => {
    const chalk = await Module.resolve('chalk', import.meta.url)

    assert.deepEqual(chalk, (await import('chalk')).default)
  })
})
