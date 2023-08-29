/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { debug } from '#src/debug'
import { Is } from '#src/helpers/Is'
import { promisify } from 'node:util'
import { Transform } from 'node:stream'
import { File } from '#src/helpers/File'
import { Uuid } from '#src/helpers/Uuid'
import { Options } from '#src/helpers/Options'
import { request as requestHttp } from 'node:http'
import { request as requestHttps } from 'node:https'
import type { ExecOptions } from 'node:child_process'
import { exec as childProcessExec } from 'node:child_process'
import type { PaginationOptions, PaginatedResponse } from '#src/types'
import { NodeCommandException } from '#src/exceptions/NodeCommandException'

const exec = promisify(childProcessExec)

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
    callback: (value: T, index: number, array: T[]) => Promise<R>,
  ): Promise<R[]> {
    return Promise.all(array.map(callback))
  }

  /**
   * Execute a command of child process exec as promise.
   */
  public static async command(
    command: string,
    options?: { ignoreErrors?: boolean },
  ): Promise<{ stdout: string; stderr: string }> {
    options = Options.create(options, {
      ignoreErrors: false,
    })

    const execOptions: ExecOptions = {}

    if (Is.Windows() && Uuid.verify(process.env.WT_SESSION)) {
      execOptions.shell = 'powershell'
    }

    debug('executing command: %s', command)

    try {
      const result = await exec(command, execOptions)

      if (!result.stdout) result.stdout = ''
      if (!result.stderr) result.stderr = ''

      debug('command executed successfully')
      debug('command stdout: %s', result.stdout)
      debug('command stderr: %s', result.stderr)

      return result
    } catch (error) {
      if (!error.stdout) error.stdout = ''
      if (!error.stderr) error.stderr = ''

      debug('command has failed')
      debug('command stdout: %s', error.stdout)
      debug('command stderr: %s', error.stderr)

      if (options.ignoreErrors) {
        return { stdout: error.stdout, stderr: error.stderr }
      }

      throw new NodeCommandException(command, error)
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
    pagination?: PaginationOptions,
  ): PaginatedResponse<T> {
    pagination = Options.create(pagination, {
      page: 0,
      limit: 10,
      resourceUrl: '/',
    })

    const totalPages = Math.ceil(total / pagination.limit)

    const meta = {
      itemCount: data.length,
      totalItems: total,
      totalPages,
      currentPage: pagination.page,
      itemsPerPage: pagination.limit,
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
      last: `${pagination.resourceUrl}?page=${totalPages}&limit=${meta.itemsPerPage}`,
    }

    return { meta, links, data }
  }
}
