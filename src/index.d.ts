/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Collection as CollectJS } from 'collect.js'
import { CancelableRequest, Response, Request, Options as GotOptions } from 'got'

export declare interface ExceptionJSON {
  code?: string
  name: string
  status: number
  content: string
  help?: string
  stack?: any
}

export declare interface FileJSON {
  dir: string
  name: string
  base: string
  path: string
  mime: string
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  fileSize: number
  extension: string
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFileExists: boolean
  content: string
}

export declare interface FolderJSON {
  dir: string
  name: string
  base: string
  path: string
  files: File[]
  folders: Folder[]
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  folderSize: number
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFolderExists: boolean
}

export declare interface CoordinateContract {
  latitude: number
  longitude: number
}

export declare interface PaginationContract {
  page?: number
  limit?: number
  resourceUrl?: string
}

export declare interface PaginatedResponse {
  data: any[]
  meta: {
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    itemCount: number
  }
  links: {
    next: string
    previous: string
    last: string
    first: string
  }
}

export declare interface DBConnectionContract {
  protocol: string
  user?: string
  password?: string
  host: string | string[]
  port?: number
  database: string
  options?: any
}

export declare class Clean {
  /**
   * Remove all falsy values from array.
   *
   * @param {any[]} array
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideObjects]
   * @return {any[]}
   */
  static cleanArray(
    array: any[],
    removeEmpty?: boolean,
    cleanInsideObjects?: boolean,
  ): any[]

  /**
   * Remove all falsy values from object.
   *
   * @param {any} object
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideArrays]
   * @return {any}
   */
  static cleanObject(
    object: any,
    removeEmpty?: boolean,
    cleanInsideArrays?: boolean,
  ): any
}

export declare class Collection<Item = any> extends CollectJS<Item> {
  /**
   * An alias for macro instance method:
   *
   * @example
   *  new Collection().macro()
   *
   *  @param {string} name
   *  @param {Function} fn
   */
  static macro(name: string, fn: Function): void

  /**
   * Remove all duplicated values from the array.
   *
   * @return {any[]}
   */
  removeDuplicated(): Item[]

  /**
   * Execute the toResource method inside objects if exists.
   *
   * @param {any} [criterias]
   * @return {any[]}
   */
  toResource(criterias?: any): any[]

  /**
   * The sortDesc method sort the collection in descending mode.
   */
  sortDesc(): Collection<Item>

  /**
   * The sortKeys method sort the keys of the collection.
   */
  sortKeys(): Collection<Item>

  /**
   * The sortKeysDesc method sort the keys of the collection in descending mode.
   */
  sortKeysDesc(): Collection<Item>

  /**
   * The order method orders the collection.
   */
  order(fn?: (a: Item, b: Item) => number): Collection<Item>

  /**
   * The orderBy method orders the collection by the given key.
   * The ordered collection keeps the original array keys.
   */
  orderBy<V>(value: V): Collection<Item>

  /**
   * The orderBy method orders the collection by the given callback.
   * The ordered collection keeps the original array keys.
   */
  orderBy(fn: (item: Item) => number): Collection<Item>

  /**
   * This method has the same signature as the orderBy method,
   * but will order the collection in the opposite order.
   */
  orderByDesc<V>(value: V): Collection<Item>

  /**
   * This method has the same signature as the orderBy method,
   * but will order the collection in the opposite order.
   */
  orderByDesc(fn: (item: Item) => number): Collection<Item>

  /**
   * The orderDesc method order the collection in descending mode.
   */
  orderDesc(): Collection<Item>

  /**
   * The orderKeys method order the keys of the collection.
   */
  orderKeys(): Collection<Item>

  /**
   * The orderKeysDesc method order the keys of the collection in descending mode.
   */
  orderKeysDesc(): Collection<Item>
}

export declare class Debug {
  /**
   * Format the message using Chalk API.
   *
   * @param {string} message
   * @return {string}
   */
  static format(message: string): string

  /**
   * Format and throw the message in the stdout accordingly to the namespace.
   *
   * @param {string|any} message
   * @param {string} [namespace]
   * @return {void}
   */
  static log(message: string | any, namespace?: string): void
}

export declare class Exception extends Error {
  /**
   * Creates a new instance of Exception.
   *
   * @param {string} [content]
   * @param {number} [status]
   * @param {string} [code]
   * @param {string} [help]
   * @return {Exception}
   */
  constructor(content?: string, status?: number, code?: string, help?: string)

  /**
   * Transform the exception to a valid JSON Object.
   *
   * @param {boolean} [stack]
   * @return {ExceptionJSON}
   */
  toJSON(stack?: boolean): ExceptionJSON

  /**
   * Prettify the error using Youch API.
   *
   * @param {any} [options]
   * @param {string} [options.prefix]
   * @param {boolean} [options.hideMessage]
   * @param {boolean} [options.hideErrorTitle]
   * @param {boolean} [options.displayShortPath]
   * @param {boolean} [options.displayMainFrameOnly]
   * @return {Promise<string>}
   */
  prettify(options?: {
    prefix?: string
    hideMessage?: boolean
    hideErrorTitle?: boolean
    displayShortPath?: boolean
    displayMainFrameOnly?: boolean
  }): Promise<string>
}

export declare class Exec {
  /**
   * Sleep the code in the line that this function
   * is being called.
   *
   * @param {number} ms
   * @return {Promise<void>}
   */
  static sleep(ms: number): Promise<void>

  /**
   * Execute a command of child process exec as promise.
   *
   * @param {string} command
   * @param {{
   *   ignoreErrors?: boolean
   * }} [options]
   * @throws {NodeCommandException}
   * @return {Promise<{ stdout: string, stderr: string }>}
   */
  static command(
    command: string,
    options?: { ignoreErrors?: boolean },
  ): Promise<{ stdout: string; stderr: string }>

  /**
   * Download an archive to determined path.
   *
   * @param {string} name
   * @param {string} path
   * @param {string} url
   * @return {Promise<File>}
   */
  static download(name: string, path: string, url: string): Promise<File>

  /**
   * Paginate a collection of data.
   *
   * @param {any[]} data
   * @param {number} total
   * @param {{
   *   page?: number,
   *   limit?: number,
   *   resourceUrl?: string
   * }} pagination
   * @return {{
   *   data: any[],
   *   meta: {
   *     totalItems: number,
   *     itemsPerPage: number,
   *     totalPages: number,
   *     currentPage: number,
   *     itemCount: number
   *  },
   *  links: {
   *    next: string,
   *    previous: string,
   *    last: string,
   *    first: string
   *  }
   * }}
   */
  static pagination(
    data: any[],
    total: number,
    pagination: PaginationContract,
  ): PaginatedResponse
}

export class FakeApi {
  /**
   * Creates a new instance of FakeApiBuilder
   *
   * @return {FakeApiBuilder}
   */
  static build(): FakeApiBuilder

  /**
   * Register all routes inside `resources/fake-api` folder
   * and start the fake api server at port 8989.
   *
   * @param [port] {number}
   * @param [registerFiles] {boolean}
   * @return {Promise<void>}
   */
  static start(port?: number, registerFiles?: boolean): Promise<void>

  /**
   * Stop the fake api server.
   *
   * @return {Promise<void>}
   */
  static stop(): Promise<void>
}

export class FakeApiBuilder {
  /**
   * Set the route path.
   *
   * @param path {string}
   * @return {FakeApiBuilder}
   */
  path(path: string): FakeApiBuilder

  /**
   * Set the route method.
   *
   * @param method {import('fastify').HTTPMethods}
   * @return {FakeApiBuilder}
   */
  method(method: import('fastify').HTTPMethods): FakeApiBuilder

  /**
   * Set the response body of the route.
   *
   * @param body {any | any[]}
   * @return {FakeApiBuilder}
   */
  body(body: any | any[]): FakeApiBuilder

  /**
   * Set the response headers of the route.
   *
   * @param headers {any}
   * @return {FakeApiBuilder}
   */
  headers(headers: any): FakeApiBuilder

  /**
   * Set the response status code of the route.
   *
   * @param statusCode {number}
   * @return {FakeApiBuilder}
   */
  statusCode(statusCode: number): FakeApiBuilder

  /**
   * Register the route.
   *
   * @param [options] {import('fastify').RouteOptions}
   * @return void
   */
  register(options?: import('fastify').RouteOptions): void
}

export declare class File {
  public originalDir: string

  public originalName: string

  public originalBase: string

  public originalPath: string

  public dir: string

  public name: string

  public base: string

  public path: string

  public href: string

  public isCopy: boolean

  public originalFileExists: boolean

  public fileExists: boolean

  public content: Buffer

  public mime: string

  public extension: string

  /**
   * Creates a new instance of File.
   *
   * @param {string} filePath
   * @param {Buffer} [content]
   * @param {boolean} [mockedValues]
   * @param {boolean} [isCopy]
   * @return {File}
   */
  constructor(
    filePath: string,
    content?: Buffer,
    mockedValues?: boolean,
    isCopy?: boolean,
  )

  /**
   * Remove the file it's existing or not.
   *
   * @param {string} filePath
   * @return {Promise<void>}
   */
  static safeRemove(filePath: string): Promise<void>

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {boolean}
   */
  static existsSync(filePath: string): boolean

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {Promise<boolean>}
   */
  static exists(filePath: string): Promise<boolean>

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFileSync(path: string): boolean

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static isFile(path: string): Promise<boolean>

  /**
   * Create fake file with determined size.
   *
   * @param {string} filePath
   * @param {number} size
   * @return {Promise<typeof File>}
   */
  static createFileOfSize(filePath: string, size?: number): Promise<typeof File>

  /**
   * Returns the file as a JSON object.
   *
   * @return {FileJSON}
   */
  toJSON(): FileJSON

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {File}
   */
  loadSync(options?: { withContent?: boolean; isInternalLoad?: boolean }): File

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  load(options?: {
    withContent?: boolean
    isInternalLoad?: boolean
  }): Promise<File>

  /**
   * Remove the file.
   *
   * @return {void}
   */
  removeSync(): void

  /**
   * Remove the file.
   *
   * @return {Promise<void>}
   */
  remove(): Promise<void>

  /**
   * Create a copy of the file.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {File}
   */
  copySync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

  /**
   * Create a copy of the file.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  copy(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

  /**
   * Move the file to other path.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {File}
   */
  moveSync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

  /**
   * Move the file to other path.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  move(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  appendSync(data: string | Buffer): File

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  append(data: string | Buffer): Promise<File>

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  prependSync(data: string | Buffer): File

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  prepend(data: string | Buffer): Promise<File>

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Buffer}
   */
  getContentSync(options?: { saveContent?: boolean }): Buffer

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Promise<Buffer>}
   */
  getContent(options?: { saveContent?: boolean }): Promise<Buffer>
}

export declare class Folder {
  public files: File[]

  public folders: Folder[]

  public originalDir: string

  public originalName: string

  public originalPath: string

  public dir: string

  public name: string

  public path: string

  public isCopy: boolean

  public originalFolderExists: boolean

  public folderExists: boolean

  /**
   * Creates a new instance of Folder.
   *
   * @param {string} folderPath
   * @param {boolean} [mockedValues]
   * @param {boolean} [isCopy]
   * @return {Folder}
   */
  constructor(folderPath: string, mockedValues?: boolean, isCopy?: boolean)

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {number}
   */
  static folderSizeSync(folderPath: string): number

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {Promise<number>}
   */
  static folderSize(folderPath: string): Promise<number>

  /**
   * Remove the folder it's existing or not.
   *
   * @param {string} folderPath
   * @return {Promise<void>}
   */
  static safeRemove(folderPath: string): Promise<void>

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {boolean}
   */
  static existsSync(folderPath: string): boolean

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {Promise<boolean>}
   */
  static exists(folderPath: string): Promise<boolean>

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFolderSync(path: string): boolean

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static isFolder(path: string): Promise<boolean>

  /**
   * Returns the file as a JSON object.
   *
   * @return {FolderJSON}
   */
  toJSON(): FolderJSON

  /**
   * Load or create the folder.
   *
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   isInternalLoad?: boolean,
   * }} [options]
   * @return {Folder}
   */
  loadSync(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Folder

  /**
   * Load or create the folder.
   *
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   isInternalLoad?: boolean,
   * }} [options]
   * @return {Promise<Folder>}
   */
  load(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Promise<Folder>

  /**
   * Remove the folder.
   *
   * @return {void}
   */
  removeSync(): void

  /**
   * Remove the folder.
   *
   * @return {Promise<void>}
   */
  remove(): Promise<void>

  /**
   * Create a copy of the folder.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Folder}
   */
  copySync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

  /**
   * Create a copy of the folder.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<Folder>}
   */
  copy(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

  /**
   * Move the folder to other path.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Folder}
   */
  moveSync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

  /**
   * Move the folder to other path.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<Folder>}
   */
  move(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

  /**
   * Get all the files of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {File[]}
   */
  getFilesByPattern(pattern?: string, recursive?: boolean): File[]

  /**
   * Get all the folders of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {Folder[]}
   */
  getFoldersByPattern(pattern?: string, recursive?: boolean): Folder[]
}

export declare class HttpClientBuilder {
  /**
   * Creates a new instance of HttpClientBuilder.
   *
   * @param [options] {GotOptions}
   */
  constructor(options?: GotOptions)

  /**
   * Return the options of the client builder.
   *
   * @return {GotOptions}
   */
  getOptions(): HttpClientBuilder

  /**
   * From `http-cache-semantics`
   *
   * @param cacheOptions {import('got').CacheOptions}
   * @return {HttpClientBuilder}
   */
  cacheOptions(cacheOptions: import('got').CacheOptions): HttpClientBuilder

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
   *
   * @param initHook {import('got').InitHook}
   * @return {HttpClientBuilder}
   */
  setInitHook(initHook: import('got').InitHook): HttpClientBuilder

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
   *
   * @param beforeRequestHook {import('got').BeforeRequestHook}
   * @return {HttpClientBuilder}
   */
  setBeforeRequestHook(beforeRequestHook: import('got').BeforeRequestHook): HttpClientBuilder

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
   *
   * @param beforeRedirectHook {import('got').BeforeRedirectHook}
   * @return {HttpClientBuilder}
   */
  setBeforeRedirectHook(beforeRedirectHook: import('got').BeforeRedirectHook): HttpClientBuilder

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
   *
   * @param beforeErrorHook {import('got').BeforeErrorHook}
   * @return {HttpClientBuilder}
   */
  setBeforeErrorHook(beforeErrorHook: import('got').BeforeErrorHook): HttpClientBuilder

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
   *
   * @param beforeRetryHook {import('got').BeforeRetryHook}
   * @return {HttpClientBuilder}
   */
  setBeforeRetryHook(beforeRetryHook: import('got').BeforeRetryHook): HttpClientBuilder

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
   *
   * @param afterResponseHook {import('got').AfterResponseHook}
   * @return {HttpClientBuilder}
   */
  setAfterResponseHook(afterResponseHook: import('got').AfterResponseHook): HttpClientBuilder

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
   *
   * @param agents {import('got').Agents}
   * @return {HttpClientBuilder}
   */
  agent(agents: import('got').Agents): HttpClientBuilder

  /**
   * Set the http2 session.
   *
   * @param h2session {import('http2').ClientHttp2Session}
   * @return {HttpClientBuilder}
   */
  h2session(h2session: import('http2').ClientHttp2Session): HttpClientBuilder

  /**
   * Decompress the response automatically.
   *
   * This will set the `accept-encoding` header to `gzip, deflate, br` unless you set it yourself.
   *
   * If this is disabled, a compressed response is returned as a `Buffer`.
   * This may be useful if you want to handle decompression yourself or stream the raw compressed data.
   *
   * @param decompress {boolean}
   * @return {HttpClientBuilder}
   */
  decompress(decompress: boolean): HttpClientBuilder

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
  timeout(delays: Partial<import('got').Delays>): HttpClientBuilder

  /**
   * Set the request body.
   *
   * @param body {Record<string, any> | string | Readable | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike }
   * @return {HttpClientBuilder}
   */
  body(body: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike): HttpClientBuilder

  /**
   * Set the request form.
   *
   * @param form {any}
   * @return {HttpClientBuilder}
   */
  form(form: any): HttpClientBuilder

  /**
   * Set a header at the request.
   *
   * @param key {string}
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  header(key: string, value: any): HttpClientBuilder

  /**
   * Set a header at the request only if is not already
   * defined.
   *
   * @param key {string}
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  safeHeader(key: string, value: any): HttpClientBuilder

  /**
   * Remove a header from the request.
   *
   * @param key {string}
   * @return {HttpClientBuilder}
   */
  removeHeader(key: string): HttpClientBuilder

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
  prefixUrl(prefixUrl: string): HttpClientBuilder

  /**
   * Set the request method.
   *
   * @param method {import('got').Method}
   * @return {HttpClientBuilder}
   */
  method(method: import('got').Method): HttpClientBuilder

  /**
   * Set the request url.
   *
   * @param url {string}
   * @return {HttpClientBuilder}
   */
  url(url: string): HttpClientBuilder

  /**
   * Cookie support. You don't have to care about parsing or how to store them.
   *
   * __Note__: If you provide this option, `options.headers.cookie` will be overridden.
   *
   * @param jar {import('got').PromiseCookieJar | import('got').ToughCookieJar}
   * @return {HttpClientBuilder}
   */
  cookieJar(jar: import('got').PromiseCookieJar | import('got').ToughCookieJar): HttpClientBuilder

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
   *
   * @param signal {any}
   * @return {HttpClientBuilder}
   */
  signal(signal: any): HttpClientBuilder

  /**
   * Ignore invalid cookies instead of throwing an error.
   * Only useful when the `cookieJar` option has been set. Not recommended.
   *
   * @param ignore {boolean}
   * @return {HttpClientBuilder}
   */
  ignoreInvalidCookies(ignore: boolean): HttpClientBuilder

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
   *
   *  @param value { string | import('got').SearchParameters | URLSearchParams }
   *  @return {HttpClientBuilder}
   */
  searchParams(value: string | import('got').SearchParameters | URLSearchParams): HttpClientBuilder

  /**
   * Alias for the searchParameters method.
   *
   *  @param value { string | import('got').SearchParameters | URLSearchParams }
   *  @return {HttpClientBuilder}
   */
  searchParameters(value: string | import('got').SearchParameters | URLSearchParams): HttpClientBuilder

  /**
   * Set the dnsLookup parameter.
   *
   * @param cache {any | boolean | undefined}
   * @return {HttpClientBuilder}
   */
  dnsLookup(cache: any | boolean): HttpClientBuilder

  /**
   * An instance of [`CacheableLookup`](https://github.com/szmarczak/cacheable-lookup) used for making DNS lookups.
   * Useful when making lots of requests to different *public* hostnames.
   *
   * `CacheableLookup` uses `dns.resolver4(..)` and `dns.resolver6(...)` under the hood and fall backs to `dns.lookup(...)` when the first two fail, which may lead to additional delay.
   *
   * __Note__: This should stay disabled when making requests to internal hostnames such as `localhost`, `database.local` etc.
   *
   * @param cache {any | boolean}
   * @return {HttpClientBuilder}
   */
  dnsCache(cache: any | boolean): HttpClientBuilder

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
   *
   * @param context {Record<string, unknown>}
   * @return {HttpClientBuilder}
   */
  context(context: Record<string, unknown>): HttpClientBuilder

  /**
   * Hooks allow modifications during the request lifecycle.
   * Hook functions may be async and are run serially.
   *
   * @param hooks {import('got').Hooks}
   * @return {HttpClientBuilder}
   */
  hooks(hooks: import('got').Hooks): HttpClientBuilder

  /**
   * Defines if redirect responses should be followed automatically.
   *
   * Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
   * This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
   *
   * @param followRedirect {boolean}
   * @return {HttpClientBuilder}
   */
  followRedirect(followRedirect: boolean): HttpClientBuilder

  /**
   * Defines if redirect responses should be followed automatically.
   *
   * Note that if a `303` is sent by the server in response to any request type (`POST`, `DELETE`, etc.), Got will automatically request the resource pointed to in the location header via `GET`.
   * This is in accordance with [the spec](https://tools.ietf.org/html/rfc7231#section-6.4.4). You can optionally turn on this behavior also for other redirect codes - see `methodRewriting`.
   *
   * @param followRedirect {boolean}
   * @return {HttpClientBuilder}
   */
  followRedirects(followRedirect: boolean): HttpClientBuilder

  /**
   * If exceeded, the request will be aborted and a `MaxRedirectsError` will be thrown.
   *
   * @param maxRedirects {number}
   * @return {HttpClientBuilder}
   */
  maxRedirects(maxRedirects: number): HttpClientBuilder

  /**
   * A cache adapter instance for storing cached response data.
   *
   * @param cache {string | import('keyv').Store<any> | boolean }
   * @return {HttpClientBuilder}
   */
  cache(cache: string | import('keyv').Store<any> | boolean): HttpClientBuilder

  /**
   * Determines if a `got.HTTPError` is thrown for unsuccessful responses.
   *
   * If this is disabled, requests that encounter an error status code will be resolved with the `response` instead of throwing.
   * This may be useful if you are checking for resource availability and are expecting error responses.
   *
   * @param throwHttpErrors {boolean}
   * @return {HttpClientBuilder}
   */
  throwHttpErrors(throwHttpErrors: boolean): HttpClientBuilder

  /**
   * Set the username.
   *
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  username(value: string): HttpClientBuilder

  /**
   * Set the password.
   *
   * @param value {string}
   * @return {HttpClientBuilder}
   */
  password(value: string): HttpClientBuilder

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
   *
   * @param value {boolean}
   * @return {HttpClientBuilder}
   */
  http2(value: boolean): HttpClientBuilder

  /**
   * Set this to `true` to allow sending body for the `GET` method.
   * However, the [HTTP/2 specification](https://tools.ietf.org/html/rfc7540#section-8.1.3) says that `An HTTP GET request includes request header fields and no payload body`, therefore when using the HTTP/2 protocol this option will have no effect.
   * This option is only meant to interact with non-compliant servers when you have no other choice.
   *
   * __Note__: The [RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.3.1) doesn't specify any particular behavior for the GET method having a payload, therefore __it's considered an [anti-pattern](https://en.wikipedia.org/wiki/Anti-pattern)__.
   *
   * @param value {boolean}
   * @return {HttpClientBuilder}
   */
  allowGetBody(value: boolean): HttpClientBuilder

  /**
   * Specifies if the HTTP request method should be [rewritten as `GET`](https://tools.ietf.org/html/rfc7231#section-6.4) on redirects.
   *
   * As the [specification](https://tools.ietf.org/html/rfc7231#section-6.4) prefers to rewrite the HTTP method only on `303` responses, this is Got's default behavior.
   * Setting `methodRewriting` to `true` will also rewrite `301` and `302` responses, as allowed by the spec. This is the behavior followed by `curl` and browsers.
   *
   * __Note__: Got never performs method rewriting on `307` and `308` responses, as this is [explicitly prohibited by the specification](https://www.rfc-editor.org/rfc/rfc7231#section-6.4.7).
   *
   * @param value {boolean}
   * @return {HttpClientBuilder}
   */
  methodRewriting(value: boolean): HttpClientBuilder

  /**
   * Indicates which DNS record family to use.
   *
   * Values:
   * - `undefined`: IPv4 (if present) or IPv6
   * - `4`: Only IPv4
   * - `6`: Only IPv6
   *
   * @param dnsLookupIpVersion {import('got').DnsLookupIpVersion}
   * @return {HttpClientBuilder}
   */
  dnsLookupIpVersion(dnsLookupIpVersion: import('got').DnsLookupIpVersion): HttpClientBuilder

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
   *
   * @param fn {import('got').ParseJsonFunction}
   * @return {HttpClientBuilder}
   */
  parseJson(fn: import('got').ParseJsonFunction): HttpClientBuilder

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
   *
   * @param fn {import('got').StringifyJsonFunction}
   * @return {HttpClientBuilder}
   */
  stringifyJson(fn: import('got').StringifyJsonFunction): HttpClientBuilder

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
   *
   * @param strategy {Partial<import('got').RetryOptions>}
   * @return {HttpClientBuilder}
   */
  retryStrategy(strategy: Partial<import('got').RetryOptions>): HttpClientBuilder

  /**
   * From `http.RequestOptions`.
   *
   * The IP address used to send the request from.
   *
   * @param localAddress {string}
   * @return {HttpClientBuilder}
   */
  localAddress(localAddress: string): HttpClientBuilder

  /**
   * Set the createConnection options.
   *
   * @param value {import('got').CreateConnectionFunction}
   * @return {HttpClientBuilder}
   */
  createConnection(value: import('got').CreateConnectionFunction): HttpClientBuilder

  /**
   * Options for the advanced HTTPS API.
   *
   * @param https {import('got').HttpsOptions}
   * @return {HttpClientBuilder}
   */
  https(https: import('got').HttpsOptions): HttpClientBuilder

  /**
   * [Encoding](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings) to be used on `setEncoding` of the response data.
   *
   * To get a [`Buffer`](https://nodejs.org/api/buffer.html), you need to set `responseType` to `buffer` instead.
   * Don't set this option to `null`.
   *
   * __Note__: This doesn't affect streams! Instead, you need to do `got.stream(...).setEncoding(encoding)`.
   *
   * @param encoding {BufferEncoding}
   * @return {HttpClientBuilder}
   */
  encoding(encoding: BufferEncoding): HttpClientBuilder

  /**
   *  When set to `true` the promise will return the
   *  Response body instead of the Response object.
   *
   * @param resolveBodyOnly {boolean}
   * @return {HttpClientBuilder}
   */
  resolveBodyOnly(resolveBodyOnly: boolean): HttpClientBuilder

  /**
   * Returns a `Stream` instead of a `Promise`.
   * This is equivalent to calling `got.stream(url, options?)`.
   *
   * @param value {boolean}
   * @return {HttpClientBuilder}
   */
  isStream(value: boolean): HttpClientBuilder

  /**
   * Set pagination options.
   *
   * @param options {import('got').PaginationOptions}
   * @return {HttpClientBuilder}
   */
  pagination(options: import('got').PaginationOptions<any, any[]>): HttpClientBuilder

  /**
   * Set the auth option.
   *
   * @param value {any}
   * @return {HttpClientBuilder}
   */
  auth(value: any): HttpClientBuilder

  /**
   * Set the host option.
   *
   * @param value {boolean}
   * @return {HttpClientBuilder}
   */
  setHost(value: boolean): HttpClientBuilder

  /**
   * Set the maxHeaderSize option.
   *
   * @param maxHeaderSize {number}
   * @return {HttpClientBuilder}
   */
  maxHeaderSize(maxHeaderSize: number): HttpClientBuilder

  /**
   * Set the enableUnixSockets option.
   *
   * @param enableUnixSockets {boolean}
   * @return {HttpClientBuilder}
   */
  enableUnixSockets(enableUnixSockets: boolean): HttpClientBuilder

  /**
   * Set the merge options.
   *
   * @param options {GotOptions}
   * @return {HttpClientBuilder}
   */
  mergeOptions(options: GotOptions): HttpClientBuilder

  /**
   * Execute the request and return as stream.
   *
   * @param [options] {GotOptions}
   * @return {Request}
   */
  stream(options?: GotOptions): Request

  /**
   * Execute the request and return paginated data.
   *
   * @param [options] {GotOptions}
   * @return {AsyncIterableIterator<any>}
   */
  paginate(options?: GotOptions): AsyncIterableIterator<any>

  /**
   * Execute the request using all the options defined.
   *
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  request(options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a GET request.
   *
   * @param [url] {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  get(url?: string, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a POST request.
   *
   * @param [url] {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  post(url?: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a PUT request.
   *
   * @param [url] {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  put(url?: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a PATCH request.
   *
   * @param [url] {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  patch(url?: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a DELETE request.
   *
   * @param [url] {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  delete(url?: string, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a HEAD request.
   *
   * @param [url] {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  head(url?: string, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request
}

export declare class HttpClient {
  /**
   * Set the global builder for HttpClient.
   *
   * @param builder {HttpClientBuilder}
   * @return {typeof HttpClient}
   */
  static setBuilder(builder: HttpClientBuilder): typeof HttpClient

  /**
   * Uses the instance of HttpClientBuilder or creates
   * a new one.
   *
   * @param [newBuilder] {boolean}
   * @return {HttpClientBuilder}
   */
  static builder(newBuilder?: boolean): HttpClientBuilder

  /**
   * Make a GET request.
   *
   * @param url {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static get(url: string, options?: GotOptions): CancelableRequest<Response>

  /**
   * Make a POST request.
   *
   * @param url {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static post(url: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a PUT request.
   *
   * @param url {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static put(url: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a PATCH request.
   *
   * @param url {string}
   * @param [body] {Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static patch(url: string, body?: Record<string, any> | string | ReadableStream | Generator | AsyncGenerator | import('form-data-encoder').FormDataLike, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a DELETE request.
   *
   * @param url {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static delete(url: string, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request

  /**
   * Make a HEAD request.
   *
   * @param url {string}
   * @param [options] {GotOptions}
   * @return {CancelableRequest<Response> | CancelableRequest | Request}
   */
  static head(url: string, options?: GotOptions): CancelableRequest<Response> | CancelableRequest | Request
}

export declare class Is {
  /**
   * Verify if is valid Uuid.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Uuid(value: string): boolean

  /**
   * Verify if is valid Json.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Json(value: string): boolean

  /**
   * Verify if is valid Ip.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Ip(value: string): boolean

  /**
   * Verify if is valid Empty.
   *
   * @param {string|any|any[]} value
   * @return {boolean}
   */
  static Empty(value: string | any | any[]): boolean

  /**
   * Verify if is a valid Cep.
   *
   * @param {string|number} cep
   * @return {boolean}
   */
  static Cep(cep: string | number): boolean

  /**
   * Verify if is a valid Cpf.
   *
   * @param {string|number} cpf
   * @return {boolean}
   */
  static Cpf(cpf: string | number): boolean

  /**
   * Verify if is a valid Cnpj.
   *
   * @param {string|number} cnpj
   * @return {boolean}
   */
  static Cnpj(cnpj: string | number): boolean

  /**
   * Verify if is a valid Async function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Async(value: any): value is Promise<Function>

  /**
   * Verify if is a valid Undefined.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Undefined(value: any): value is undefined

  /**
   * Verify if is a valid Null.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Null(value: any): value is null

  /**
   * Verify if is a valid Boolean.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Boolean(value: any): value is boolean

  /**
   * Verify if is a valid Buffer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Buffer(value: any): value is Buffer

  /**
   * Verify if is a valid Number.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Number(value: any): value is number

  /**
   * Verify if is a valid String.
   *
   * @param {any} value
   * @return {boolean}
   */
  static String(value: any): value is string

  /**
   * Verify if is a valid Object.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Object(value: any): value is Object

  /**
   * Verify if is a valid Date.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Date(value: any): value is Date

  /**
   * Verify if is a valid Array.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Array(value: any): value is any[]

  /**
   * Verify if is a valid Regexp.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Regexp(value: any): value is RegExp

  /**
   * Verify if is a valid Error.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Error(value: any): value is Error

  /**
   * Verify if is a valid Function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Function(value: any): value is Function

  /**
   * Verify if is a valid Class.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Class(value: any): boolean

  /**
   * Verify if is a valid Integer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Integer(value: any): value is number

  /**
   * Verify if is a valid Float.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Float(value: any): value is number

  /**
   * Verify if is a valid ArrayOfObjects.
   *
   * @param {any[]} value
   * @return {boolean}
   */
  static ArrayOfObjects(value: any[]): boolean
}

export declare class Json {
  /**
   * Deep copy any object properties without reference.
   *
   * @param {any} object
   * @return {any}
   */
  static copy(object: any): any

  /**
   * Find all JSON inside string and return it.
   *
   * @param {string} text
   * @return {string[]}
   */
  static getJson(text: string): string[]

  /**
   * Reviver callback.
   *
   * @callback reviver
   * @param {any} this
   * @param {string} key
   * @param {any} value
   * @return any
   */

  /**
   * Converts a JSON string into an object without exception.
   *
   * @param {string} text
   * @param {reviver} [reviver]
   * @return {any}
   */
  static parse(text: string, reviver?: any): any

  /**
   * Observe changes inside objects.
   *
   * @param {any} object
   * @param {function} func
   * @param {...any[]} args
   * @return {any}
   */
  static observeChanges(object: any, func: any, ...args: any[])

  /**
   * Remove all keys from data that is not inside array keys.
   *
   * @param {any} data
   * @param {any[]} keys
   * @return {any[]}
   */
  static fillable(data: any, keys: any[]): any[]

  /**
   * Remove all duplicated values from the array.
   *
   * @param {any[]} array
   * @return {any[]}
   */
  static removeDuplicated(array: any[]): any[]

  /**
   * Raffle any value from the array.
   *
   * @param {any[]} array
   * @return {number}
   */
  static raffle(array: any[]): number

  /**
   * Get the object properties based on key.
   *
   * @param {string} key
   * @param {any} [defaultValue]
   * @param {any} object
   * @return {any|undefined}
   */
  static get(object: any, key: string, defaultValue?: any): any | undefined
}

export class Module {
  /**
   * Get the module first export match or default.
   *
   * @param {any|Promise<any>} module
   * @return {Promise<any>}
   */
  static get(module: any | Promise<any>): Promise<any>

  /**
   * Get the module first export match or default with alias.
   *
   * @param {any|Promise<any>} module
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static getWithAlias(
    module: any | Promise<any>,
    subAlias: string,
  ): Promise<{ alias: string; module: any }>

  /**
   * Get all modules first export match or default and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @return {Promise<any[]>}
   */
  static getAll(modules: any[] | Promise<any[]>): Promise<any[]>

  /**
   * Get all modules first export match or default with alias and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @param {string} subAlias
   * @return {Promise<any[]>}
   */
  static getAllWithAlias(
    modules: any[] | Promise<any[]>,
    subAlias: string,
  ): Promise<{ alias: string; module: any }[]>

  /**
   * Same as get method, but import the path directly.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static getFrom(path: string): Promise<any>

  /**
   * Same as getWithAlias method, but import the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static getFromWithAlias(
    path: string,
    subAlias: string,
  ): Promise<{ alias: string; module: any }>

  /**
   * Same as getAll method but import everything in the path directly.
   *
   * @param {string} path
   * @return {Promise<any[]>}
   */
  static getAllFrom(path: string): Promise<any>

  /**
   * Same as getAllWithAlias method but import everything in the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }[]>}
   */
  static getAllFromWithAlias(
    path: string,
    subAlias: string,
  ): Promise<{ alias: string; module: any }[]>

  /**
   * Verify if folder exists and get all .js files inside.
   *
   * @param {string} path
   * @return {Promise<File[]>}
   */
  static getAllJSFilesFrom(path: string): Promise<File[]>

  /**
   * Import a full path using the path href to ensure compatibility
   * between OS's.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static import(path: string): Promise<any>

  /**
   * Create the __dirname property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createDirname(url?: string, setInGlobal?: boolean): string

  /**
   * Create the __filename property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createFilename(url?: string, setInGlobal?: boolean): string
}

export declare class Number {
  /**
   * Get the higher number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getHigher(numbers: number[]): number

  /**
   * Get km radius between two coordinates.
   *
   * @param {{ latitude: number, longitude: number }} centerCord
   * @param {{ latitude: number, longitude: number }} pointCord
   * @return {number}
   */
  static getKmRadius(
    centerCord: CoordinateContract,
    pointCord: CoordinateContract,
  ): number

  /**
   * Get the lower number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getLower(numbers: number[]): number

  /**
   * Extract all numbers inside a string and
   * return as a unique number.
   *
   * @param {string} string
   * @return {number}
   */
  static extractNumber(string: string): number

  /**
   * Extract all numbers inside a string.
   *
   * @param {string} string
   * @return {number[]}
   */
  static extractNumbers(string: string): number[]

  /**
   * The average of all numbers in function arguments.
   *
   * @param {number[]} args
   * @return {number}
   */
  static argsAverage(...args: number[]): number

  /**
   * The average of all numbers in the array.
   *
   * @param {number[]} array
   * @return {number}
   */
  static arrayAverage(array: number[]): number

  /**
   * Generate a random integer from a determined interval of numbers.
   *
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static randomIntFromInterval(min: number, max: number): number
}

export declare class Options {
  /**
   * Creates an option object with default values.
   *
   * @param {any} object
   * @param {any} defaultValues
   * @return {any}
   */
  static create<T = any>(object: Partial<T>, defaultValues: Partial<T>): T
}

export declare class Parser {
  /**
   * Parse a string to array.
   *
   * @param {string} string
   * @param {string} separator
   * @return {string[]}
   */
  static stringToArray(string: string, separator: string): string[]

  /**
   * Parse an array of strings to a string.
   *
   * @param {string[]} values
   * @param {{
   *   separator?: string,
   *   pairSeparator?: string,
   *   lastSeparator?: string
   * }} [options]
   * @return {string}
   */
  static arrayToString(
    values: string[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    },
  ): string

  /**
   * Parse a string to number or Coordinate.
   *
   * @param {string} string
   * @param {boolean} isCoordinate
   * @throws {InvalidNumberException}
   * @return {number}
   */
  static stringToNumber(string: string, isCoordinate: boolean): number

  /**
   * Parse an object to form data.
   *
   * @param {any} object
   * @return {string}
   */
  static jsonToFormData(object: any): string

  /**
   * Parse form data to json.
   *
   * @param {string} formData
   * @return {any}
   */
  static formDataToJson(formData: string): any

  /**
   * Parses all links inside the string to HTML link
   * with <a href= .../>.
   *
   * @param {string} string
   * @return {string}
   */
  static linkToHref(string: string): any

  /**
   * Parses a number to Byte format.
   *
   * @param {number} value
   * @param {object} [options]
   * @param {number} [options.decimalPlaces=2]
   * @param {number} [options.fixedDecimals=false]
   * @param {string} [options.thousandsSeparator=]
   * @param {string} [options.unit=]
   * @param {string} [options.unitSeparator=]
   * @return {string}
   */
  static sizeToByte(
    value,
    options?: {
      decimalPlaces?: number
      fixedDecimals?: boolean
      thousandsSeparator?: any
      unit?: any
      unitSeparator?: any
    },
  ): string

  /**
   * Parses a byte format to number.
   *
   * @param {string|number} byte
   * @return {number}
   */
  static byteToSize(byte: string | number): number

  /**
   * Parses a string to MS format.
   *
   * @param {string} value
   * @return {number}
   */
  static timeToMs(value: string): number

  /**
   * Parses an MS number to time format.
   *
   * @param {number} value
   * @param {boolean} long
   * @return {string}
   */
  static msToTime(value: number, long: boolean): string

  /**
   * Parses the status code number to it reason in string.
   *
   * @param {string|number} status
   * @return {string}
   */
  static statusCodeToReason(status: string | number): string

  /**
   * Parses the reason in string to it status code number
   *
   * @param {string} reason
   * @return {number}
   */
  static reasonToStatusCode(reason: string): number

  /**
   * Parses the database connection url to connection object.
   *
   * @param {string} url
   * @return {DBConnectionContract}
   */
  static dbUrlToConnectionObj(url: string): DBConnectionContract

  /**
   * Parses the database connection object to connection url.
   *
   * @param {DBConnectionContract} object
   * @return {string}
   */
  static connectionObjToDbUrl(object?: DBConnectionContract): string
}

export declare class Path {
  /**
   * Set a default beforePath for all Path methods that
   * use Path.pwd.
   *
   * @type {string}
   */
  static defaultBeforePath: string

  /**
   * Return the pwd path of your project.
   *
   * @param {string} [subPath]
   * @return {string}
   */
  static pwd(subPath?: string): string

  /**
   * Return the app path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static app(subPath?: string): string

  /**
   * Return the bootstrap path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bootstrap(subPath?: string): string

  /**
   * Return the config path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static config(subPath?: string): string

  /**
   * Return the database path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static database(subPath?: string): string

  /**
   * Return the lang path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static lang(subPath?: string): string

  /**
   * Return the node_modules path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static nodeModules(subPath?: string): string

  /**
   * Return the providers' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static providers(subPath?: string): string

  /**
   * Return the public path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static public(subPath?: string): string

  /**
   * Return the resources' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static resources(subPath?: string): string

  /**
   * Return the routes' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static routes(subPath?: string): string

  /**
   * Return the storage path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static storage(subPath?: string): string

  /**
   * Return the tests' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static tests(subPath?: string): string

  /**
   * Return the logs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static logs(subPath?: string): string

  /**
   * Return the views' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static views(subPath?: string): string

  /**
   * Return the assets' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static assets(subPath?: string): string

  /**
   * Return the locales' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static locales(subPath?: string): string

  /**
   * Return the facades' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static facades(subPath?: string): string

  /**
   * Return the stubs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static stubs(subPath?: string): string

  /**
   * Return the http path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static http(subPath?: string): string

  /**
   * Return the console path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static console(subPath?: string): string

  /**
   * Return the services' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static services(subPath?: string): string

  /**
   * Return the migrations' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static migrations(subPath?: string): string

  /**
   * Return the seeders' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static seeders(subPath?: string): string

  /**
   * Return the .bin path of your node_modules.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bin(subPath?: string): string

  /**
   * Return the tmp path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmTmp(subPath?: string): string

  /**
   * Return the home path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmHome(subPath?: string): string

  /**
   * Return the execution path of where this method
   * is being called.
   *
   * @param {string} subPath
   * @param {number} [stackIndex]
   * @return {string}
   */
  static this(subPath?: string, stackIndex?: number): string
}

export declare class Route {
  /**
   * Get the query string in form data format.
   *
   * @param {string} route
   * @return {string}
   */
  static getQueryString(route: string): string

  /**
   * Remove query params from the route.
   *
   * @param {string} route
   * @return {string}
   */
  static removeQueryParams(route: string): string

  /**
   * Get object with ?&queryParams values from route.
   *
   * @param {string} route
   * @return {any}
   */
  static getQueryParamsValue(route: string): any

  /**
   * Get array with ?&queryParams name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getQueryParamsName(route: string): string[]

  /**
   * Get object with :params values from route.
   *
   * @param {string} routeWithParams
   * @param {string} routeWithValues
   * @return {any}
   */
  static getParamsValue(routeWithParams: string, routeWithValues: string): any

  /**
   * Get array with :params name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getParamsName(route: string): string[]

  /**
   * Create a matcher RegExp for any route.
   *
   * @param {string} route
   * @return {RegExp}
   */
  static createMatcher(route: string): RegExp
}

export declare class String {
  /**
   * Generate random string by size.
   *
   * @param {number} size
   * @return {string}
   */
  static generateRandom(size: number): string

  /**
   * Generate random color in hexadecimal format.
   *
   * @return {string}
   */
  static generateRandomColor(): string

  /**
   * Normalizes the string in base64 format removing
   * special chars.
   *
   * @param {string} value
   * @return {string}
   */
  static normalizeBase64(value: string): string

  /**
   * Transforms the string to "camelCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toCamelCase(value: string): string

  /**
   * Transforms the string to "snake_case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSnakeCase(value: string, capitalize?: boolean): string

  /**
   * Transforms the string to "CONSTANT_CASE".
   *
   * @param {string} value
   * @return {string}
   */
  static toConstantCase(value: string): string

  /**
   * Transforms the string to "PascalCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toPascalCase(value: string): string

  /**
   * Transforms the string to "Sentence case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSentenceCase(value: string, capitalize?: boolean): string

  /**
   * Transforms the string to "dot.case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDotCase(value: string, capitalize?: boolean): string

  /**
   * Removes all sorted cases from string.
   *
   * @param {string} value
   * @return {string}
   */
  static toNoCase(value: string): string

  /**
   * Transforms a string to "dash-case"
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDashCase(value: string, capitalize?: boolean): string

  /**
   * Transforms a word to plural.
   *
   * @param {string} word
   * @return {string}
   */
  static pluralize(word: string): string

  /**
   * Transforms a word to singular.
   *
   * @param {string} word
   * @return {string}
   */
  static singularize(word: string): string

  /**
   * Transforms a number to your ordinal format.
   *
   * @param {string,number} value
   * @return {string}
   */
  static ordinalize(value: string | number): string
}

export declare class Uuid {
  /**
   * Verify if string is a valid uuid.
   *
   * @param {string} token
   * @param {boolean} [isPrefixed]
   * @return {boolean}
   */
  static verify(token: string, isPrefixed?: boolean): boolean

  /**
   * Generate an uuid token
   *
   * @param {string} [prefix]
   * @return {string}
   */
  static generate(prefix?: string): string

  /**
   * Return the token without his prefix.
   *
   * @param {string} token
   * @return {string}
   */
  static getToken(token: string): string

  /**
   * Return the prefix without his token.
   *
   * @param {string} token
   * @return {string|null}
   */
  static getPrefix(token: string): string | null

  /**
   * Inject a prefix in the uuid token.
   *
   * @param {string} prefix
   * @param {string} token
   * @return {string}
   */
  static injectPrefix(prefix: string, token: string): string

  /**
   * Change the prefix of and uuid token
   *
   * @param {string} newPrefix
   * @param {string} token
   * @return {string}
   */
  static changePrefix(newPrefix: string, token: string): string

  /**
   * Change the token prefix or generate a new one
   *
   * @param {string} prefix
   * @param {string?} token
   * @return {string}
   */
  static changeOrGenerate(prefix: string, token?: string): string
}

declare global {
  interface Array<T> {
    toResource(criterias?: any): T[]

    toCollection(): Collection<T>
  }
}
