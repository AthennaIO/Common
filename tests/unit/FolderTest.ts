/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { Path, File, Folder } from '#src'
import type { Context } from '@athenna/test/types'
import { Test, AfterEach, BeforeEach } from '@athenna/test'
import { NotFoundFolderException } from '#src/exceptions/NotFoundFolderException'

export default class FolderTest {
  public bigFolder: Folder = null
  public nonexistentFolder: Folder = null
  public oneMbSize = 1024 * 1024 * 100

  public bigFolderPath = Path.storage('folders/bigFolder')
  public nonexistentFolderPath = Path.storage('folders/nonExistent')

  @BeforeEach()
  public async beforeEach() {
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(this.bigFolderPath.concat('/file.txt'), this.oneMbSize)

    this.bigFolder = new Folder(this.bigFolderPath)

    await File.createFileOfSize(this.bigFolderPath.concat('/hello/file.txt'), this.oneMbSize)
    await File.createFileOfSize(this.bigFolderPath.concat('/hello/nice/file.txt'), this.oneMbSize)

    this.nonexistentFolder = new Folder(this.nonexistentFolderPath)
  }

  @AfterEach()
  public async afterEach() {
    await Folder.safeRemove(Path.storage())

    this.bigFolder = null
    this.nonexistentFolder = null
  }

  @Test()
  public async shouldBeAbleToVerifyIfPathIsFromFolderOrFile({ assert }: Context) {
    assert.isTrue(await Folder.isFolder('../../tests'))
    assert.isFalse(await Folder.isFolder('../../package.json'))

    assert.isTrue(Folder.isFolderSync('../../tests'))
    assert.isFalse(Folder.isFolderSync('../../package.json'))
  }

  @Test()
  public async shouldBeAbleToCreateFoldersWithMockedValues({ assert }: Context) {
    const mockedFolder = new Folder(Path.storage('folders/testing'), true)

    assert.isDefined(mockedFolder.name)
    assert.notEqual(mockedFolder.name, 'testing')
  }

  @Test()
  public async shouldBeAbleToGenerateInstanceOfFoldersUsingRelativePaths({ assert }: Context) {
    const relativePathFolder = new Folder('../../tests')

    assert.isTrue(relativePathFolder.folderExists)
    assert.equal(relativePathFolder.name, 'tests')
  }

  @Test()
  public async shouldGenerateAnInstanceOfAFolderItExistingOrNot({ assert }: Context) {
    assert.equal(this.bigFolder.path, this.bigFolderPath)
    assert.equal(this.bigFolder.originalPath, this.bigFolderPath)
    assert.isTrue(this.bigFolder.originalFolderExists)
    assert.equal(this.bigFolder.dir, this.bigFolderPath.replace(`${sep}bigFolder`, ''))

    assert.isDefined(this.nonexistentFolder.path)
    assert.isFalse(this.nonexistentFolder.originalFolderExists)
    assert.equal(this.nonexistentFolder.originalPath, this.nonexistentFolderPath)
  }

  @Test()
  public async shouldOnlyLoadTheBigFolderBecauseItAlreadyExists({ assert }: Context) {
    assert.isUndefined(this.bigFolder.folderSize)
    assert.isTrue(this.bigFolder.folderExists)

    // Load the folder because it already exists.
    this.bigFolder.loadSync({ withSub: true, withContent: true })

    assert.isDefined(this.bigFolder.folderSize)
    assert.isTrue(this.bigFolder.originalFolderExists)
    assert.isTrue(this.bigFolder.folderSize.includes('MB'))
    assert.isTrue(await Folder.exists(this.bigFolder.path))
  }

  @Test()
  public async shouldCreateTheNonExistentFolderBecauseItDoesntExists({ assert }: Context) {
    assert.isUndefined(this.nonexistentFolder.folderSize)
    assert.isFalse(this.nonexistentFolder.folderExists)

    // Create the folder because it doesn't exist.
    await this.nonexistentFolder.load({ withSub: true, withContent: true })

    assert.isDefined(this.nonexistentFolder.folderSize)
    assert.isTrue(this.nonexistentFolder.folderExists)
    assert.isFalse(this.nonexistentFolder.originalFolderExists)
    assert.isTrue(this.nonexistentFolder.folderSize.includes('B'))
    assert.isTrue(await Folder.exists(this.nonexistentFolder.path))
  }

  @Test()
  public async shouldBeAbleToGetTheFolderInformationInJsonFormat({ assert }: Context) {
    assert.isUndefined(this.nonexistentFolder.folderSize)
    assert.isFalse(this.nonexistentFolder.folderExists)

    // Create the folder because it doesn't exist.
    await this.nonexistentFolder.load({ withSub: true, withContent: true })

    assert.isDefined(this.nonexistentFolder.folderSize)
    assert.isTrue(this.nonexistentFolder.folderExists)
    assert.isFalse(this.nonexistentFolder.originalFolderExists)
    assert.isTrue(this.nonexistentFolder.folderSize.includes('B'))
    assert.isTrue(await Folder.exists(this.nonexistentFolder.path))
  }

  @Test()
  public async shouldBeAbleToRemoveFolders({ assert }: Context) {
    await this.bigFolder.remove()

    assert.isFalse(await Folder.exists(this.bigFolder.path))
  }

  @Test()
  public async shouldThrowANotFoundExceptionWhenTryingToRemoveBigFolder({ assert }: Context) {
    await this.bigFolder.remove()

    const useCase = async () => await this.bigFolder.remove()

    await assert.rejects(useCase, NotFoundFolderException)
  }

  @Test()
  public async shouldThrowANotFoundExceptionWhenTryingToRemoveNonExistingFolder({ assert }: Context) {
    const useCase = () => this.nonexistentFolder.removeSync()

    assert.throws(useCase, NotFoundFolderException)
  }

  @Test()
  public async shouldBeAbleToMakeACopyOfFolder({ assert }: Context) {
    const copyOfBigFolder = await this.bigFolder.copy(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withContent: false,
    })

    this.bigFolder.removeSync()

    assert.isTrue(await Folder.exists(copyOfBigFolder.path))

    assert.isTrue(await File.exists(copyOfBigFolder.files[0].path))
    assert.isDefined(copyOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(copyOfBigFolder.folders[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(copyOfBigFolder.folders[0].files[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].files[0].name)

    const copyOfNoExistFolder = await this.nonexistentFolder.copy(
      Path.storage('folders/testing/copy-non-existent-folder'),
    )

    assert.isTrue(await Folder.exists(copyOfNoExistFolder.path))
  }

  @Test()
  public async shouldBeAbleToMakeACopyInSyncModeOfTheFolder({ assert }: Context) {
    const copyOfBigFolder = this.bigFolder.copySync(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withContent: false,
    })

    this.bigFolder.removeSync()

    assert.isTrue(await Folder.exists(copyOfBigFolder.path))

    assert.isTrue(await File.exists(copyOfBigFolder.files[0].path))
    assert.isDefined(copyOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(copyOfBigFolder.folders[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(copyOfBigFolder.folders[0].files[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].files[0].name)

    const copyOfNoExistFolder = this.nonexistentFolder.copySync(
      Path.storage('folders/testing/copy-non-existent-folder'),
    )

    assert.isTrue(await Folder.exists(copyOfNoExistFolder.path))
  }

  @Test()
  public async shouldBeAbleToMoveTheFolder({ assert }: Context) {
    const moveOfBigFolder = await this.bigFolder.move(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withContent: false,
    })

    assert.isFalse(await Folder.exists(this.bigFolder.path))
    assert.isTrue(await Folder.exists(moveOfBigFolder.path))

    assert.isTrue(await File.exists(moveOfBigFolder.files[0].path))
    assert.isDefined(moveOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(moveOfBigFolder.folders[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(moveOfBigFolder.folders[0].files[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].files[0].name)

    const moveOfNoExistFolder = await this.nonexistentFolder.move(
      Path.storage('folders/testing/move-non-existent-folder'),
    )

    assert.isFalse(await Folder.exists(this.nonexistentFolder.path))
    assert.isTrue(await Folder.exists(moveOfNoExistFolder.path))
  }

  @Test()
  public async shouldBeAbleToMoveTheFolderInSyncMode({ assert }: Context) {
    const moveOfBigFolder = await this.bigFolder.moveSync(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withContent: false,
    })

    assert.isFalse(await Folder.exists(this.bigFolder.path))
    assert.isTrue(await Folder.exists(moveOfBigFolder.path))

    assert.isTrue(await File.exists(moveOfBigFolder.files[0].path))
    assert.isDefined(moveOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(moveOfBigFolder.folders[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(moveOfBigFolder.folders[0].files[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].files[0].name)

    const moveOfNoExistFolder = this.nonexistentFolder.moveSync(
      Path.storage('folders/testing/move-non-existent-folder'),
    )

    assert.isFalse(await Folder.exists(this.nonexistentFolder.path))
    assert.isTrue(await Folder.exists(moveOfNoExistFolder.path))
  }

  @Test()
  public async shouldGetAllFilesAndFoldersThatMatchThePattern({ assert }: Context) {
    const path = this.bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/fileOne.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.edge'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.edge'), 1024 * 1024)

    await new Folder(path.concat('/A')).load()
    await new Folder(path.concat('/A', '/B')).load()

    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.edge'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.edge'), 1024 * 1024)

    const folder = new Folder(path)

    const ts = folder.getFilesByPattern('**/*.ts')
    const txt = folder.getFilesByPattern('**/*.txt')
    const json = folder.getFilesByPattern('**/*.json')
    const edge = folder.getFilesByPattern('**/*.edge')
    const folders = folder.getFoldersByPattern('**/*')

    assert.lengthOf(folders, 2)

    assert.lengthOf(ts, 4)
    ts.forEach(file => assert.equal(file.extension, '.ts'))

    assert.lengthOf(txt, 4)
    txt.forEach(file => assert.equal(file.extension, '.txt'))

    assert.lengthOf(json, 4)
    json.forEach(file => assert.equal(file.extension, '.json'))

    assert.lengthOf(edge, 4)
    edge.forEach(file => assert.equal(file.extension, '.edge'))
  }

  @Test()
  public async shouldBeAbleToGetAllFilesAndFoldersWithoutAnyPattern({ assert }: Context) {
    const path = this.bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/fileOne.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileOne.edge'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/fileTwo.edge'), 1024 * 1024)

    await new Folder(path.concat('/A')).load()
    await new Folder(path.concat('/A', '/B')).load()

    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.ts'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.txt'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.json'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileOne.edge'), 1024 * 1024)
    await File.createFileOfSize(path.concat('/A', '/B', '/fileTwo.edge'), 1024 * 1024)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern()
    const folders = folder.getFoldersByPattern()

    assert.lengthOf(files, 16)
    assert.lengthOf(folders, 2)
  }
}
