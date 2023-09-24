/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, BeforeEach, type Context } from '@athenna/test'
import { Clean, Exec, File, Folder, Is, Module, Path } from '#src'

export default class ExecTest {
  @BeforeEach()
  public async beforeEach() {
    await Folder.safeRemove(Path.storage())
  }

  @Test()
  public async shouldBeAbleToSleepTheCodeForSomeMs() {
    await Exec.sleep(10)
  }

  @Test()
  public async shouldBeAbleToExecuteACommandInTheVMAndGetTheStdout({ assert }: Context) {
    const { stdout, exitCode } = await Exec.command('ls')

    assert.equal(exitCode, 0)
    assert.isTrue(stdout.includes('README.md'))
  }

  @Test()
  public async shouldThrowAnExceptionWhenCommandFails({ assert }: Context) {
    const useCase = async () => {
      let command = 'exit 255'

      if (Is.Windows()) {
        command = 'exit /b 255'
      }

      await Exec.command(command)
    }

    await assert.rejects(useCase)
  }

  @Test()
  public async shouldBeAbleToIgnoreExceptionWhenRejectOptionIsSetToFalseInCommand({ assert }: Context) {
    const useCase = async () => {
      let command = 'exit 255'

      if (Is.Windows()) {
        command = 'exit /b 255'
      }

      await Exec.command(command, { reject: false })
    }

    await assert.doesNotRejects(useCase)
  }

  @Test()
  public async shouldBeAbleToExecuteAShellCommandInTheVMAndGetTheStdout({ assert }: Context) {
    if (Is.Windows()) {
      return
    }

    const { stdout, exitCode } = await Exec.shell('ls && cat README.md')

    assert.equal(exitCode, 0)
    assert.isTrue(stdout.includes('README.md'))
    assert.isTrue(stdout.includes('# Common'))
  }

  @Test()
  public async shouldThrowAnExceptionWhenShellCommandFails({ assert }: Context) {
    if (Is.Windows()) {
      return
    }

    const useCase = async () => {
      await Exec.shell('exit 255')
    }

    await assert.rejects(useCase)
  }

  @Test()
  public async shouldBeAbleToIgnoreExceptionWhenRejectOptionIsSetToFalseInShellCommand({ assert }: Context) {
    if (Is.Windows()) {
      return
    }

    const useCase = async () => {
      await Exec.shell('exit 255', { reject: false })
    }

    await assert.doesNotRejects(useCase)
  }

  @Test()
  public async shouldBeAbleToExecuteMultipleShellCommandsAtOnce({ assert }: Context) {
    if (Is.Windows()) {
      return
    }

    const { stdout, stderr, exitCode } = await Exec.shell('echo "error thrown" && exit 255', { reject: false })

    assert.equal(stderr, '')
    assert.equal(exitCode, 255)
    assert.isTrue(stdout.includes('error thrown'))
  }

  @Test()
  public async shouldBeAbleToExecuteANodeScriptInTheVMAndGetTheStdout({ assert }: Context) {
    const { stdout, stderr, exitCode } = await Exec.node(Path.fixtures('node-script.ts'))

    assert.equal(exitCode, 0)
    assert.equal(stdout, 'hello')
    assert.equal(stderr, 'hello')
  }

  @Test()
  public async shouldThrowAnExceptionWhenNodeScriptFails({ assert }: Context) {
    const useCase = async () => {
      await Exec.node(Path.fixtures('node-script-throw.ts'))
    }

    await assert.rejects(useCase)
  }

  @Test()
  public async shouldBeAbleToIgnoreExceptionWhenRejectOptionIsSetToFalseInNodeScript({ assert }: Context) {
    const useCase = async () => {
      await Exec.node(Path.fixtures('node-script-throw.ts'), [], { reject: false })
    }

    await assert.doesNotRejects(useCase)
  }

  @Test()
  public async shouldBeAbleToDownloadFiles({ assert }: Context) {
    const file = await Exec.download(Path.storage('downloads/node.pkg'), 'https://nodejs.org/dist/latest/node.pkg')

    assert.equal(file.base, 'node.pkg')
    assert.isTrue(await File.exists(file.path))
  }

  @Test()
  public async shouldBeAbleToPaginateACollectionOfData({ assert }: Context) {
    let i = 0
    const collection = []

    while (i < 10) {
      collection.push({
        joao: 'lenon',
        hello: 'world'
      })

      i++
    }

    const paginatedData = Exec.pagination(collection, collection.length + 1, {
      page: 0,
      limit: 10,
      resourceUrl: 'https://my-api.com/products'
    })

    assert.deepEqual(paginatedData.data, collection)
    assert.deepEqual(paginatedData.meta, {
      itemCount: 10,
      totalItems: 11,
      totalPages: 2,
      currentPage: 0,
      itemsPerPage: 10
    })
    assert.deepEqual(paginatedData.links, {
      first: 'https://my-api.com/products?limit=10',
      previous: 'https://my-api.com/products?page=0&limit=10',
      next: 'https://my-api.com/products?page=1&limit=10',
      last: 'https://my-api.com/products?page=2&limit=10'
    })
  }

  @Test()
  public async shouldBeAbleToExecuteSomeCallbackConcurrentlyInAllArrayIndexesAndGetTheValue({ assert }: Context) {
    const paths = ['#src/helpers/Clean', '#src/helpers/Collection', '#src/helpers/Color', '#src/helpers/Exception']

    const modules = await Exec.concurrently<string, unknown>(paths, async path => Module.resolve(path, import.meta.url))

    assert.deepEqual(modules[0], Clean)
  }
}
