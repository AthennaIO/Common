/**
 * @athenna/common
 *
 * (c) Robson Trasel <robson.trasel@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import CacheableLookup from 'cacheable-lookup'
import got, {
  Hooks,
  Delays,
  Agents,
  Method,
  Request,
  InitHook,
  RetryOptions,
  ResponseType,
  HttpsOptions,
  CacheOptions,
  ToughCookieJar,
  BeforeRetryHook,
  BeforeErrorHook,
  PromiseCookieJar,
  PaginationOptions,
  AfterResponseHook,
  BeforeRequestHook,
  ParseJsonFunction,
  DnsLookupIpVersion,
  BeforeRedirectHook,
  StringifyJsonFunction,
  CreateConnectionFunction,
} from 'got'

import { Store } from 'keyv'
import { Is } from '#src/Helpers/Is'
import { Json } from '#src/Helpers/Json'
import { ClientHttp2Session } from 'http2'
import { Body } from '#src/Types/HttpClient/Body'
import { Query } from '#src/Types/HttpClient/Query'
import { ReqOptions } from '#src/Types/HttpClient/ReqOptions'
import { RetryStrategyCallback } from '#src/Types/HttpClient/RetryStrategyCallback'

export class HttpClientBuilder {
  /**
   * Got options used to make the request.
   */
  private options: ReqOptions

  public constructor(options: ReqOptions = {}) {
    this.options = options
  }

  /**
   * Return the options of the client builder.
   */
  public getOptions(): ReqOptions {
    return Json.copy(this.options)
  }

  /**
   * From `http-cache-semantics`
   */
  public cacheOptions(cacheOptions: CacheOptions): HttpClientBuilder {
    this.options.cacheOptions = cacheOptions

    return this
  }

  /**
   * Called with the plain request options, right before their normalization.
   *
   * The second argument represents the current `Options` instance.
   *
   * **Note:**
   * > - This hook must be synchronous.
   *
   * **Note:**
   * > - This is called every time options are merged.
   *
   * **Note:**
   * > - The `options` object may not have the `url` property. To modify it, use a `beforeRequest` hook instead.
   *
   * **Note:**
   * > - This hook is called when a new instance of `Options` is created.
   * > - Do not confuse this with the creation of `Request` or `got(…)`.
   *
   * **Note:**
   * > - When using `got(url)` or `got(url, undefined, defaults)` this hook will **not** be called.
   *
   * This is especially useful in conjunction with `got.extend()` when the input needs custom handling.
   *
   * For example, this can be used to fix typos to migrate from older versions faster.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *    .setInitHook(plain => {
   *       if ('followRedirects' in plain) {
   *           plain.followRedirect = plain.followRedirects
   *           delete plain.followRedirects
   *       }
   *    })
   *    .mergeOptions({ followRedirects: true })
   *    .get('https://example.com')
   *
   * // There is no option named `followRedirects` in got, but we correct it
   * // in an `init` hook.
   * ```
   */
  public setInitHook(initHook: InitHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.init) {
      this.options.hooks.init = []
    }

    this.options.hooks.init.push(initHook)

    return this
  }

  /**
   * Called right before making the request with `options.createNativeRequestOptions()`.
   *
   * This hook is especially useful in conjunction with `HttpClient.setBuilder(customBuilder)` when you want to sign your request.
   *
   * *Note:**
   * > - Got will make no further changes to the request before it is sent.
   *
   * *Note:**
   * > - Changing `options.json` or `options.form` has no effect on the request. You should change `options.body` instead. If needed, update the `options.headers` accordingly.
   *
   * @example
   * ```
   * const response = await HttpClient.builder()
   *    .setBeforeRequestHook(options => {
   *        options.body = JSON.stringify({ payload: 'new' })
   *        options.headers['content-length'] = options.body.length.toString()
   *    })
   *    .post('https://httpbin.org/anything', { payload: 'old' })
   * ```
   */
  public setBeforeRequestHook(hook: BeforeRequestHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.beforeRequest) {
      this.options.hooks.beforeRequest = []
    }

    this.options.hooks.beforeRequest.push(hook)

    return this
  }

  /**
   * The equivalent of `setBeforeRequestHook` but when redirecting.
   *
   * *Tip:**
   * > - This is especially useful when you want to avoid dead sites.
   *
   * @example
   * ```
   * const response = await HttpClient.builder()
   *    .setBeforeRedirectHook((options, response) => {
   *        if (options.hostname === 'deadSite') {
   *            options.hostname = 'fallbackSite'
   *        }
   *    })
   *    .get('https://example.com')
   * ```
   */
  public setBeforeRedirectHook(hook: BeforeRedirectHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.beforeRedirect) {
      this.options.hooks.beforeRedirect = []
    }

    this.options.hooks.beforeRedirect.push(hook)

    return this
  }

  /**
   * Called with a `RequestError` instance. The error is passed to the hook right before it's thrown.
   *
   * This is especially useful when you want to have more detailed errors.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *    .responseType('json')
   *    .setBeforeErrorHook(error => {
   *        const { response } = error
   *
   *        if (response && response.body) {
   *            error.name = 'GitHubError'
   *            error.message = `${response.body.message} (${response.statusCode})`
   *       }
   *
   *       return error
   *    })
   *    .get('https://api.github.com/repos/AthennaIO/Common/commits')
   * ```
   */
  public setBeforeErrorHook(hook: BeforeErrorHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.beforeError) {
      this.options.hooks.beforeError = []
    }

    this.options.hooks.beforeError.push(hook)

    return this
  }

  /**
   * The equivalent of `setBeforeErrorHook` but when retrying. Additionally,
   * there is a second argument `retryCount`, the current retry number.
   *
   * *Note:**
   * > - When using the Stream API, this hook is ignored.
   *
   * *Note:**
   * > - When retrying, the `beforeRequest` hook is called afterwards.
   *
   * *Note:**
   * > - If no retry occurs, the `beforeError` hook is called instead.
   *
   * This hook is especially useful when you want to retrieve the cause of a retry.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *    .setBeforeRetryHook((error, retryCount) => {
   *        console.log(`Retrying [${retryCount}]: ${error.code}`)
   *        // Retrying [1]: ERR_NON_2XX_3XX_RESPONSE
   *    })
   *    .get('https://httpbin.org/status/500')
   * ```
   */
  public setBeforeRetryHook(hook: BeforeRetryHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.beforeRetry) {
      this.options.hooks.beforeRetry = []
    }

    this.options.hooks.beforeRetry.push(hook)

    return this
  }

  /**
   * Each function should return the response. This is especially useful when you want to refresh an access token.
   *
   * *Note:**
   * > - When using the Stream API, this hook is ignored.
   *
   * *Note:**
   * > - Calling the `retryWithMergedOptions` function will trigger `beforeRetry` hooks. If the retry is successful, all remaining `afterResponse` hooks will be called. In case of an error, `beforeRetry` hooks will be called instead.
   * Meanwhile, the `init`, `beforeRequest` , `beforeRedirect` as well as already executed `afterResponse` hooks will be skipped.
   *
   * @example
   * ```
   * const builder = HttpClient.builder()
   *    .mutableDefaults(true)
   *    .setBeforeRetry(error => {
   *        // This will be called on `retryWithMergedOptions(...)`
   *    })
   *    .setAfterResponseHook((response, retryWithMergedOptions) => {
   *        // Unauthorized
   *        if (response.statusCode === 401) {
   *            // Refresh the access token
   *            const updatedOptions = {
   *                headers: {
   *                    token: getNewToken()
   *                }
   *           };
   *
   *           // Update the defaults
   *           instance.defaults.options.merge(updatedOptions)
   *
   *           // Make a new retry
   *           return retryWithMergedOptions(updatedOptions)
   *       }
   *
   *       // No changes otherwise
   *       return response
   * })
   * ```
   */
  public setAfterResponseHook(hook: AfterResponseHook): HttpClientBuilder {
    if (!this.options.hooks) {
      this.options.hooks = {}
    }

    if (!this.options.hooks.afterResponse) {
      this.options.hooks.afterResponse = []
    }

    this.options.hooks.afterResponse.push(hook)

    return this
  }

  /**
   * An object representing `http`, `https` and `http2` keys for [`http.Agent`](https://nodejs.org/api/http.html#http_class_http_agent), [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) and [`http2wrapper.Agent`](https://github.com/szmarczak/http2-wrapper#new-http2agentoptions) instance.
   * This is necessary because a request to one protocol might redirect to another.
   * In such a scenario, Got will switch over to the right protocol agent for you.
   *
   * If a key is not present, it will default to a global agent.
   *
   * @example
   * ```
   * import HttpAgent from 'agentkeepalive'
   *
   * const { HttpsAgent } = HttpAgent
   *
   * await HttpClient.builder()
   *    .agent({ http: new HttpAgent(), https: new HttpsAgent() }
   *    .get('https://sindresorhus.com')
   * ```
   */
  public agent(agents: Agents): HttpClientBuilder {
    this.options.agent = agents

    return this
  }

  /**
   * Set the http2 session.
   */
  public h2session(h2session: ClientHttp2Session): HttpClientBuilder {
    this.options.h2session = h2session

    return this
  }

  /**
   * Decompress the response automatically.
   *
   * This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
   *
   * If this is disabled, a compressed response is returned as a `Buffer`.
   * This may be useful if you want to handle decompression yourself or stream the raw compressed data.
   */
  public decompress(decompress: boolean): HttpClientBuilder {
    this.options.decompress = decompress

    return this
  }

  /**
   * Milliseconds to wait for the server to end the response before aborting the request with `got.TimeoutError` error (a.k.a. `request` property).
   *
   * By default, there's no timeout.
   *
   * This also accepts an `object` with the following fields to constrain the duration of each phase of the request lifecycle:
   *
   * - `lookup` starts when a socket is assigned and ends when the hostname has been resolved.
   *     Does not apply when using a Unix domain socket.
   * - `connect` starts when `lookup` completes (or when the socket is assigned if lookup does not apply to the request) and ends when the socket is connected.
   * - `secureConnect` starts when `connect` completes and ends when the handshaking process completes (HTTPS only).
   * - `socket` starts when the socket is connected. See [request.setTimeout](https://nodejs.org/api/http.html#http_request_settimeout_timeout_callback).
   * - `response` starts when the request has been written to the socket and ends when the response headers are received.
   * - `send` starts when the socket is connected and ends with the request has been written to the socket.
   * - `request` starts when the request is initiated and ends when the response's end event fires.
   */
  public timeout(delays: number | Delays): HttpClientBuilder {
    if (!this.options.timeout) {
      this.options.timeout = {}
    }

    if (Is.Number(delays)) {
      this.options.timeout.request = delays as number

      return this
    }

    this.options.timeout = delays as Delays

    return this
  }

  /**
   * Set the request body.
   */
  public body(body: Body): HttpClientBuilder {
    if (Is.Object(body)) {
      this.options.json = body

      return this
    }

    this.options.body = body as any

    return this
  }

  /**
   * Set the request form.
   */
  public form(form: any | Record<string, any>): HttpClientBuilder {
    this.options.form = form

    return this
  }

  /**
   * Set a header at the request.
   */
  public header(key: string, value: string): HttpClientBuilder {
    if (!this.options.headers) {
      this.options.headers = {}
    }

    this.options.headers[key] = value

    return this
  }

  /**
   * Set a header at the request only if is not already
   * defined.
   */
  public safeHeader(key: string, value: string): HttpClientBuilder {
    if (!this.options.headers) {
      this.options.headers = {}
    }

    if (this.options.headers[key]) {
      return this
    }

    this.options.headers[key] = value

    return this
  }

  /**
   * Remove a header from the request.
   */
  public removeHeader(key: string): HttpClientBuilder {
    if (!this.options.headers) {
      this.options.headers = {}
    }

    if (!this.options.headers[key]) {
      return this
    }

    delete this.options.headers[key]

    return this
  }

  /**
   * When specified, `prefixUrl` will be prepended to `url`.
   * The prefix can be any valid URL, either relative or absolute.
   * A trailing slash `/` is optional - one will be added automatically.
   *
   * __Note__: `prefixUrl` will be ignored if the `url` argument is a URL instance.
   *
   * __Note__: Leading slashes in `input` are disallowed when using this option to enforce consistency and avoid confusion.
   * For example, when the prefix URL is `https://example.com/foo` and the input is `/bar`, there's ambiguity whether the resulting URL would become `https://example.com/foo/bar` or `https://example.com/bar`.
   * The latter is used by browsers.
   *
   * __Tip__: Useful when used with `got.extend()` to create niche-specific Got instances.
   *
   * __Tip__: You can change `prefixUrl` using hooks as long as the URL still includes the `prefixUrl`.
   * If the URL doesn't include it anymore, it will throw.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *    .prefixUrl('https://cats.com')
   *    .get('unicorn')
   *    .json()
   * //=> 'https://cats.com/unicorn'
   * ```
   */
  public prefixUrl(prefixUrl: string): HttpClientBuilder {
    this.options.prefixUrl = prefixUrl

    return this
  }

  /**
   * Set the request method.
   */
  public method(method: Method): HttpClientBuilder {
    this.options.method = method

    return this
  }

  /**
   * Set the request url.
   */
  public url(url: string | URL): HttpClientBuilder {
    if (url instanceof URL) {
      this.options.url = url

      return this
    }

    if (url.startsWith('/')) {
      url = url.replace('/', '')
    }

    this.options.url = url

    return this
  }

  /**
   * Cookie support. You don't have to care about parsing or how to store them.
   *
   * __Note__: If you provide this option, `options.headers.cookie` will be overridden.
   */
  public cookieJar(jar: PromiseCookieJar | ToughCookieJar): HttpClientBuilder {
    this.options.cookieJar = jar

    return this
  }

  /**
   * You can abort the `request` using [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
   *
   * Requires Node.js 16 or later.*
   *
   * @example
   * ```
   * const abortController = new AbortController();
   *
   * const request = HttpClient.builder()
   *   .signal(abortController.signal)
   *   .get('https://httpbin.org/anything')
   *
   * setTimeout(() => {
   *     abortController.abort();
   * }, 100);
   * ```
   */
  public signal(signal: any): HttpClientBuilder {
    this.options.signal = signal

    return this
  }

  /**
   * Ignore invalid cookies instead of throwing an error.
   * Only useful when the `cookieJar` option has been set. Not recommended.
   */
  public ignoreInvalidCookies(ignore: boolean): HttpClientBuilder {
    this.options.ignoreInvalidCookies = ignore

    return this
  }

  /**
   * Query string that will be added to the request URL.
   * This will override the query string in `url`.
   *
   * If you need to pass in an array, you can do it using a `URLSearchParams` instance.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *    .searchParams(new URLSearchParams([['key', 'a'], ['key', 'b']]))
   *    .get('https://example.com')
   *
   * console.log(searchParams.toString());
   * //=> 'key=a&key=b'
   * ```
   */
  public searchParams(value: Query): HttpClientBuilder {
    this.options.searchParams = value

    return this
  }

  /**
   * Alias for the searchParams method.
   */
  public queryParams(value: Query): HttpClientBuilder {
    return this.searchParams(value)
  }

  /**
   * Set the dnsLookup parameter.
   */
  public dnsLookup(lookup: CacheableLookup['lookup']): HttpClientBuilder {
    this.options.dnsLookup = lookup

    return this
  }

  /**
   * An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
   * Useful when making lots of requests to different *public* hostnames.
   *
   * `CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.
   *
   * __Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.
   */
  public dnsCache(cache: CacheableLookup | boolean): HttpClientBuilder {
    this.options.dnsCache = cache

    return this
  }

  /**
   * User data. `context` is shallow merged and enumerable. If it contains non-enumerable properties they will NOT be merged.
   *
   * @example
   * ```
   * HttpClient.builder()
   *    .setBeforeRequestHook(options => {
   *      if (!options.context || !options.context.token) {
   *          throw new Error('Token required')
   *      }
   *
   *     options.headers.token = options.context.token
   *    })
   *
   * const response = await HttpClient.builder()
   *     .context({ token: 'secret' })
   *     .get('https://httpbin.org/headers')
   *
   * // Let's see the headers
   * console.log(response.body)
   * ```
   */
  public context(context: any | Record<string, unknown>): HttpClientBuilder {
    this.options.context = context

    return this
  }

  /**
   * Hooks allow modifications during the request lifecycle.
   * Hook functions may be async and are run serially.
   */
  public hooks(hooks: Hooks): HttpClientBuilder {
    this.options.hooks = hooks

    return this
  }

  /**
   * Defines if redirect responses should be followed automatically.
   *
   * Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
   * This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
   */
  public followRedirect(followRedirect: boolean): HttpClientBuilder {
    this.options.followRedirect = followRedirect

    return this
  }

  /**
   * Defines if redirect responses should be followed automatically.
   *
   * Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
   * This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
   */
  public followRedirects(followRedirect: boolean): HttpClientBuilder {
    this.options.followRedirect = followRedirect

    return this
  }

  /**
   * If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.
   */
  public maxRedirects(maxRedirects: number): HttpClientBuilder {
    this.options.maxRedirects = maxRedirects

    return this
  }

  /**
   * A cache adapter instance for storing cached response data.
   */
  public cache(cache: string | Store<any> | boolean): HttpClientBuilder {
    this.options.cache = cache

    return this
  }

  /**
   * Determines if a `got.HTTPError` is thrown for unsuccessful responses.
   *
   * If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
   * This may be useful if you are checking for resource availability and are expecting error responses.
   */
  public throwHttpErrors(throwHttpErrors: boolean): HttpClientBuilder {
    this.options.throwHttpErrors = throwHttpErrors

    return this
  }

  /**
   * Set the username.
   */
  public username(value: string): HttpClientBuilder {
    this.options.username = value

    return this
  }

  /**
   * Set the password.
   */
  public password(value: string): HttpClientBuilder {
    this.options.password = value

    return this
  }

  /**
   * If set to `true`, Got will additionally accept HTTP2 requests.
   *
   * It will choose either HTTP/1.1 or HTTP/2 depending on the ALPN protocol.
   *
   * __Note__: This option requires Node.js 15.10.0 or newer as HTTP/2 support on older Node.js versions is very buggy.
   *
   * __Note__: Overriding `options.request` will disable HTTP2 support.
   *
   * @example
   * ```
   * const {headers} = await HttpClient.builder()
   *    .http2(true)
   *    .get('https://nghttp2.org/httpbin/anything')
   *
   * console.log(headers.via)
   * //=> '2 nghttpx'
   * ```
   */
  public http2(value: boolean): HttpClientBuilder {
    this.options.http2 = value

    return this
  }

  /**
   * Set this to `true` to allow sending body for the `GET` method.
   * However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
   * This option is only meant to interact with non-compliant servers when you have no other choice.
   *
   * __Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.
   */
  public allowGetBody(value: boolean): HttpClientBuilder {
    this.options.allowGetBody = value

    return this
  }

  /**
   * Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.
   *
   * As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior.
   * Setting `methodRewriting` to `true` will also rewrite `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.
   *
   * __Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).
   */
  public methodRewriting(value: boolean): HttpClientBuilder {
    this.options.methodRewriting = value

    return this
  }

  /**
   * Indicates which DNS record family to use.
   *
   * Values:
   * - `undefined`: IPv4 (if present) or IPv6
   * - `4`: Only IPv4
   * - `6`: Only IPv6
   */
  public dnsLookupIpVersion(dns: DnsLookupIpVersion): HttpClientBuilder {
    this.options.dnsLookupIpVersion = dns

    return this
  }

  /**
   * A function used to parse JSON responses.
   *
   * @example
   * ```
   * import Bourne from '@hapi/bourne'
   *
   * const parsed = await HttpClient.builder()
   *    .url('https://example.com')
   *    .parseJson(text => Bourne.parse(text))
   *    .request()
   *    .json()
   *
   * console.log(parsed)
   * ```
   */
  public parseJson(fn: ParseJsonFunction): HttpClientBuilder {
    this.options.parseJson = fn

    return this
  }

  /**
   * A function used to stringify the body of JSON requests.
   *
   * @example
   * ```
   * await HttpClient.builder()
   *  .method('POST')
   *  .url('https://example.com')
   *  .body({ some: 'payload', _ignoreMe: 1234 })
   *  .stringifyJson(object => JSON.stringify(object, (key, value) => {
   *     if (key.startsWith('_')) {
   *         return
   *     }
   *
   *     return value
   *  }))
   *  .request()
   * ```
   */
  public stringifyJson(fn: StringifyJsonFunction): HttpClientBuilder {
    this.options.stringifyJson = fn

    return this
  }

  /**
   * An object representing `limit`, `calculateDelay`, `methods`, `statusCodes`, `maxRetryAfter` and `errorCodes` fields for maximum retry count, retry handler, allowed methods, allowed status codes, maximum [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) time and allowed error codes.
   *
   * Delays between retries counts with function `1000 * Math.pow(2, retry) + Math.random() * 100`, where `retry` is attempt number (starts from 1).
   *
   * The `calculateDelay` property is a `function` that receives an object with `attemptCount`, `retryOptions`, `error` and `computedValue` properties for current retry count, the retry options, error and default computed value.
   * The function must return a delay in milliseconds (or a Promise resolving with it) (`0` return value cancels retry).
   *
   * By default, it retries *only* on the specified methods, status codes, and on these network errors:
   *
   * - `ETIMEDOUT`: One of the [timeout](#timeout) limits were reached.
   * - `ECONNRESET`: Connection was forcibly closed by a peer.
   * - `EADDRINUSE`: Could not bind to any free port.
   * - `ECONNREFUSED`: Connection was refused by the server.
   * - `EPIPE`: The remote side of the stream being written has been closed.
   * - `ENOTFOUND`: Couldn't resolve the hostname to an IP address.
   * - `ENETUNREACH`: No internet connection.
   * - `EAI_AGAIN`: DNS lookup timed out.
   *
   * __Note__: If `maxRetryAfter` is set to `undefined`, it will use `options.timeout`.
   * __Note__: If [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header is greater than `maxRetryAfter`, it will cancel the request.
   */
  public retry(retry: Partial<RetryOptions>): HttpClientBuilder {
    this.options.retry = retry

    return this
  }

  /**
   * This method is just an alias to configure your own retry strategy.
   *
   * The strategy function needs to return the delay between the execution count
   * of each request, if the strategy function returns 0, the retry is canceled.
   */
  public retryStrategy(strategy: RetryStrategyCallback): HttpClientBuilder {
    if (!this.options.retry) {
      this.options.retry = {}
    }

    this.options.retry.calculateDelay = ({
      error,
      retryAfter,
      attemptCount,
      retryOptions,
      computedValue,
    }) => {
      return strategy(error, attemptCount, {
        error,
        retryAfter,
        attemptCount,
        retryOptions,
        computedValue,
      })
    }

    return this
  }

  /**
   * From `http.RequestOptions`.
   *
   * The IP address used to send the request from.
   */
  public localAddress(localAddress: string): HttpClientBuilder {
    this.options.localAddress = localAddress

    return this
  }

  /**
   * Set the createConnection options.
   */
  public createConnection(value: CreateConnectionFunction): HttpClientBuilder {
    this.options.createConnection = value

    return this
  }

  /**
   * Options for the advanced HTTPS API.
   */
  public https(https: HttpsOptions): HttpClientBuilder {
    this.options.https = https

    return this
  }

  /**
   * [Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.
   *
   * To get a [`Buffer`](https://nodejs.org/api/buffer.html), you need to set `responseType` to `buffer` instead.
   * Don't set this option to `null`.
   *
   * __Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.
   */
  public encoding(encoding: BufferEncoding): HttpClientBuilder {
    this.options.encoding = encoding

    return this
  }

  /**
   *  When set to `true` the promise will return the
   *  Response body instead of the Response object.
   */
  public resolveBodyOnly(resolveBodyOnly: boolean): HttpClientBuilder {
    this.options.resolveBodyOnly = resolveBodyOnly

    return this
  }

  /**
   * The parsing method.
   *
   * The promise also has `.text()`, `.json()` and `.buffer()` methods which return another Got promise for the parsed body.
   *
   * It's like setting the options to `{responseType: 'json', resolveBodyOnly: true}` but without affecting the main Got promise.
   *
   * __Note__: When using streams, this option is ignored.
   *
   * @example
   * ```
   * const responsePromise = HttpClient.get(url);
   * const bufferPromise = responsePromise.buffer();
   * const jsonPromise = responsePromise.json();
   *
   * const [response, buffer, json] = Promise.all([responsePromise, bufferPromise, jsonPromise]);
   * // `response` is an instance of Got Response
   * // `buffer` is an instance of Buffer
   * // `json` is an object
   * ```
   *
   * @example
   * ```
   * // This
   * const body = await HttpClient.get(url).json();
   *
   * // is semantically the same as this
   * const body = await HttpClient.get(url, { responseType: 'json', resolveBodyOnly: true })
   * ```
   */
  public responseType(type: ResponseType): HttpClientBuilder {
    this.options.responseType = type as any

    return this
  }

  /**
   * Set pagination options.
   */
  public pagination<ElementType = any, BodyType = any>(
    options: PaginationOptions<ElementType, BodyType>,
  ): HttpClientBuilder {
    this.options.pagination = options

    return this
  }

  /**
   * Set the host option.
   */
  public setHost(value: boolean): HttpClientBuilder {
    this.options.setHost = value

    return this
  }

  /**
   * Set the maxHeaderSize option.
   */
  public maxHeaderSize(maxHeaderSize: number): HttpClientBuilder {
    this.options.maxHeaderSize = maxHeaderSize

    return this
  }

  /**
   * Set the enableUnixSockets option.
   */
  public enableUnixSockets(enableUnixSockets: boolean): HttpClientBuilder {
    this.options.enableUnixSockets = enableUnixSockets

    return this
  }

  /**
   * Set the merge options.
   */
  public mergeOptions(options: ReqOptions): HttpClientBuilder {
    this.options = { ...this.options, ...options }

    return this
  }

  /**
   * Execute the request and return as stream.
   */
  public stream(options: ReqOptions = {}): Request {
    return got.stream({ ...this.options, ...options } as any)
  }

  /**
   * Execute the request and return paginated data.
   */
  public paginate<T = any>(options: ReqOptions = {}): AsyncIterableIterator<T> {
    return got.paginate({ ...this.options, ...options } as any)
  }

  /**
   * Execute the request using all the options defined.
   */
  public request<T = any>(options: ReqOptions = {}) {
    return got<T>({ ...this.options, ...options } as any)
  }

  /**
   * Make a GET request.
   */
  public get<T = any>(url?: string | URL, options: ReqOptions = {}) {
    return this.method('GET')
      .url(url || options.url || this.options.url)
      .request<T>(options)
  }

  /**
   * Make a POST request.
   */
  public post<T = any>(
    url?: string | URL,
    body?: Body,
    options: ReqOptions = {},
  ) {
    return this.method('POST')
      .url(url || options.url || this.options.url)
      .body(body || options.body || this.options.body || {})
      .request<T>(options)
  }

  /**
   * Make a PUT request.
   */
  public put<T = any>(
    url?: string | URL,
    body?: Body,
    options: ReqOptions = {},
  ) {
    return this.method('PUT')
      .url(url || options.url || this.options.url)
      .body(body || options.body || this.options.body || {})
      .request<T>(options)
  }

  /**
   * Make a PATCH request.
   */
  public patch<T = any>(
    url?: string | URL,
    body?: Response,
    options: ReqOptions = {},
  ) {
    return this.method('PATCH')
      .url(url || options.url || this.options.url)
      .body(body || options.body || this.options.body || {})
      .request<T>(options)
  }

  /**
   * Make a DELETE request.
   */
  public delete<T = any>(url?: string | URL, options: ReqOptions = {}) {
    return this.method('DELETE')
      .url(url || options.url || this.options.url)
      .request<T>(options)
  }

  /**
   * Make a HEAD request.
   */
  public head<T = any>(url?: string | URL, options: ReqOptions = {}) {
    return this.method('HEAD')
      .url(url || options.url || this.options.url)
      .request<T>(options)
  }
}

export class HttpClient {
  /**
   * The global builder used in all HttpClient static requests.
   */
  private static _builder = new HttpClientBuilder()

  /**
   * Set the global builder for HttpClient.
   */
  public static setBuilder(builder: HttpClientBuilder): typeof HttpClient {
    this._builder = builder

    return this
  }

  /**
   * Uses the instance of HttpClientBuilder or creates
   * a new one.
   */
  public static builder(newBuilder = false): HttpClientBuilder {
    if (newBuilder) {
      return new HttpClientBuilder()
    }

    return new HttpClientBuilder(this._builder.getOptions())
  }

  /**
   * Make a GET request.
   */
  public static get<T = any>(url?: string | URL, options?: ReqOptions) {
    return this._builder.get<T>(url, options)
  }

  /**
   * Make a POST request.
   */
  public static post<T = any>(
    url?: string | URL,
    body?: Body,
    options?: ReqOptions,
  ) {
    return this._builder.post<T>(url, body, options)
  }

  /**
   * Make a PUT request.
   */
  public static put<T = any>(
    url?: string | URL,
    body?: Body,
    options?: ReqOptions,
  ) {
    return this._builder.put<T>(url, body, options)
  }

  /**
   * Make a PATCH request.
   */
  static patch<T = any>(url?: string | URL, body?: Body, options?: ReqOptions) {
    return this._builder.patch<T>(url, body, options)
  }

  /**
   * Make a DELETE request.
   */
  public static delete<T = any>(url?: string | URL, options?: ReqOptions) {
    return this._builder.delete<T>(url, options)
  }

  /**
   * Make a HEAD request.
   */
  public static head<T = any>(url?: string | URL, options?: ReqOptions) {
    return this._builder.head<T>(url, options)
  }
}
