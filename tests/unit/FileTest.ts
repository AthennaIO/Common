/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { File, Path, Folder } from '#src'
import { Test, AfterEach, BeforeEach, type Context } from '@athenna/test'
import { NotFoundFileException } from '#src/exceptions/NotFoundFileException'

export default class FileTest {
  private bigFile: File = null
  private nonexistentFile: File = null

  private bigFilePath = Path.storage('files/file.txt')
  private nonexistentFilePath = Path.storage('files/non-existent.txt')

  @BeforeEach()
  public async beforeEach() {
    await File.safeRemove(this.bigFilePath)
    await File.safeRemove(this.nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(this.bigFilePath, 1024 * 1024 * 100)

    this.bigFile = new File(this.bigFilePath)
    this.nonexistentFile = new File(this.nonexistentFilePath, Buffer.from('Content'))
  }

  @AfterEach()
  public async afterEach() {
    await File.safeRemove(this.bigFilePath)
    await File.safeRemove(this.nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    this.bigFile = null
    this.nonexistentFile = null
  }

  @Test()
  public async shouldBeAbleToVerifyIfPathIsFromFileOrDirectory({ assert }: Context) {
    assert.isFalse(await File.isFile('../../tests'))
    assert.isTrue(await File.isFile('../../package.json'))

    assert.isFalse(File.isFileSync('../../tests'))
    assert.isTrue(File.isFileSync('../../package.json'))
  }

  @Test()
  public async shouldBeAbleToInstantiateANewFileAsString({ assert }: Context) {
    const mockedFile = new File(Path.storage('files/testing/.js'), 'Content', true)

    assert.isDefined(mockedFile.name)
    assert.notEqual(mockedFile.name, '.js')
    assert.notEqual(mockedFile.name, 'testing')
  }

  @Test()
  public async shouldBeAbleToCreateFilesWithMockedValues({ assert }: Context) {
    const mockedFile = new File(Path.storage('files/testing/.js'), Buffer.from('Content'), true)

    assert.isDefined(mockedFile.name)
    assert.notEqual(mockedFile.name, '.js')
    assert.notEqual(mockedFile.name, 'testing')
  }

  @Test()
  public async shouldThrowAnErrorWhenTryingToCreateAnInstanceOfAFileThatDoesntExist({ assert }: Context) {
    const useCase = () => new File(Path.pwd('not-found.txt'))

    assert.throws(useCase, NotFoundFileException)
  }

  @Test()
  public async shouldBeAbleToGenerateInstanceOfFilesUsingRelativePaths({ assert }: Context) {
    const relativePathFile = new File('../../package.json')

    assert.isTrue(relativePathFile.fileExists)
    assert.equal(relativePathFile.base, 'package.json')
  }

  @Test()
  public async shouldBeAbleToGenerateInstanceOfFilesThatHasDotsInThePath({ assert }: Context) {
    const file = new File(Path.fixtures('controllers/app.controller.ts'))

    assert.isTrue(file.fileExists)
    assert.equal(file.extension, '.ts')
    assert.equal(file.name, 'app.controller')
    assert.equal(file.base, 'app.controller.ts')
  }

  @Test()
  public async shouldBeAbleToGenerateInstanceOfFilesWithJsMapExtension({ assert }: Context) {
    const file = new File(Path.fixtures('extensions/file.js.map'))

    assert.isTrue(file.fileExists)
    assert.equal(file.name, 'file')
    assert.equal(file.base, 'file.js.map')
    assert.equal(file.extension, '.js.map')
  }

  @Test()
  public async shouldBeAbleToGenerateInstanceOfFilesWithDTsExtension({ assert }: Context) {
    const file = new File(Path.fixtures('extensions/file.d.ts'))

    assert.isTrue(file.fileExists)
    assert.equal(file.name, 'file')
    assert.equal(file.base, 'file.d.ts')
    assert.equal(file.extension, '.d.ts')
  }

  @Test()
  public async shouldGenerateAnInstanceOfAFileItExistingOrNot({ assert }: Context) {
    assert.equal(this.bigFile.path, this.bigFilePath)
    assert.equal(this.bigFile.mime, 'text/plain')
    assert.equal(this.bigFile.originalPath, this.bigFilePath)
    assert.isTrue(this.bigFile.originalFileExists)
    assert.equal(this.bigFile.dir, this.bigFilePath.replace(`${sep}file.txt`, ''))

    assert.isDefined(this.nonexistentFile.base)
    assert.isDefined(this.nonexistentFile.path)
    assert.equal(this.nonexistentFile.mime, 'text/plain')
    assert.isFalse(this.nonexistentFile.originalFileExists)
    assert.equal(this.nonexistentFile.originalPath, this.nonexistentFilePath)
    assert.equal(this.nonexistentFile.originalBase, 'non-existent.txt')
  }

  @Test()
  public async shouldOnlyLoadTheBigFileBecauseItAlreadyExists({ assert }: Context) {
    assert.isUndefined(this.bigFile.content)
    assert.isTrue(this.bigFile.fileExists)

    // Load the file because it already exists.
    this.bigFile.loadSync({ withContent: true })

    assert.isDefined(this.bigFile.content)
    assert.isTrue(this.bigFile.originalFileExists)
    assert.isTrue(this.bigFile.fileSize.includes('MB'))
    assert.isTrue(await File.exists(this.bigFile.path))
  }

  @Test()
  public async shouldCreateTheNonExistentFileBecauseItDoesntExists({ assert }: Context) {
    assert.isDefined(this.nonexistentFile.content)
    assert.isFalse(this.nonexistentFile.fileExists)

    // Create the file because it doesn't exist.
    await this.nonexistentFile.load({ withContent: true })

    assert.isDefined(this.nonexistentFile.content)
    assert.isTrue(this.nonexistentFile.fileExists)
    assert.isFalse(this.nonexistentFile.originalFileExists)
    assert.isTrue(this.nonexistentFile.fileSize.includes('B'))
    assert.isTrue(await File.exists(this.nonexistentFile.path))
  }

  @Test()
  public async shouldBeAbleToGeTheFileInformationInJsonFormat({ assert }: Context) {
    assert.equal(this.bigFile.toJSON().name, this.bigFile.name)
    assert.equal(this.nonexistentFile.toJSON().name, this.nonexistentFile.name)
  }

  @Test()
  public async shouldBeAbleToRemoveFiles({ assert }: Context) {
    await this.bigFile.remove()

    assert.isFalse(await File.exists(this.bigFile.path))
  }

  @Test()
  public async shouldThrowAnNotFoundExceptionWhenTryingToRemoveBigFile({ assert }: Context) {
    await this.bigFile.remove()

    const useCase = async () => await this.bigFile.remove()

    await assert.rejects(useCase, NotFoundFileException)
  }

  @Test()
  public async shouldThrowANotFoundExceptionWhenTryingToRemoveNonExistentFile({ assert }: Context) {
    const useCase = () => this.nonexistentFile.removeSync()

    assert.throws(useCase, NotFoundFileException)
  }

  @Test()
  public async shouldBeAbleToMakeACopyOfTheFile({ assert }: Context) {
    const copyOfBigFile = await this.bigFile.copy(Path.storage('files/testing/copy-big-file.txt'), {
      withContent: false
    })

    assert.isDefined(await File.exists(this.bigFile.path))
    assert.isDefined(await File.exists(copyOfBigFile.path))
    assert.isUndefined(copyOfBigFile.content)
    assert.isTrue(copyOfBigFile.isCopy)

    const copyOfNoExistFile = this.nonexistentFile.copySync(Path.storage('testing/copy-non-existent-file.txt'))

    assert.isDefined(await File.exists(this.nonexistentFile.path))
    assert.isDefined(await File.exists(copyOfNoExistFile.path))
    assert.isDefined(copyOfNoExistFile.content)
    assert.isTrue(copyOfNoExistFile.isCopy)
  }

  @Test()
  public async shouldBeAbleToMoveTheFile({ assert }: Context) {
    const moveOfBigFile = await this.bigFile.move(Path.storage('testing/move-big-file.txt'), {
      withContent: false
    })

    assert.isFalse(await File.exists(this.bigFile.path))
    assert.isDefined(await File.exists(moveOfBigFile.path))
    assert.isUndefined(moveOfBigFile.content)

    const moveOfNoExistFile = this.nonexistentFile.moveSync(Path.storage('testing/move-non-existent-file.txt'))

    assert.isFalse(await File.exists(this.nonexistentFile.path))
    assert.isTrue(await File.exists(moveOfNoExistFile.path))
    assert.isDefined(moveOfNoExistFile.content)
  }

  @Test()
  public async shouldBeAbleToAppendDataToTheFile({ assert }: Context) {
    await this.bigFile.append('Hello World!')
    this.nonexistentFile.appendSync('Hello World!')

    const bigFileContent = await this.bigFile.getContent()
    const nonexistentFileContent = this.nonexistentFile.getContentSync()

    assert.isTrue(bigFileContent.toString().endsWith('Hello World!'))
    assert.isTrue(nonexistentFileContent.toString().endsWith('Hello World!'))
  }

  @Test()
  public async shouldBeAbleToPrependDataToTheFile({ assert }: Context) {
    await this.bigFile.prepend('Hello World!')
    this.nonexistentFile.prependSync('Hello World!')

    const bigFileContent = await this.bigFile.getContent()
    const nonexistentFileContent = this.nonexistentFile.getContentSync()

    assert.isTrue(bigFileContent.toString().startsWith('Hello World!'))
    assert.isTrue(nonexistentFileContent.toString().startsWith('Hello World!'))
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentSeparately({ assert }: Context) {
    const bigFileContent = await this.bigFile.getContent()
    const nonexistentFileContent = this.nonexistentFile.getContentSync({ saveContent: true })

    this.nonexistentFile.content = null
    await this.nonexistentFile.getContent({ saveContent: true })
    await this.nonexistentFile.getContent({ saveContent: true })

    assert.instanceOf(bigFileContent, Buffer)
    assert.instanceOf(nonexistentFileContent, Buffer)
  }

  @Test()
  public async shouldBeAbleToSetTheFileContent({ assert }: Context) {
    await this.bigFile.setContent('hello', { withContent: true })

    assert.equal(this.bigFile.content.toString(), 'hello')
  }

  @Test()
  public async shouldBeAbleToSetTheFileContentSync({ assert }: Context) {
    this.bigFile.setContentSync('helloSync', { withContent: true })

    assert.equal(this.bigFile.content.toString(), 'helloSync')
  }

  @Test()
  public async shouldBeAbleToSetTheFileContentWithoutAddingInTheInstance({ assert }: Context) {
    await this.bigFile.setContent('hello')

    assert.equal(this.bigFile.getContentSync().toString(), 'hello')
  }

  @Test()
  public async shouldBeAbleToSetTheFileContentWithoutAddingInTheInstanceSync({ assert }: Context) {
    this.bigFile.setContentSync('helloSync')

    assert.equal(this.bigFile.getContentSync().toString(), 'helloSync')
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentAsString({ assert }: Context) {
    const bigFileContent = await this.bigFile.setContentSync('hello').getContentAsString()

    assert.equal(bigFileContent, 'hello')
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentAsStringSync({ assert }: Context) {
    const bigFileContent = this.bigFile.setContentSync('hello').getContentAsStringSync()

    assert.equal(bigFileContent, 'hello')
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentAsJson({ assert }: Context) {
    const bigFileContent = await this.bigFile.setContentSync('{"hello":"world"}').getContentAsJson()

    assert.deepEqual(bigFileContent, { hello: 'world' })
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentAsStringJson({ assert }: Context) {
    const bigFileContent = this.bigFile.setContentSync('{"hello":"world"}').getContentAsJsonSync()

    assert.deepEqual(bigFileContent, { hello: 'world' })
  }

  @Test()
  public async shouldReturnNullWhenTheFileContentIsNotAValidJson({ assert }: Context) {
    const bigFileContent = await this.bigFile.setContentSync('').getContentAsJson()

    assert.isNull(bigFileContent)
  }

  @Test()
  public async shouldReturnNullWhenTheFileContentIsNotAValidJsonSync({ assert }: Context) {
    const bigFileContent = this.bigFile.setContentSync('').getContentAsJsonSync()

    assert.isNull(bigFileContent)
  }

  @Test()
  public async shouldBeAbleToImportSomeFileThatIsAValidModule({ assert }: Context) {
    const Folder = await new File(Path.src('helpers/Folder.ts')).import()

    assert.equal(Folder.name, 'Folder')
  }

  @Test()
  public async shouldBeAbleToSafeImportSomeFileThatIsAModule({ assert }: Context) {
    const Folder = await new File(Path.src('helpers/Folder.ts')).safeImport()

    assert.equal(Folder.name, 'Folder')
  }

  @Test()
  public async shouldBeAbleToSafeImportSomeFileThatIsNotAModuleWithoutErrors({ assert }: Context) {
    const readme = await new File(Path.pwd('README.md')).safeImport()

    assert.isNull(readme)
  }

  @Test()
  public async shouldBeAbleToSafeImportSomeFileThatDoesNotExistWithoutErrors({ assert }: Context) {
    const path = Path.pwd('not-found.js')
    const notFound = await new File(path, '').safeImport()
    await File.safeRemove(path)

    assert.isNull(notFound)
  }

  @Test()
  public async shouldBeAbleToSafeImportSomeFileThatDoesNotExportAnythingWithoutErrors({ assert }: Context) {
    const notFound = await new File(Path.fixtures('no-export.ts')).safeImport()

    assert.isNull(notFound)
  }

  @Test()
  public async shouldBeAbleToGetTheFileContentAsObjectBuilderInstance({ assert }: Context) {
    const bigFileContent = await this.bigFile.setContentSync('{"hello":"world"}').getContentAsBuilder()

    assert.deepEqual(bigFileContent.get(), { hello: 'world' })
  }
}
