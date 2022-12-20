/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { FakeApi, Folder, HttpClient, Path } from '#src/index'

test.group('FakeApiTest', group => {
  group.setup(async () => {
    await new Folder(Path.stubs('resources')).copy(Path.resources())
  })

  group.teardown(async () => {
    await Folder.safeRemove(Path.resources())
  })

  group.each.teardown(async () => {
    await FakeApi.stop()
  })

  test('should be able to register runtime routes', async ({ assert }) => {
    FakeApi.build()
      .path('/example')
      .method('GET')
      .body({ hello: 'world', example: 'example' })
      .statusCode(201)
      .register()

    await FakeApi.start(8989, null)

    const responseTwo = await HttpClient.get('http://localhost:8989/example', { responseType: 'json' })

    assert.equal(responseTwo.statusCode, 201)
    assert.deepEqual(responseTwo.body, { hello: 'world', example: 'example' })
  })

  test('should be able to register file routes with runtime routes', async ({ assert }) => {
    FakeApi.build()
      .path('/example')
      .method('GET')
      .body({ hello: 'world', example: 'example' })
      .statusCode(201)
      .register()

    await FakeApi.start(8989)

    const options = { responseType: 'json' }

    const responseOne = await HttpClient.get('http://localhost:8989/users', options)

    assert.equal(responseOne.statusCode, 200)
    assert.deepEqual(responseOne.body, [
      { id: 1, name: 'Robson Trasel' },
      { id: 2, name: 'Victor Tesoura' },
    ])

    const responseTwo = await HttpClient.get('http://localhost:8989/example', options)

    assert.equal(responseTwo.statusCode, 201)
    assert.deepEqual(responseTwo.body, { hello: 'world', example: 'example' })
  })
})
