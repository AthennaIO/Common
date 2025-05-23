/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  Hooks,
  RequestError,
  RetryObject,
  CacheOptions,
  ToughCookieJar,
  PromiseCookieJar
} from 'got'

export type {
  Hooks,
  RequestError,
  RetryObject,
  CacheOptions,
  ToughCookieJar,
  PromiseCookieJar
}

export * from '#src/types/Merge'
export * from '#src/types/Except'
export * from '#src/types/PathDirs'
export * from '#src/types/CommandInput'
export * from '#src/types/CommandOutput'
export * from '#src/types/NodeCommandInput'
export * from '#src/types/ObjectBuilderOptions'

export * from '#src/types/LinkPackageOptions'
export * from '#src/types/InstallPackageOptions'

export * from '#src/types/json/FileJson'
export * from '#src/types/json/HTMLJson'
export * from '#src/types/json/FolderJson'
export * from '#src/types/json/ExceptionJson'

export * from '#src/types/ModuleResolveOptions'
export * from '#src/types/pagination/PaginationOptions'
export * from '#src/types/pagination/PaginatedResponse'

export * from '#src/types/http-client/Body'
export * from '#src/types/http-client/Query'
export * from '#src/types/http-client/Request'
export * from '#src/types/http-client/Response'
export * from '#src/types/http-client/RetryStrategyCallback'
