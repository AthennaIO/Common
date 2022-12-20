/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fastify from 'fastify'
import { Folder } from '#src/Helpers/Folder'
import { Path } from '#src/Helpers/Path'
import { Json } from '#src/Helpers/Json'
import { Debug } from '#src/Helpers/Debug'

let app = fastify()

export class FakeApi {
  /**
   * Creates a new instance of FakeApiBuilder
   *
   * @return {FakeApiBuilder}
   */
  static build() {
    return new FakeApiBuilder()
  }

  /**
   * Register all routes inside folder path
   * and start the fake api server at port 8989.
   *
   * @param [port] {number}
   * @param [folderPath] {string | null}
   * @return {Promise<void>}
   */
  static async start(port = 8989, folderPath = Path.resources('fake-api')) {
    if (folderPath) {
      await this.#registerFolder(folderPath)
    }

    await app.listen({ port })
  }

  /**
   * Stop the fake api server.
   *
   * @return {Promise<void>}
   */
  static async stop() {
    await app.close()

    app = fastify()
  }

  /**
   * Register all file routes found in folder path.
   *
   * @param path {string}
   * @return {Promise<void>}
   */
  static async #registerFolder(path) {
    const files = new Folder(path).getFilesByPattern('*/**/*.json', true)

    const promises = files.map(file =>
      file.load().then(fileLoaded => this.#registerFile(fileLoaded)),
    )

    await Promise.all(promises)
  }

  /**
   * Register a route file.
   *
   * @param file {File}
   * @return {void}
   */
  static #registerFile(file) {
    const object = Json.parse(file.content.toString())

    if (!object) {
      Debug.log(
        `The file ${file.path} is not a valid JSON file and is being ignored.`,
        'api:testing',
      )

      return
    }

    new FakeApiBuilder()
      .path(object.path)
      .method(object.method)
      .body(object.body)
      .statusCode(object.statusCode)
      .headers(object.headers)
      .register(object.options)
  }
}

export class FakeApiBuilder {
  /**
   * The route path.
   *
   * @type {string}
   */
  #path = '/'

  /**
   * The route method.
   *
   * @type {import('fastify').HTTPMethods}
   */
  #method = 'GET'

  /**
   * The route response body.
   *
   * @type {any | any[]}
   */
  #body = {}

  /**
   * The route response headers.
   *
   * @type {any}
   */
  #headers = {}

  /**
   * The route response status code.
   *
   * @type {number}
   */
  #statusCode = 200

  /**
   * Set the route path.
   *
   * @param path {string}
   * @return {FakeApiBuilder}
   */
  path(path) {
    this.#path = path

    return this
  }

  /**
   * Set the route method.
   *
   * @param method {import('fastify').HTTPMethods}
   * @return {FakeApiBuilder}
   */
  method(method) {
    this.#method = method

    return this
  }

  /**
   * Set the response body of the route.
   *
   * @param body {any | any[]}
   * @return {FakeApiBuilder}
   */
  body(body) {
    this.#body = body

    return this
  }

  /**
   * Set the response headers of the route.
   *
   * @param headers {any}
   * @return {FakeApiBuilder}
   */
  headers(headers) {
    this.#headers = headers

    return this
  }

  /**
   * Set the response status code of the route.
   *
   * @param statusCode {number}
   * @return {FakeApiBuilder}
   */
  statusCode(statusCode) {
    this.#statusCode = statusCode

    return this
  }

  /**
   * Register the route.
   *
   * @param [options] {import('fastify').RouteOptions}
   * @return void
   */
  register(options = {}) {
    if (app.hasRoute({ method: this.#method, url: this.#path })) {
      Debug.log(
        `Route ${this.#method}::${this.#path} already registered.`,
        'api:testing',
      )

      return
    }

    app.route({
      method: this.#method,
      url: this.#path,
      handler: (_, response) =>
        response
          .status(this.#statusCode)
          .headers(this.#headers)
          .send(this.#body),
      ...options,
    })
  }
}
