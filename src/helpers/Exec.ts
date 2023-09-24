/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Transform } from 'node:stream'
import { File } from '#src/helpers/File'
import { Options } from '#src/helpers/Options'
import { request as requestHttp } from 'node:http'
import { request as requestHttps } from 'node:https'
import type { PaginationOptions, PaginatedResponse } from '#src/types'
import {
  execa,
  execaNode,
  execaCommand,
  type Options as CommandOptions,
  type NodeOptions as NodeCommandOptions,
  type ExecaChildProcess as CommandOutput
} from 'execa'

export class Exec {
  /**
   * Sleep the code in the line that this function
   * is being called.
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Execute some callback concurrently in all values of the array.
   */

  public static async concurrently<T = any, R = any>(
    array: T[],
    callback: (value: T, index: number, array: T[]) => Promise<R>
  ): Promise<R[]> {
    return Promise.all(array.map(callback))
  }

  /**
   * Execute a shell command as a child process.
   */
  public static async shell(
    command: string,
    options: CommandOptions = {}
  ): Promise<CommandOutput> {
    return execa('sh', ['-c', command], options)
  }

  /**
   * Execute one specific command as a child process.
   */
  public static async command(
    command: string,
    options: CommandOptions = {}
  ): Promise<CommandOutput> {
    return execaCommand(command, options)
  }

  /**
   * Execute a node script as a child process.
   */
  public static async node(
    path: string,
    argv: string[] = [],
    options: NodeCommandOptions = {}
  ): Promise<CommandOutput> {
    return execaNode(path, argv, options)
  }

  /**
   * Execute an Artisan file in a child process.
   */
  public static async artisan(
    path: string,
    options: NodeCommandOptions = {}
  ): Promise<void> {
    options = Options.create(options, {
      preferLocal: true,
      windowsHide: false,
      localDir: Path.pwd(),
      cwd: Path.pwd(),
      buffer: false,
      stdio: 'inherit'
    })

    const child = Exec.node(path, process.argv.slice(2), options)

    try {
      const result = await child
      process.exitCode = result.exitCode
    } catch (error) {
      process.exitCode = 1
    }
  }

  /**
   * Download an archive to a determined path.
   */
  public static async download(path: string, url: string): Promise<File> {
    return new Promise((resolve, reject) => {
      const callback = response => {
        const data = new Transform()

        response.on('data', chunk => data.push(chunk))

        response.on('end', function () {
          resolve(new File(path, data.read()).loadSync())
        })

        response.on('error', error => reject(error))
      }

      if (url.includes('https')) {
        requestHttps(url, callback).end()

        return
      }

      requestHttp(url, callback).end()
    })
  }

  /**
   * Paginate a collection of data.
   */
  public static pagination<T = any>(
    data: any[],
    total: number,
    pagination?: PaginationOptions
  ): PaginatedResponse<T> {
    pagination = Options.create(pagination, {
      page: 0,
      limit: 10,
      resourceUrl: '/'
    })

    const totalPages = Math.ceil(total / pagination.limit)

    const meta = {
      itemCount: data.length,
      totalItems: total,
      totalPages,
      currentPage: pagination.page,
      itemsPerPage: pagination.limit
    }

    let nextPage = 1
    let previousPage = 0

    if (meta.currentPage && meta.currentPage < meta.totalPages) {
      nextPage = meta.currentPage + 1
      previousPage = meta.currentPage - 1
    }

    const links = {
      first: `${pagination.resourceUrl}?limit=${meta.itemsPerPage}`,
      previous: `${pagination.resourceUrl}?page=${previousPage}&limit=${meta.itemsPerPage}`,
      next: `${pagination.resourceUrl}?page=${nextPage}&limit=${meta.itemsPerPage}`,
      last: `${pagination.resourceUrl}?page=${totalPages}&limit=${meta.itemsPerPage}`
    }

    return { meta, links, data }
  }
}
