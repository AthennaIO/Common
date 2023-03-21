/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path, File, Exec, Folder, Is } from '#src'

/*
|--------------------------------------------------------------------------
| TypeScript build file path
|--------------------------------------------------------------------------
|
| Where the TypeScript build file will be saved.
*/

const path = Path.nodeModules('@athenna/tsconfig.build.json')

async function beforeAll() {
  const tsconfig = await new File('../tsconfig.json').getContentAsBuilder()

  tsconfig.delete('ts-node')
  tsconfig.set('include', ['../../src'])
  tsconfig.set('compilerOptions.rootDir', '../../src')
  tsconfig.set('compilerOptions.outDir', '../../build')
  tsconfig.set('exclude', ['../../bin', '../../node_modules', '../../tests'])

  const oldBuild = new Folder(Path.pwd('/build'))
  await new File(path, JSON.stringify(tsconfig.get())).load()

  if (oldBuild.folderExists) {
    await oldBuild.remove()
  }
}

async function afterAll() {
  const tsConfigBuild = await new File(path).load()

  if (tsConfigBuild.fileExists) {
    await tsConfigBuild.remove()
  }
}

/*
|--------------------------------------------------------------------------
| Compilation
|--------------------------------------------------------------------------
|
| Executing compilation and deleting the tsconfig.build file generated.
*/

try {
  await beforeAll()

  const { stdout } = await Exec.command(
    `node_modules/.bin/tsc --project ${path}`,
  )

  if (stdout) {
    console.log(stdout)
  }
} catch (error) {
  if (!Is.Exception(error)) {
    // eslint-disable-next-line no-ex-assign
    error = error.toAthennaException()
  }

  console.error(await error.prettify())
} finally {
  await afterAll()
}
