/**
 * @athenna/common
 *
 * // TODO Add your email here
 * (c) Robson Trasel <...>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fastify from 'fastify'
import { File, Is } from '#src/index'

const app = fastify()

// TODO Maybe this could become a helper too?
export class FakeApi {
  static get(uri, body = {}, statusCode = 200) {
    body = this.#getBody(body)

    app.get(uri, (req, res) => res.status(statusCode).send(body))

    return this
  }

  static post(uri, body = {}, statusCode = 201) {
    body = this.#getBody(body)

    app.post(uri, (req, res) => res.status(statusCode).send(body))

    return this
  }

  // TODO implement other requests

  static async start(port = 8080) {
    await app.listen({ port })
  }

  static async close() {
    await app.close()
  }

  static #getBody(body) {
    if (Is.String(body)) {
      body = new File(body).getContentSync().toString()
    }

    return body
  }
}
