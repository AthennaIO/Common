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

  test('should get the responseType property be JSON', async ({ assert }) => {
    const builder = new HttpClientBuilder()
    builder.responseType('json')

    const options = builder.getOptions().responseType
    assert.deepEqual(options, 'json')
  })

  test('should set the cacheOptions property in the options object', async ({ assert }) => {
    const builder = new HttpClientBuilder()
    const cacheOptions = { cache: true }
    builder.cacheOptions(cacheOptions)

    const options = builder.getOptions().cacheOptions
    assert.deepEqual(options, cacheOptions)
  })

  test('should be able to get the options of client builder', async ({ assert }) => {
    const builder = new HttpClientBuilder({ baseUrl: FAKE_API_URL })
    const options = builder.getOptions()

    assert.isObject(options)
    assert.deepEqual(options, { baseUrl: FAKE_API_URL })
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

  test('should be able to make a GET request using HttpClient request builder', async ({ assert }) => {
    const users = await HttpClient.builder()
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
    const userCreated = await HttpClient.builder()
      .prefixUrl(FAKE_API_URL)
      .method('post')
      .header('Accept', 'application/json')
      .url('/users')
      .request()
      .json()

    assert.deepEqual(userCreated, { id: 1, name: 'Robson Trasel' })
  })
})
