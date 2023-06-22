/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is, Exception } from '#src'
import { Test } from '@athenna/test'
import type { Context } from '@athenna/test/types'

export default class IsTest {
  @Test()
  public async shouldVerifyIfIsAValidJsonString({ assert }: Context) {
    assert.isFalse(Is.Json(''))
    assert.isFalse(Is.Json('Hello'))
    assert.isTrue(Is.Json('[]'))
    assert.isTrue(Is.Json('{}'))
    assert.isTrue(Is.Json(JSON.stringify({ hello: 'world' })))
  }

  @Test()
  public async shouldVerifyIfIsAValidIpAddress({ assert }: Context) {
    assert.isFalse(Is.Ip(''))
    assert.isFalse(Is.Ip(' '))
    assert.isFalse(Is.Ip('http://localhost:3000'))
    assert.isTrue(Is.Ip('http://127.0.0.1'))
    assert.isTrue(Is.Ip('https://127.0.0.1:1335'))
    assert.isTrue(Is.Ip('127.0.0.1'))
  }

  @Test()
  public async shouldVerifyIsIsAValidUuid({ assert }: Context) {
    assert.isFalse(Is.Uuid(''))
    assert.isFalse(Is.Uuid(' '))
    assert.isTrue(Is.Uuid('50bc9524-c4b3-11ec-9d64-0242ac120002'))
    assert.isFalse(Is.Uuid('ath-50bc9524-c4b3-11ec-9d64-0242ac120002'))
  }

  @Test()
  public async shouldVerifyIfIsAnEmptyString({ assert }: Context) {
    assert.isTrue(Is.Empty(0))
    assert.isFalse(Is.Empty(1))
    assert.isTrue(Is.Empty(''))
    assert.isTrue(Is.Empty(' '))
    assert.isFalse(Is.Empty('hello'))
  }

  @Test()
  public async shouldVerifyIfIsAnEmptyNumber({ assert }: Context) {
    assert.isTrue(Is.Empty(0))
    assert.isFalse(Is.Empty(10))
  }

  @Test()
  public async shouldVerifyIfIsAnEmptyObject({ assert }: Context) {
    assert.isTrue(Is.Empty({}))
    assert.isFalse(Is.Empty({ hello: 'world' }))
  }

  @Test()
  public async shouldVerifyIfIsAnEmptyArray({ assert }: Context) {
    assert.isTrue(Is.Empty([]))
    assert.isFalse(Is.Empty([null]))
    assert.isFalse(Is.Empty([{ hello: 'world' }]))
  }

  @Test()
  public async shouldVerifyIfIsAValidCep({ assert }: Context) {
    assert.isFalse(Is.Cep(0))
    assert.isFalse(Is.Cep(''))
    assert.isTrue(Is.Cep(43710130))
    assert.isTrue(Is.Cep('43710-130'))
  }

  @Test()
  public async shouldVerifyIsIsAValidCPF({ assert }: Context) {
    assert.isFalse(Is.Cpf(0))
    assert.isFalse(Is.Cpf(''))
    assert.isTrue(Is.Cpf(52946109062))
    assert.isTrue(Is.Cpf('529.461.090-62'))
  }

  @Test()
  public async shouldVerifyIsIsAValidCNPJ({ assert }: Context) {
    assert.isFalse(Is.Cnpj(0))
    assert.isFalse(Is.Cnpj(''))
    assert.isTrue(Is.Cnpj(23984398000143))
    assert.isTrue(Is.Cnpj('31.017.771/0001-15'))
  }

  @Test()
  public async shouldVerifyIfIsAValidUndefined({ assert }: Context) {
    assert.isFalse(Is.Undefined(0))
    assert.isFalse(Is.Undefined(''))
    assert.isTrue(Is.Undefined(undefined))
  }

  @Test()
  public async shouldVerifyIfIsAValidNull({ assert }: Context) {
    assert.isFalse(Is.Null(0))
    assert.isFalse(Is.Null(''))
    assert.isTrue(Is.Null(null))
  }

  @Test()
  public async shouldVerifyIfIsAValidBoolean({ assert }: Context) {
    assert.isFalse(Is.Boolean(0))
    assert.isFalse(Is.Boolean(''))
    assert.isTrue(Is.Boolean(true))
    assert.isTrue(Is.Boolean(false))
  }

  @Test()
  public async shouldVerifyIfIsAValidBuffer({ assert }: Context) {
    assert.isFalse(Is.Buffer(0))
    assert.isFalse(Is.Buffer(''))
    assert.isTrue(Is.Buffer(Buffer.from('Hello World')))
  }

  @Test()
  public async shouldVerifyIfIsAValidNumber({ assert }: Context) {
    assert.isTrue(Is.Number(0))
    assert.isFalse(Is.Number(''))
    assert.isTrue(Is.Number(-10))
  }

  @Test()
  public async shouldVerifyIfIsAValidString({ assert }: Context) {
    assert.isFalse(Is.String(0))
    assert.isTrue(Is.String(''))
    assert.isTrue(Is.String('hello world'))
  }

  @Test()
  public async shouldVerifyIfIsAValidObject({ assert }: Context) {
    assert.isFalse(Is.Object(0))
    assert.isTrue(Is.Object({ hello: 'world' }))
    assert.isFalse(Is.Object('hello world'))
    assert.isFalse(Is.Object(JSON.stringify({ hello: 'world' })))
  }

  @Test()
  public async shouldVerifyIfIsAValidDate({ assert }: Context) {
    assert.isFalse(Is.Date(0))
    assert.isTrue(Is.Date(new Date()))
    assert.isFalse(Is.Date(new Date().getTime()))
  }

  @Test()
  public async shouldVerifyIfIsAValidArray({ assert }: Context) {
    assert.isFalse(Is.Array(0))
    assert.isFalse(Is.Array(''))
    assert.isTrue(Is.Array(['']))
  }

  @Test()
  public async shouldVerifyIfIsAValidRegExp({ assert }: Context) {
    assert.isFalse(Is.Regexp(0))
    assert.isFalse(Is.Regexp(''))
    assert.isTrue(Is.Regexp(/g/))
    // eslint-disable-next-line prefer-regex-literals
    assert.isTrue(Is.Regexp(new RegExp('')))
  }

  @Test()
  public async shouldVerifyIfIsAValidError({ assert }: Context) {
    assert.isFalse(Is.Error(0))
    assert.isFalse(Is.Error(''))
    assert.isFalse(Is.Error({}))
    assert.isTrue(Is.Error(new Error()))
    assert.isTrue(Is.Error(new TypeError()))
    assert.isTrue(Is.Error(new SyntaxError()))
    assert.isTrue(Is.Error(new Exception({ message: 'Test' })))
  }

  @Test()
  public async shouldVerifyIfIsAValidException({ assert }: Context) {
    assert.isFalse(Is.Exception(0))
    assert.isFalse(Is.Exception(''))
    assert.isFalse(Is.Exception({}))
    assert.isFalse(Is.Exception(new Error()))
    assert.isFalse(Is.Exception(new TypeError()))
    assert.isFalse(Is.Exception(new SyntaxError()))
    assert.isTrue(Is.Exception(new Exception({ message: 'Test' })))
  }

  @Test()
  public async shouldVerifyIfIsAValidFunction({ assert }: Context) {
    assert.isFalse(Is.Function(0))
    assert.isFalse(Is.Function(''))
    assert.isTrue(Is.Function(() => ''))
    assert.isTrue(
      Is.Function(function test() {
        return ''
      }),
    )
  }

  @Test()
  public async shouldVerifyIsIsAValidAsyncFunction({ assert }: Context) {
    assert.isFalse(Is.Async(0))
    assert.isFalse(Is.Async(''))
    assert.isFalse(Is.Async(() => ''))
    assert.isFalse(
      Is.Async(function test() {
        return ''
      }),
    )
    assert.isTrue(Is.Async(async () => ''))
    assert.isTrue(Is.Async(() => new Promise(resolve => resolve)))
  }

  @Test()
  public async shouldVerifyIsIsAValidClass({ assert }: Context) {
    assert.isFalse(Is.Class(0))
    assert.isFalse(Is.Class(''))
    assert.isTrue(Is.Class(Exception))
  }

  @Test()
  public async shouldVerifyIsIsAValidInteger({ assert }: Context) {
    assert.isTrue(Is.Integer(0))
    assert.isFalse(Is.Integer(1.2))
  }

  @Test()
  public async shouldVerifyIsIsAValidFloat({ assert }: Context) {
    assert.isFalse(Is.Float(0))
    assert.isTrue(Is.Float(1.2))
  }

  @Test()
  public async shouldVerifyIsIsAValidArrayOfObjects({ assert }: Context) {
    const data = [
      {
        hello: 'hello',
      },
      {
        hello: 'hello',
      },
    ]

    assert.isFalse(Is.ArrayOfObjects([]))
    assert.isFalse(Is.ArrayOfObjects([1, 2, 3]))
    assert.isFalse(Is.ArrayOfObjects(['', '', '']))
    assert.isTrue(Is.ArrayOfObjects(data))
  }
}
