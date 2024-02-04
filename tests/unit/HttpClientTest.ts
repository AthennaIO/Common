/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson.trasel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { File, Path, FakeApi, HttpClient, HttpClientBuilder } from '#src'
import { Test, AfterAll, BeforeAll, BeforeEach, type Context } from '@athenna/test'

export default class HttpClientTest {
  private pipeline = promisify(pipeline)
  private FAKE_API_URL = 'http://localhost:8989'

  @BeforeAll()
  public async beforeAll() {
    await FakeApi.start(8989, Path.fixtures('resources/fake-api'))
  }

  @BeforeEach()
  public async beforeEach() {
    const builder = new HttpClientBuilder()

    builder
      .http2(false)
      .setHost(true)
      .timeout(10000)
      .dnsCache(false)
      .prefixUrl(this.FAKE_API_URL)
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
  }

  @AfterAll()
  public async afterAll() {
    await FakeApi.stop()
  }

  @Test()
  public async shouldBeOnlyBeAbleToSetOptionsInBuilderAndReuseInNextRequestsUsingTheSetBuildMethod({
    assert
  }: Context) {
    await HttpClient.builder().responseType('json').url('/users').get().json()

    const mainBuilder = HttpClient.builder()
    const mainOptions = mainBuilder.getOptions()

    assert.deepEqual(mainOptions.prefixUrl, this.FAKE_API_URL)

    HttpClient.setBuilder(HttpClient.builder().responseType('json').url('/users'))

    const testBuilder = HttpClient.builder()
    const testOptions = testBuilder.getOptions()

    assert.deepEqual(testOptions.url, 'users')
    assert.deepEqual(testOptions.prefixUrl, this.FAKE_API_URL)
    assert.deepEqual(testOptions.responseType, 'json')
    assert.isDefined(HttpClient.setBuilder(mainBuilder).builder().getOptions().prefixUrl)
  }

  @Test()
  public async shouldBeAbleToCacheRequests({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToGetTheResponseBodyAsObjectUsingResponseTypeJson({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToMakeAGETRequestUsingHttpClient({ assert }: Context) {
    const users = await HttpClient.get('users').json()

    assert.lengthOf(users, 2)
    assert.deepEqual(users[0], { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToMakeAHEADRequestUsingHttpClient({ assert }: Context) {
    const response = await HttpClient.head('users')

    assert.deepEqual(response.statusCode, 200)
  }

  @Test()
  public async shouldBeAbleToMakeAPOSTRequestUsingHttpClient({ assert }: Context) {
    const userCreated = await HttpClient.post('/users', { body: { name: 'Robson Trasel' } }).json()

    assert.deepEqual(userCreated, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToMakeAPUTRequestUsingHttpClient({ assert }: Context) {
    const userUpdated = await HttpClient.put('/users/1', { body: { name: 'Robson Trasel Updated' } }).json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated' })
  }

  @Test()
  public async shouldBeAbleToMakeAPATCHRequestUsingHttpClient({ assert }: Context) {
    const userUpdated = await HttpClient.patch('/users/1', { body: { name: 'Robson Trasel Updated Patch' } }).json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated Patch' })
  }

  @Test()
  public async shouldBeAbleToMakeADELETERequestUsingHttpClient({ assert }: Context) {
    const response = await HttpClient.delete('/users/1')

    assert.deepEqual(response.statusCode, 204)
  }

  @Test()
  public async shouldBeAbleToMakeAGETRequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const users = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('GET')
      .header('Accept', 'application/json')
      .url('/users')
      .request()
      .json()

    assert.lengthOf(users, 2)
    assert.deepEqual(users[0], { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToMakeAHEADRequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const response = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('HEAD')
      .header('Accept', 'application/json')
      .url('/users')
      .request()

    assert.deepEqual(response.statusCode, 200)
  }

  @Test()
  public async shouldBeAbleToMakeAPOSTRequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const userCreated = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('post')
      .header('Accept', 'application/json')
      .url('/users')
      .request()
      .json()

    assert.deepEqual(userCreated, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToMakeAPUTRequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const userUpdated = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('put')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()
      .json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated' })
  }

  @Test()
  public async shouldBeAbleToMakeAPATCHRequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const userUpdated = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('patch')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()
      .json()

    assert.deepEqual(userUpdated, { id: 1, name: 'Robson Trasel Updated Patch' })
  }

  @Test()
  public async shouldBeAbleToMakeADELETERequestUsingHttpClientRequestBuilder({ assert }: Context) {
    const response = await HttpClient.builder(true)
      .prefixUrl(this.FAKE_API_URL)
      .method('delete')
      .header('Accept', 'application/json')
      .url('/users/1')
      .request()

    assert.deepEqual(response.statusCode, 204)
  }

  @Test()
  public async shouldBeAbleToSetupInitHooksForRequests({ assert }: Context) {
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
  }

  @Test()
  public async shouldBeAbleToSetupBeforeRequestHooksForRequests({ assert }: Context) {
    const builder = HttpClient.builder().setBeforeRequestHook(options => {
      const body = options.body as string

      assert.isTrue(body.includes('payload'))

      options.body = JSON.stringify({ payload: 'new' })
      options.headers['content-length'] = options.body.length.toString()
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    })

    await builder.body('{"payload":"old"}').post('users')
  }

  @Test()
  public async shouldBeAbleToSetupBeforeRedirectHooksFoRequests({ assert }: Context) {
    const builder = HttpClient.builder().setBeforeRedirectHook((options: any, _response) => {
      assert.deepEqual(options.hostname, 'deadSite')

      if (options.hostname === 'deadSite') {
        options.hostname = 'fallbackSite'
      }
    })

    await builder.get('users')
  }

  @Test()
  public async shouldBeAbleToSetupBeforeRetryHooksForRequests({ assert }: Context) {
    const builder = HttpClient.builder().setBeforeRetryHook((error, _retryCount) =>
      assert.deepEqual(error.name, 'ERR_NON_2XX_3XX_RESPONSE')
    )

    try {
      await builder.get('/service-unavailable')
    } catch (err) {
      assert.deepEqual(err.name, 'RequestError')
    }
  }

  @Test()
  public async shouldBeAbleToSetupAfterResponseHooksForRequests({ assert }: Context) {
    await HttpClient.builder()
      .setAfterResponseHook(response => {
        assert.deepEqual(response.statusCode, 200)

        return response
      })
      .safeHeader('Content-Type', 'application/json')
      .removeHeader('Content-Type')
      .removeHeader('Content-Type')
      .get('/users')
  }

  @Test()
  public async shouldBeAbleToMakeAGetRequestAndGetTheResponseAsStream({ assert }: Context) {
    const requestStream = HttpClient.builder().url('users').stream()
    const file = new File(Path.fixtures('streamed.json'), Buffer.from(''))

    await this.pipeline(requestStream, file.createWriteStream())
    await file.load({ withContent: true })

    assert.isTrue(file.fileExists)
    assert.deepEqual(file.content.toString(), '[{"id":1,"name":"Robson Trasel"},{"id":2,"name":"Victor Tesoura"}]')

    await File.safeRemove(Path.fixtures('streamed.json'))
  }

  @Test()
  public async shouldBeAbleToSetAJsonBodyInARequest({ assert }: Context) {
    assert.plan(2)

    const user = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(options.body, '{"name":"Robson Trasel"}')
      })
      .body({ name: 'Robson Trasel' })
      .post('/users')
      .json()

    assert.deepEqual(user, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToSetAJsonUsingInputMethodInARequest({ assert }: Context) {
    assert.plan(2)

    const user = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(options.body, '{"name":"Robson Trasel"}')
      })
      .input('name', 'Robson Trasel')
      .post('/users')
      .json()

    assert.deepEqual(user, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToSetMultipleBodyValuesInRequest({ assert }: Context) {
    assert.plan(2)

    const user = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(options.body, '{"id":1,"name":"Robson Trasel"}')
      })
      .body('id', 1)
      .body('name', 'Robson Trasel')
      .post('/users')
      .json()

    assert.deepEqual(user, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToOverwriteTheBodySettingOnlyOneValue({ assert }: Context) {
    assert.plan(2)

    const user = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(options.body, '{"name":"Robson Trasel"}')
      })
      .body('id', 1)
      .body('name', 'Robson Trasel')
      .body({ name: 'Robson Trasel' })
      .post('/users')
      .json()

    assert.deepEqual(user, { id: 1, name: 'Robson Trasel' })
  }

  @Test()
  public async shouldBeAbleToSetAQueryParamInRequest({ assert }: Context) {
    assert.plan(2)

    const users = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(
          options.searchParams,
          new URLSearchParams([
            ['page', '1'],
            ['limit', '10']
          ])
        )
      })
      .query('page', '1')
      .query('limit', '10')
      .get('/users')
      .json()

    assert.deepEqual(users, [
      { id: 1, name: 'Robson Trasel' },
      { id: 2, name: 'Victor Tesoura' }
    ])
  }

  @Test()
  public async shouldBeAbleToOverwriteTheQueryInRequest({ assert }: Context) {
    assert.plan(2)

    const users = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(
          options.searchParams,
          new URLSearchParams([
            ['page', '1'],
            ['limit', '10']
          ])
        )
      })
      .query('page', '1')
      .query('limit', '10')
      .query({ page: '1', limit: '10' })
      .get('/users')
      .json()

    assert.deepEqual(users, [
      { id: 1, name: 'Robson Trasel' },
      { id: 2, name: 'Victor Tesoura' }
    ])
  }

  @Test()
  public async shouldBeAbleToExecuteClosureWhenFirstValueIsDefined({ assert }: Context) {
    assert.plan(3)

    const users = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(
          options.searchParams,
          new URLSearchParams([
            ['page', '1'],
            ['limit', '10']
          ])
        )
      })
      .when(true, (builder, value) => {
        assert.isTrue(value)
        builder.query({ page: '1', limit: '10' })
      })
      .get('/users')
      .json()

    assert.deepEqual(users, [
      { id: 1, name: 'Robson Trasel' },
      { id: 2, name: 'Victor Tesoura' }
    ])
  }

  @Test()
  public async shouldNotExecuteClosureWhenFirstValueIsFalse({ assert }: Context) {
    assert.plan(2)

    const users = await HttpClient.builder()
      .setBeforeRequestHook(options => {
        assert.deepEqual(options.searchParams, new URLSearchParams())
      })
      .when(false, builder => {
        builder.query({ page: '1', limit: '10' })
      })
      .get('/users')
      .json()

    assert.deepEqual(users, [
      { id: 1, name: 'Robson Trasel' },
      { id: 2, name: 'Victor Tesoura' }
    ])
  }
}
