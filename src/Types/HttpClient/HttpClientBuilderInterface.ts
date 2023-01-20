import {
  Options,
  Response,
  OptionsInit,
  CancelableRequest,
  OptionsOfJSONResponseBody,
  OptionsOfTextResponseBody,
  OptionsOfBufferResponseBody,
  OptionsOfUnknownResponseBody,
} from 'got'

import { Merge } from '#src/Types/Merge'

export interface HttpClientBuilderInterface {
  /*
  |--------------------------------------------------------------------------
  | GET
  |--------------------------------------------------------------------------
  */

  get(
    url: string | URL,
    options?: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  get<T>(
    url: string | URL,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<Response<T>>
  get(
    url: string | URL,
    options?: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  get(
    url: string | URL,
    options?: OptionsOfUnknownResponseBody,
  ): CancelableRequest<Response>
  get(options: OptionsOfTextResponseBody): CancelableRequest<Response<string>>
  get<T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>
  get(options: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>
  get(options: OptionsOfUnknownResponseBody): CancelableRequest<Response>
  get(
    url: string | URL,
    options?: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  get<T>(
    url: string | URL,
    options?: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  get(
    url: string | URL,
    options?: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  get(
    options: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  get<T>(
    options: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  get(
    options: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  get(
    url: string | URL,
    options?: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  get(
    options: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  get(url: string | URL, options?: OptionsInit): CancelableRequest | Request
  get(options: OptionsInit): CancelableRequest | Request
  get(
    url: undefined,
    options: undefined,
    defaults: Options,
  ): CancelableRequest | Request

  /*
  |--------------------------------------------------------------------------
  | POST
  |--------------------------------------------------------------------------
  */

  post(
    url: string | URL,
    options?: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  post<T>(
    url: string | URL,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<Response<T>>
  post(
    url: string | URL,
    options?: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  post(
    url: string | URL,
    options?: OptionsOfUnknownResponseBody,
  ): CancelableRequest<Response>
  post(options: OptionsOfTextResponseBody): CancelableRequest<Response<string>>
  post<T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>
  post(
    options: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  post(options: OptionsOfUnknownResponseBody): CancelableRequest<Response>
  post(
    url: string | URL,
    options?: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  post<T>(
    url: string | URL,
    options?: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  post(
    url: string | URL,
    options?: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  post(
    options: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  post<T>(
    options: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  post(
    options: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  post(
    url: string | URL,
    options?: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  post(
    options: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  post(url: string | URL, options?: OptionsInit): CancelableRequest | Request
  post(options: OptionsInit): CancelableRequest | Request
  post(
    url: undefined,
    options: undefined,
    defaults: Options,
  ): CancelableRequest | Request

  /*
  |--------------------------------------------------------------------------
  | PUT
  |--------------------------------------------------------------------------
  */

  put(
    url: string | URL,
    options?: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  put<T>(
    url: string | URL,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<Response<T>>
  put(
    url: string | URL,
    options?: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  put(
    url: string | URL,
    options?: OptionsOfUnknownResponseBody,
  ): CancelableRequest<Response>
  put(options: OptionsOfTextResponseBody): CancelableRequest<Response<string>>
  put<T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>
  put(options: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>
  put(options: OptionsOfUnknownResponseBody): CancelableRequest<Response>
  put(
    url: string | URL,
    options?: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  put<T>(
    url: string | URL,
    options?: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  put(
    url: string | URL,
    options?: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  put(
    options: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  put<T>(
    options: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  put(
    options: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  put(
    url: string | URL,
    options?: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  put(
    options: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  put(url: string | URL, options?: OptionsInit): CancelableRequest | Request
  put(options: OptionsInit): CancelableRequest | Request
  put(
    url: undefined,
    options: undefined,
    defaults: Options,
  ): CancelableRequest | Request

  /*
  |--------------------------------------------------------------------------
  | PATCH
  |--------------------------------------------------------------------------
  */

  patch(
    url: string | URL,
    options?: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  patch<T>(
    url: string | URL,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<Response<T>>
  patch(
    url: string | URL,
    options?: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  patch(
    url: string | URL,
    options?: OptionsOfUnknownResponseBody,
  ): CancelableRequest<Response>
  patch(options: OptionsOfTextResponseBody): CancelableRequest<Response<string>>
  patch<T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>
  patch(
    options: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  patch(options: OptionsOfUnknownResponseBody): CancelableRequest<Response>
  patch(
    url: string | URL,
    options?: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  patch<T>(
    url: string | URL,
    options?: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  patch(
    url: string | URL,
    options?: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  patch(
    options: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  patch<T>(
    options: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  patch(
    options: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  patch(
    url: string | URL,
    options?: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  patch(
    options: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  patch(url: string | URL, options?: OptionsInit): CancelableRequest | Request
  patch(options: OptionsInit): CancelableRequest | Request
  patch(
    url: undefined,
    options: undefined,
    defaults: Options,
  ): CancelableRequest | Request

  /*
  |--------------------------------------------------------------------------
  | PATCH
  |--------------------------------------------------------------------------
  */

  delete(
    url: string | URL,
    options?: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  delete<T>(
    url: string | URL,
    options?: OptionsOfJSONResponseBody,
  ): CancelableRequest<Response<T>>
  delete(
    url: string | URL,
    options?: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  delete(
    url: string | URL,
    options?: OptionsOfUnknownResponseBody,
  ): CancelableRequest<Response>
  delete(
    options: OptionsOfTextResponseBody,
  ): CancelableRequest<Response<string>>
  delete<T>(options: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>
  delete(
    options: OptionsOfBufferResponseBody,
  ): CancelableRequest<Response<Buffer>>
  delete(options: OptionsOfUnknownResponseBody): CancelableRequest<Response>
  delete(
    url: string | URL,
    options?: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  delete<T>(
    url: string | URL,
    options?: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  delete(
    url: string | URL,
    options?: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  delete(
    options: Merge<
      OptionsOfTextResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<string>
  delete<T>(
    options: Merge<
      OptionsOfJSONResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<T>
  delete(
    options: Merge<
      OptionsOfBufferResponseBody,
      {
        resolveBodyOnly: true
      }
    >,
  ): CancelableRequest<Buffer>
  delete(
    url: string | URL,
    options?: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  delete(
    options: Merge<
      OptionsInit,
      {
        isStream: true
      }
    >,
  ): Request
  delete(url: string | URL, options?: OptionsInit): CancelableRequest | Request
  delete(options: OptionsInit): CancelableRequest | Request
  delete(
    url: undefined,
    options: undefined,
    defaults: Options,
  ): CancelableRequest | Request
}
