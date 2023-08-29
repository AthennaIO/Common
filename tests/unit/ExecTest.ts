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
import { NodeCommandException } from '#src/exceptions/NodeCommandException'

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
    if (Is.Windows()) {
      return
    }

    const { stdout } = await Exec.command('ls')

    assert.isTrue(stdout.includes('README.md'))
  }

  @Test()
  public async shouldThrowAnNodeExecExceptionWhenCommandFails({ assert }: Context) {
    const useCase = async () => {
      await Exec.command('echo "error thrown" && exit 255')
    }

    await assert.rejects(useCase, NodeCommandException)
  }

  @Test()
  public async shouldBeAbleToExecuteACommandThatThrowsErrorsAndIgnoreItInUnix({ assert }: Context) {
    if (Is.Windows()) {
      return
    }

    const { stdout } = await Exec.command('echo "error thrown" && exit 255', { ignoreErrors: true })

    assert.isTrue(stdout.includes('error thrown'))
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
        hello: 'world',
      })

      i++
    }

    const paginatedData = Exec.pagination(collection, collection.length + 1, {
      page: 0,
      limit: 10,
      resourceUrl: 'https://my-api.com/products',
    })

    assert.deepEqual(paginatedData.data, collection)
    assert.deepEqual(paginatedData.meta, {
      itemCount: 10,
      totalItems: 11,
      totalPages: 2,
      currentPage: 0,
      itemsPerPage: 10,
    })
    assert.deepEqual(paginatedData.links, {
      first: 'https://my-api.com/products?limit=10',
      previous: 'https://my-api.com/products?page=0&limit=10',
      next: 'https://my-api.com/products?page=1&limit=10',
      last: 'https://my-api.com/products?page=2&limit=10',
    })
  }

  @Test()
  public async shouldBeAbleToExecuteSomeCallbackConcurrentlyInAllArrayIndexesAndGetTheValue({ assert }: Context) {
    const paths = ['#src/helpers/Clean', '#src/helpers/Collection', '#src/helpers/Color', '#src/helpers/Exception']

    const modules = await Exec.concurrently<string, unknown>(paths, async path => Module.resolve(path, import.meta.url))

    assert.deepEqual(modules[0], Clean)
  }
}
