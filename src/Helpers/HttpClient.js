import got from 'got'
import { Is } from '#src/Helpers/Is'

/**
 * TODO Finish to implement the all the options from https://github.com/sindresorhus/got/blob/main/source/core/options.ts#L977
 *
 * Example: We have not implemented the "followRedirect" method of Got Options in HttpClientBuilder
 *
 * The implementation would be like this:
 *
 * export class HttpClientBuilder {
 *   followRedirect(followRedirect) {
 *     this.#options.followRedirect = followRedirect
 *
 *     return this
 *   }
 * }
 *
 * TODO We need to do this type of implementation with most part of methods of Got Options class
 */
export class HttpClientBuilder {
  /**
   * Got options used to make the request.
   *
   * @type {import('got').Options}
   */
  #options

  /**
   * Creates a new instance of HttpClientBuilder.
   */
  constructor() {
    this.#options = {}
  }

  /**
   * Set the signal method.
   * @param signal {AbortSignal}
   * @return {HttpClientBuilder}
   */
  signal(signal) {
    this.#options.signal = signal
  }

  /**
   * Set the hook functions method.
   * @param {} hooks
   * @return {HttpClientBuilder}
   */

  hooks(hooks) {
    this.#options.hooks = hooks
    return this
  }

  /**
   * Set the context method.
   * @param {} context
   * @return {HttpClientBuilder}
   */

  context(context) {
    this.#options.context = context
    return this
  }

  /**
   * Set the DNSLookup method.
   * @param dnsLookup {boolean}
   * @return {HttpClientBuilder}
   */
  dnsLookup(dnsLookup) {
    this.#options.dnsLookup = dnsLookup
    return this
  }

  /**
   * Set the cache of DNS.
   * @param {*} dnsCache
   * @return {HttpClientBuilder}
   */
  dnsCache(dnsCache) {
    this.#options.dnsCache = dnsCache
    return this
  }

  /**
   * Set the cookie jar method.
   * @param cookieJar
   * @returns {HttpClientBuilder}
   */

  cookieJar(cookieJar) {
    this.#options.CokkieJar = cookieJar
    return this
  }

  /**
   * Set the invalid cookies method.
   * @param ignoreInvalidCookies {bool}
   * @return {HttpClientBuilder}
   */
  ignoreInvalidCookies(ignoreInvalidCookies) {
    this.#options.ignoreInvalidCookies = ignoreInvalidCookies
    return this
  }

  /**
   * Set the agent method.
   * @param agent
   * @return {HttpClientBuilder}
   */
  agent(agent) {
    this.#options.agent = agent
    return this
  }

  /**
   * Set the h2session method.
   * @param h2session {string}
   * @return {HttpClientBuilder}
   */
  h2session(h2session) {
    this.#options.h2session = h2session
    return this
  }

  /**
   * Set the merge options.
   * @param mergeOptions {string}
   * @return {HttpClientBuilder}
   */
  mergeOptions(options) {
    this.#options = { ...this.#options, ...options }
    return this
  }

  /**
   * Set the following redirects.
   * @param followRedirect {bool}
   * @return {HttpClientBuilder}
   */

  followRedirect(followRedirect) {
    this.#options.followRedirect = followRedirect
    return this
  }

  /**
   * Set the request url.
   *
   * @param url {string}
   * @return {HttpClientBuilder}
   */
  url(url) {
    if (url.startsWith('/')) {
      url = url.replace('/', '')
    }

    this.#options.url = url

    return this
  }

  /**
   * Set the search of the parameters for the url.
   * @param {*} searchParams
   * @return {HttpClientBuilder}
   */
  searchParams(searchParams) {
    this.#options.searchParams = searchParams
    return this
  }

  /**
   * Set the request method.
   *
   * @param method {import('got').Method}
   * @return {HttpClientBuilder}
   */
  method(method) {
    this.#options.method = method

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
   * @param prefixUrl {string}
   * @return {HttpClientBuilder}
   */
  prefixUrl(prefixUrl) {
    this.#options.prefixUrl = prefixUrl

    return this
  }

  /**
   * Set the request body.
   *
   * @param body {any}
   * @return {HttpClientBuilder}
   */
  body(body) {
    if (Is.Object(body)) {
      this.#options.json = body

      return this
    }

    this.#options.body = body

    return this
  }

  /**
   * Set the request form.
   *
   * @param form {any}
   * @return {HttpClientBuilder}
   */
  form(form) {
    this.#options.form = form

    return this
  }

  /**
   * Set a header at the request.
   *
   * @param key {string}
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  header(key, value) {
    if (!this.#options.headers) {
      this.#options.headers = {}
    }

    this.#options.headers[key] = value

    return this
  }

  /**
   * Set a header at the request only if is not already
   * defined.
   *
   * @param key {string}
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  safeHeader(key, value) {
    if (!this.#options.headers) {
      this.#options.headers = {}
    }

    if (this.#options.headers[key]) {
      return this
    }

    this.#options.headers[key] = value

    return this
  }

  /**
   * Remove a header from the request.
   *
   * @param key {string}
   * @return {HttpClientBuilder}
   */
  removeHeader(key) {
    if (!this.#options.headers) {
      this.#options.headers = {}
    }

    if (!this.#options.headers[key]) {
      return this
    }

    delete this.#options.headers[key]

    return this
  }

  /**
   * Decompress the response automatically.
   *
   * This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
   *
   * If this is disabled, a compressed response is returned as a `Buffer`.
   * This may be useful if you want to handle decompression yourself or stream the raw compressed data.
   *
   * @param decompress {boolean}
   */
  decompress(decompress) {
    this.#options.decompress = decompress

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
   * @param delays {Partial<import('got').Delays>}
   */
  timeout(delays) {
    this.#options.timeout = delays

    return this
  }

  /**
   * Set the request retry strategy.
   *
   * @param strategy {Partial<import('got').RetryOptions>}
   */
  retryStrategy(strategy) {
    this.#options.retry = strategy

    return this
  }

  /**
   * Execute the request using all the options defined.
   *
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  request(options = {}) {
    console.log({ ...this.#options, ...options })
    return got({ ...this.#options, ...options })
  }

  /**
   * Make a GET request.
   *
   * @param [url] {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  get(url, options = {}) {
    this.method('GET').url(url || options.url || this.#options.url)

    return this.request(options)
  }

  /**
   * Make a POST request.
   *
   * @param [url] {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  post(url, body, options = {}) {
    this.method('POST')
      .url(url || options.url || this.#options.url)
      .body(body || options.body || this.#options.body || {})

    return this.request(options)
  }

  /**
   * Make a PUT request.
   *
   * @param url {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  put(url, body, options = {}) {
    this.method('PUT')
      .url(url || options.url || this.#options.url)
      .body(body || options.body || this.#options.body || {})

    return this.request(options)
  }

  /**
   * Make a PATCH request.
   *
   * @param url {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  patch(url, body, options = {}) {
    this.method('PATCH')
      .url(url || options.url || this.#options.url)
      .body(body || options.body || this.#options.body || {})

    return this.request(options)
  }

  /**
   * Make a DELETE request.
   *
   * @param url {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  delete(url, options = {}) {
    this.method('DELETE').url(url || options.url || this.#options.url)

    return this.request(options)
  }

  /**
   * Make a HEAD request.
   *
   * @param url {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  head(url, options = {}) {
    this.method('HEAD').url(url || options.url || this.#options.url)

    return this.request(options)
  }
}

export class HttpClient {
  /**
   * The global builder used in all HttpClient static requests.
   *
   * @type {HttpClientBuilder}
   */
  static #builder = new HttpClientBuilder()

  /**
   * Set the global builder for HttpClient.
   *
   * @param builder {HttpClientBuilder}
   * @return {typeof HttpClient}
   */
  static setBuilder(builder) {
    this.#builder = builder

    return this
  }

  /**
   * Creates an instance of HttpClientBuilder.
   *
   * @return {HttpClientBuilder}
   */
  static builder() {
    return new HttpClientBuilder()
  }

  /**
   * Make a GET request.
   *
   * @param url {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static get(url, options) {
    return this.#builder.get(url, options)
  }

  /**
   * Make a POST request.
   *
   * @param url {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static post(url, body, options) {
    return this.#builder.post(url, body, options)
  }

  /**
   * Make a PUT request.
   *
   * @param url {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static put(url, body, options) {
    return this.#builder.put(url, body, options)
  }

  /**
   * Make a PATCH request.
   *
   * @param url {string}
   * @param [body] {any}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static patch(url, body, options) {
    return this.#builder.patch(url, body, options)
  }

  /**
   * Make a DELETE request.
   *
   * @param url {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static delete(url, options) {
    return this.#builder.delete(url, options)
  }

  /**
   * Make a HEAD request.
   *
   * @param url {string}
   * @param [options] {import('got').Options}
   * @return {import('got').CancelableRequest<any>}
   */
  static head(url, options) {
    return this.#builder.head(url, options)
  }
}
