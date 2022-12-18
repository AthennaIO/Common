/**
 * @athenna/common
 *
 * // TODO Add your email here
 * (c) Robson Trasel <robson.trasel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { FakeApi } from '#tests/Helpers/FakeApi'
import { Path, HttpClient, HttpClientBuilder } from '#src/index'

const FAKE_API_URL = 'http://localhost:8080'

test.group('HttpClientTest', group => {
  group.setup(async () => {
    await FakeApi.get('/users', Path.stubs('server/responses/users.json'))
      .post('/users', Path.stubs('server/responses/user-created.json'))
      .start()
  })

  group.each.setup(async () => {
    const client = new HttpClientBuilder()

    client.prefixUrl(FAKE_API_URL)

    HttpClient.setBuilder(client)
  })

  group.teardown(async () => {
    await FakeApi.close()
  })

  test('should be able to make a GET request using HttpClient', async ({ assert }) => {
    const users = await HttpClient.get('users').json()

    assert.lengthOf(users, 3)
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

    assert.lengthOf(users, 3)
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
