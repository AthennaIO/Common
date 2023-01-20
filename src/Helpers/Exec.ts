/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { promisify } from 'node:util'
import { Transform } from 'node:stream'
import { File } from '#src/Helpers/File'
import { Uuid } from '#src/Helpers/Uuid'
import { Options } from '#src/Helpers/Options'
import { request as requestHttp } from 'node:http'
import { request as requestHttps } from 'node:https'
import { exec as childProcessExec, ExecOptions } from 'node:child_process'
import { NodeCommandException } from '#src/Exceptions/NodeCommandException'

const exec = promisify(childProcessExec)

export interface PaginationOptions {
  page?: number
  limit?: number
  resourceUrl?: string
}

export interface PaginatedResponse<T = any> {
  data?: T[]
  meta?: {
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    itemCount: number
  }
  links?: {
    next: string
    previous: string
    last: string
    first: string
  }
}

export class Exec {
  /**
   * Sleep the code in the line that this function
   * is being called.
   */
  public static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
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

    try {
      const execOptions: ExecOptions = {}

      if (process.platform === 'win32' && Uuid.verify(process.env.WT_SESSION)) {
        execOptions.shell = 'powershell'
      }

      // Needs to await explicit because of try catch
      return await exec(command, execOptions)
    } catch (error) {
      if (options.ignoreErrors) {
        return { stdout: error.stdout, stderr: error.stderr }
      }

      throw new NodeCommandException(command, error)
    }
  }

  /**
   * Download an archive to determined path.
   */
  public static async download(
    name: string,
    path: string,
    url: string,
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const callback = response => {
        const data = new Transform()

        response.on('data', chunk => data.push(chunk))

        response.on('end', function () {
          resolve(new File(`${path}/${name}`, data.read()).loadSync())
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
