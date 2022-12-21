/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson.trasel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Path } from '#src/Helpers/Path'
import { FakeApi, HttpClient, HttpClientBuilder } from '#src/index'

const FAKE_API_URL = 'http://localhost:8989'

test.group('HttpClientTest', group => {
  group.setup(async () => {
    await FakeApi.start(8989, Path.stubs('resources/fake-api'))
  })

  group.each.setup(async () => {
    const client = new HttpClientBuilder()

    client.prefixUrl(FAKE_API_URL)

    HttpClient.setBuilder(client)
  })

  group.teardown(async () => {
    await FakeApi.stop()
  })

  test('should only be able to set options in builder and reuse in next requests using the setBuilder method', async ({
    assert,
  }) => {
    await HttpClient.builder().responseType('json').url('/users').get().json()

    const mainBuilder = HttpClient.builder()
    const mainOptions = mainBuilder.getOptions()

    assert.deepEqual(mainOptions, { prefixUrl: FAKE_API_URL })

    HttpClient.setBuilder(HttpClient.builder().responseType('json').url('/users'))

    const testBuilder = HttpClient.builder()
    const testOptions = testBuilder.getOptions()

    assert.deepEqual(testOptions, { prefixUrl: FAKE_API_URL, responseType: 'json', url: 'users' })
    assert.deepEqual(HttpClient.setBuilder(mainBuilder).builder().getOptions(), { prefixUrl: FAKE_API_URL })
  })

  test('should be able to cache requests', async ({ assert }) => {
    const storage = new Map()
    const mainBuilder = HttpClient.builder()

    const builder = new HttpClientBuilder()
      .url('https://sindresorhus.com')
      .cache(storage)
      .cacheOptions({ immutableMinTimeToLive: 1000 })

    HttpClient.setBuilder(builder)

    const notFromCache = await HttpClient.get()
    const fromCache = await HttpClient.get()

    assert.isFalse(notFromCache.isFromCache)
    assert.isTrue(fromCache.isFromCache)
    assert.isDefined(storage.get('cacheable-request:GET:https://sindresorhus.com'))

    HttpClient.setBuilder(mainBuilder)
  })

  test('should be able to get the response body as object using response type json', async ({ assert }) => {
    const mainBuilder = HttpClient.builder()
    const builder = HttpClient.builder().responseType('json')

    HttpClient.setBuilder(builder)

    const response = await HttpClient.get('users')

    assert.deepEqual(response.body[0], { id: 1, name: 'Robson Trasel' })

    HttpClient.setBuilder(mainBuilder)
  })

  test('should be able to make a GET request using HttpClient', async ({ assert }) => {
    const users = await HttpClient.get('users').json()

    assert.lengthOf(users, 2)
    assert.deepEqual(users[0], { id: 1, name: 'Robson Trasel' })
  })

  test('should be able to make a POST request using HttpClient', async ({ assert }) => {
    const userCreated = await HttpClient.post('/users', { name: 'Robson Trasel' }).json()

    assert.deepEqual(userCreated, { id: 1, name: 'Robson Trasel' })
  })

  test('should be able to make a PUT request using HttpClient', async ({ assert }) => {
    const userUpdated = await HttpClient.put('/users/1', { name: 'Robson Trasel Updated' }).json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated' })
  })

  test('should be able to make a PATCH request using HttpClient', async ({ assert }) => {
    const userUpdated = await HttpClient.patch('/users/1', { name: 'Robson Trasel Updated Patch' }).json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated Patch' })
  })

  test('should be able to make a DELETE request using HttpClient', async ({ assert }) => {
    const response = await HttpClient.delete('/users/1')

    assert.deepEqual(response.statusCode, 204)
  })

  test('should be able to make a GET request using HttpClient request builder', async ({ assert }) => {
    const users = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('GET')
      .header('Accept', 'application/json')
      .url('/users')
      .request()
      .json()

    assert.lengthOf(users, 2)
    assert.deepEqual(users[0], { id: 1, name: 'Robson Trasel' })
  })

  test('should be able to make a POST request using HttpClient request builder', async ({ assert }) => {
    const userCreated = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('post')
      .header('Accept', 'application/json')
      .url('/users')
      .request()
      .json()

    assert.deepEqual(userCreated, { id: 1, name: 'Robson Trasel' })
  })

  test('should be able to make a PUT request using HttpClient request builder', async ({ assert }) => {
    const userUpdated = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('put')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()
      .json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated' })
  })

  test('should be able to make a PATCH request using HttpClient request builder', async ({ assert }) => {
    const userUpdated = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('patch')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()
      .json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated Patch' })
  })

  test('should be able to make a DELETE request using HttpClient request builder', async ({ assert }) => {
    const response = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('delete')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()

    assert.deepEqual(response.statusCode, 204)
  })
})
