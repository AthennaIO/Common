/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson.trasel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import stream from 'node:stream'

import { Response } from 'got'
import { test } from '@japa/runner'
import { promisify } from 'node:util'
import { File } from '#src/Helpers/File'
import { Path } from '#src/Helpers/Path'
import { FakeApi, HttpClient, HttpClientBuilder } from '#src/index'

const pipeline = promisify(stream.pipeline)

const FAKE_API_URL = 'http://localhost:8989'

test.group('HttpClientTest', group => {
  group.setup(async () => {
    await FakeApi.start(8989, Path.stubs('resources/fake-api'))
  })

  group.each.setup(async () => {
    const builder = new HttpClientBuilder()

    builder
      .http2(false)
      .setHost(true)
      .timeout(10000)
      .dnsCache(false)
      .prefixUrl(FAKE_API_URL)
      .allowGetBody(false)
      .encoding('utf-8')
      .decompress(true)
      .methodRewriting(false)
      .maxRedirects(10)
      .maxHeaderSize(1000)
      .followRedirect(true)
      .followRedirects(true)
      .ignoreInvalidCookies(false)
      .timeout({ response: 1000 })
      .throwHttpErrors(true)
      .resolveBodyOnly(false)
      .enableUnixSockets(true)
      .retryStrategy((_response, execCount) => {
        if (execCount === 3) {
          return 0
        }

        return 2000
      })

    HttpClient.setBuilder(builder)
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

    assert.deepEqual(mainOptions.prefixUrl, FAKE_API_URL)

    HttpClient.setBuilder(HttpClient.builder().responseType('json').url('/users'))

    const testBuilder = HttpClient.builder()
    const testOptions = testBuilder.getOptions()

    assert.deepEqual(testOptions.url, 'users')
    assert.deepEqual(testOptions.prefixUrl, FAKE_API_URL)
    assert.deepEqual(testOptions.responseType, 'json')
    assert.isDefined(HttpClient.setBuilder(mainBuilder).builder().getOptions().prefixUrl)
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

  test('should be able to make a HEAD request using HttpClient', async ({ assert }) => {
    const response = await HttpClient.head('users')

    assert.deepEqual(response.statusCode, 200)
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

  test('should be able to make a HEAD request using HttpClient request builder', async ({ assert }) => {
    const response = await HttpClient.builder(true)
      .prefixUrl(FAKE_API_URL)
      .method('HEAD')
      .header('Accept', 'application/json')
      .url('/users')
      .request()

    assert.deepEqual(response.statusCode, 200)
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

  test('should be able to setup init hooks for requests', async ({ assert }) => {
    const builder = HttpClient.builder()
      .setInitHook((plain: any) => {
        assert.isTrue('followRedirects' in plain)

        if ('followRedirects' in plain) {
          plain.followRedirect = plain.followRedirects

          delete plain.followRedirects
        }
      })
      .mergeOptions({ followRedirects: true } as any)

    await builder.get('/users').json()
  })

  test('should be able to setup before request hooks for requests', async ({ assert }) => {
    const builder = HttpClient.builder().setBeforeRequestHook(options => {
      const body = options.body as string

      assert.isTrue(body.includes('payload'))

      options.body = JSON.stringify({ payload: 'new' })
      options.headers['content-length'] = options.body.length.toString()
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    })

    await builder.post('users', '{"payload":"old"}')
  })

  test('should be able to setup before redirect hooks for requests', async ({ assert }) => {
    const builder = HttpClient.builder().setBeforeRedirectHook((options: any, _response) => {
      assert.deepEqual(options.hostname, 'deadSite')

      if (options.hostname === 'deadSite') {
        options.hostname = 'fallbackSite'
      }
    })

    await builder.get('users')
  })

  test('should be able to setup before redirect hooks for requests', async ({ assert }) => {
    const builder = HttpClient.builder(true)
      .responseType('json')
      .setBeforeErrorHook(error => {
        const response: Response<{ message?: string }> = error.response

        if (response && response.body) {
          error.name = 'GitHubError'
          error.message = `${response.body.message} (${response.statusCode})`
        }

        return error
      })

    try {
      await builder.get('https://api.github.com/repos/AthennaIO/NotFound/commits')
    } catch (err) {
      assert.deepEqual(err.name, 'GitHubError')
      assert.deepEqual(err.message, 'Not Found (404)')
    }
  })

  test('should be able to setup before retry hooks for requests', async ({ assert }) => {
    const builder = HttpClient.builder().setBeforeRetryHook((error, _retryCount) =>
      assert.deepEqual(error.name, 'ERR_NON_2XX_3XX_RESPONSE'),
    )

    try {
      await builder.get('/service-unavailable')
    } catch (err) {
      assert.deepEqual(err.name, 'RequestError')
    }
  })

  test('should be able to setup after response hooks for requests', async ({ assert }) => {
    await HttpClient.builder()
      .setAfterResponseHook(response => {
        assert.deepEqual(response.statusCode, 200)

        return response
      })
      .safeHeader('Content-Type', 'application/json')
      .removeHeader('Content-Type')
      .removeHeader('Content-Type')
      .get('/users')
  })

  test('should be able to make a get request and get the response as stream', async ({ assert }) => {
    const requestStream = HttpClient.builder().url('users').stream()
    const file = new File(Path.stubs('streamed.json'), Buffer.from(''))

    await pipeline(requestStream, file.createWriteStream())
    await file.load({ withContent: true })

    assert.isTrue(file.fileExists)
    assert.deepEqual(file.content.toString(), '[{"id":1,"name":"Robson Trasel"},{"id":2,"name":"Victor Tesoura"}]')

    await File.safeRemove(Path.stubs('streamed.json'))
  })
})
