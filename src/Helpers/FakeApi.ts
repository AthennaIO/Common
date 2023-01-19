/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fastifyFormbody from '@fastify/formbody'
import fastify, { FastifyInstance, HTTPMethods, RouteOptions } from 'fastify'

import { File } from '#src/Helpers/File'
import { Path } from '#src/Helpers/Path'
import { Json } from '#src/Helpers/Json'
import { Debug } from '#src/Helpers/Debug'
import { Folder } from '#src/Helpers/Folder'

export class FakeApi {
  /**
   * Set if the FakeApi server is running.
   */
  private static _isRunning = false

  /**
   * Create the fastify server with plugins.
   *
   * This method is already called when you import FakeApi module.
   */
  static recreate(): FastifyInstance {
    const app = fastify()

    app.register(fastifyFormbody)

    return app
  }

  /**
   * Creates a new instance of FakeApiBuilder
   */
  static build(): FakeApiBuilder {
    return new FakeApiBuilder()
  }

  /**
   * List the routes registered in the fake server.
   *
   * @return {string}
   */
  static listRoutes(): string {
    return app.printRoutes()
  }

  /**
   * Verify if the FakeApi server is running.
   */
  static isRunning(): boolean {
    return this._isRunning
  }

  /**
   * Register all routes inside folder path
   * and start the fake api server at port 8989.
   */
  static async start(port = 8989, folderPath = Path.resources('fake-api')): Promise<void> {
    if (folderPath) {
      await this.registerFolder(folderPath)
    }

    await app.listen({ port })
    this._isRunning = true
  }

  /**
   * Stop the fake api server.
   */
  static async stop(): Promise<void> {
    await app.close()

    app = FakeApi.recreate()
    this._isRunning = false
  }

  /**
   * Register all file routes found in folder path.
   */
  static async registerFolder(path: string): Promise<void> {
    const files = new Folder(path).getFilesByPattern('*/**/*.json', true)

    const promises = files.map(file =>
      file.load().then(fileLoaded => this.registerFile(fileLoaded)),
    )

    await Promise.all(promises)
  }

  /**
   * Register a route file.
   */
  static registerFile(file: File): void {
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
      .statusCode(object.statusCode)
      .body(object.body)
      .headers(object.headers)
      .redirectTo(object.redirectTo)
      .register(object.options)
  }
}

export class FakeApiBuilder {
  /**
   * The route path.
   */
  private _path?: string

  /**
   * The redirect path.
   */
  private _redirectTo?: string

  /**
   * The route method.
   */
  private _method?: HTTPMethods

  /**
   * The route response body.
   */
  private _body?: any | any[]

  /**
   * The route response headers.
   */
  private _headers?: any

  /**
   * The route response status code.
   */
  private _statusCode?: number

  /**
   * Set the route path.
   */
  public path(path: string): FakeApiBuilder {
    this._path = path

    return this
  }

  /**
   * Set the redirect path.
   */
  redirectTo(redirectTo: string): FakeApiBuilder {
    this._redirectTo = redirectTo

    return this
  }

  /**
   * Set the route method.
   */
  method(method: HTTPMethods): FakeApiBuilder {
    this._method = method

    return this
  }

  /**
   * Set the response body of the route.
   */
  body(body: any | any[]): FakeApiBuilder {
    this._body = body

    return this
  }

  /**
   * Set the response headers of the route.
   */
  headers(headers: any): FakeApiBuilder {
    this._headers = headers

    return this
  }

  /**
   * Set the response status code of the route.
   */
  statusCode(statusCode: number): FakeApiBuilder {
    this._statusCode = statusCode

    return this
  }

  /**
   * Register the route.
   */
  register(options: Partial<RouteOptions> = {}): void {
    let body = this._body || {}
    let statusCode = this._statusCode || 200

    const url = this._path || '/'
    const headers = this._headers || {}
    const method = this._method || 'GET'

    if (this._redirectTo) {
      statusCode = this._statusCode || 302
    }

    if (statusCode === 204) {
      body = undefined
    }

    if (app.hasRoute({ method, url })) {
      Debug.log(`Route ${method}::${url} already registered.`, 'api:testing')

      return
    }

    app.route({
      url,
      method,
      handler: (_, response) => {
        if (this._redirectTo) {
          return response.redirect(statusCode, this._redirectTo)
        }

        return response.status(statusCode).headers(headers).send(body)
      },
      ...options,
    })
  }
}

let app = FakeApi.recreate()
