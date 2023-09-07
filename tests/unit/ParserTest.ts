/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src'
import { Test, type Context } from '@athenna/test'
import { InvalidNumberException } from '#src/exceptions/InvalidNumberException'

export default class ParserTest {
  @Test()
  public async shouldParseStringToNumberAndStringToArray({ assert }: Context) {
    const parsedNumberInt = Parser.stringToNumber('1')
    const parsedNumberFloat = Parser.stringToNumber('100.000,000000')

    assert.equal(parsedNumberInt, 1)
    assert.equal(parsedNumberFloat, 100000000000)

    const parsedArray = Parser.stringToArray('hello, peopleee', ',')

    assert.deepEqual(parsedArray, ['hello', 'peopleee'])

    const useCase = () => Parser.stringToNumber('not-a-number')

    assert.throws(useCase, InvalidNumberException)
  }

  @Test()
  public async shouldParseArrayToStringBasedOnOptions({ assert }: Context) {
    assert.equal(Parser.arrayToString([]), '')
    assert.equal(Parser.arrayToString(['']), '')
    assert.equal(Parser.arrayToString(['1', '2']), '1 and 2')
    assert.equal(Parser.arrayToString(['1', '2', '3', '4']), '1, 2, 3 and 4')
    assert.equal(
      Parser.arrayToString(['1', '2', '3', '4', '5', '6'], {
        separator: '|',
        lastSeparator: '|'
      }),
      '1|2|3|4|5|6'
    )

    assert.equal(
      Parser.arrayToString(['1', '2'], {
        pairSeparator: '-'
      }),
      '1-2'
    )
  }

  @Test()
  public async shouldParseJsonToFormData({ assert }: Context) {
    const json = {
      name: 'lenon',
      email: 'lenonSec7@gmail.com'
    }

    const formData = Parser.jsonToFormData(json)

    assert.equal(formData, 'name=lenon&email=lenonSec7%40gmail.com')
  }

  @Test()
  public async shouldParseFormDataToJson({ assert }: Context) {
    const formData = '?name=lenon&email=lenonSec7%40gmail.com'

    const json = Parser.formDataToJson(formData)

    assert.deepEqual(json, {
      name: 'lenon',
      email: 'lenonSec7@gmail.com'
    })
  }

  @Test()
  public async shouldBeAbleToParseALinkToUrlsWithATagFromHTMLInsideStrings({ assert }: Context) {
    const string =
      'this is a string with one link - https://joao.com and other link https://joaolenon.com and https://lenon.com'

    assert.isString(Parser.linkToHref(string))
  }

  @Test()
  public async shouldParseTheNumberToByteFormatAndByteFormatToNumber({ assert }: Context) {
    // size to byte
    assert.equal(Parser.sizeToByte(1024), '1KB')
    assert.equal(Parser.sizeToByte(1048576), '1MB')
    assert.equal(Parser.sizeToByte(1073741824), '1GB')
    assert.equal(Parser.sizeToByte(1099511627776), '1TB')
    assert.equal(Parser.sizeToByte(1125899906842624), '1PB')

    // byte to size
    assert.equal(Parser.byteToSize('1KB'), 1024)
    assert.equal(Parser.byteToSize('1MB'), 1048576)
    assert.equal(Parser.byteToSize('1GB'), 1073741824)
    assert.equal(Parser.byteToSize('1TB'), 1099511627776)
    assert.equal(Parser.byteToSize('1PB'), 1125899906842624)
  }

  @Test()
  public async shouldParseTheStringToMsFormatAndMsFormatToString({ assert }: Context) {
    // time to ms
    assert.equal(Parser.timeToMs('2 days'), 172800000)
    assert.equal(Parser.timeToMs('1d'), 86400000)
    assert.equal(Parser.timeToMs('10h'), 36000000)
    assert.equal(Parser.timeToMs('-10h'), -36000000)
    assert.equal(Parser.timeToMs('1 year'), 31557600000)
    assert.equal(Parser.timeToMs('-1 year'), -31557600000)

    // ms to time
    assert.equal(Parser.msToTime(172800000, true), '2 days')
    assert.equal(Parser.msToTime(86400000), '1d')
    assert.equal(Parser.msToTime(36000000), '10h')
    assert.equal(Parser.msToTime(-36000000), '-10h')
    assert.equal(Parser.msToTime(31557600000, true), '365 days')
    assert.equal(Parser.msToTime(-31557600000, true), '-365 days')
  }

  @Test()
  public async shouldParseTheStatusCodeToReasonAndReasonToStatusCode({ assert }: Context) {
    // status code to reason
    assert.equal(Parser.statusCodeToReason(200), 'OK')
    assert.equal(Parser.statusCodeToReason('201'), 'CREATED')
    assert.equal(Parser.statusCodeToReason(401), 'UNAUTHORIZED')
    assert.equal(Parser.statusCodeToReason(500), 'INTERNAL_SERVER_ERROR')

    // reason to status code
    assert.equal(Parser.reasonToStatusCode('ok'), 200)
    assert.equal(Parser.reasonToStatusCode('Created'), 201)
    assert.equal(Parser.reasonToStatusCode('unauthorized'), 401)
    assert.equal(Parser.reasonToStatusCode('INTERNAL_SERVER_ERROR'), 500)
  }

  @Test()
  public async shouldParseTheCompleteDatabaseUrlToObject({ assert }: Context) {
    const url = 'postgresql://postgres:root@127.0.0.1:5432/postgres?paramOne=1&paramTwo=2&paramThree=3'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    assert.equal(connectionObject.protocol, 'postgresql')
    assert.equal(connectionObject.user, 'postgres')
    assert.equal(connectionObject.password, 'root')
    assert.equal(connectionObject.host, '127.0.0.1')
    assert.equal(connectionObject.port, 5432)
    assert.equal(connectionObject.database, 'postgres')
    assert.deepEqual(connectionObject.options, {
      paramOne: '1',
      paramTwo: '2',
      paramThree: '3'
    })

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    assert.equal(connectionUrl, url)
  }

  @Test()
  public async shouldParseTheWithoutAuthDatabaseUrlToObject({ assert }: Context) {
    const url = 'postgresql://root:root@127.0.0.1:5432/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    assert.equal(connectionObject.protocol, 'postgresql')
    assert.equal(connectionObject.user, 'root')
    assert.equal(connectionObject.password, 'root')
    assert.equal(connectionObject.host, '127.0.0.1')
    assert.equal(connectionObject.port, 5432)
    assert.equal(connectionObject.database, 'postgres')
    assert.deepEqual(connectionObject.options, {})

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    assert.equal(connectionUrl, url)
  }

  @Test()
  public async shouldParseTheWithoutAuthAndPortDatabaseUrlToObject({ assert }: Context) {
    const url = 'postgresql://127.0.0.1/postgres?options=10&test=10'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    assert.equal(connectionObject.protocol, 'postgresql')
    assert.equal(connectionObject.user, null)
    assert.equal(connectionObject.password, null)
    assert.equal(connectionObject.host, '127.0.0.1')
    assert.equal(connectionObject.port, null)
    assert.equal(connectionObject.database, 'postgres')
    assert.deepEqual(connectionObject.options, {
      options: '10',
      test: '10'
    })

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    assert.equal(connectionUrl, url)
  }

  @Test()
  public async shouldParseTheWithoutAuthPortAndOptionsDatabaseUrl({ assert }: Context) {
    const url = 'postgresql://127.0.0.1/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    assert.equal(connectionObject.protocol, 'postgresql')
    assert.equal(connectionObject.user, null)
    assert.equal(connectionObject.password, null)
    assert.equal(connectionObject.host, '127.0.0.1')
    assert.equal(connectionObject.port, null)
    assert.equal(connectionObject.database, 'postgres')
    assert.deepEqual(connectionObject.options, {})

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    assert.equal(connectionUrl, url)
  }

  @Test()
  public async shouldParseTheClusterDatabaseUrlToObject({ assert }: Context) {
    const url = 'postgresql://postgres:root@127.0.0.1:5432,127.0.0.1:5433,127.0.0.1:5434/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    assert.equal(connectionObject.protocol, 'postgresql')
    assert.equal(connectionObject.user, 'postgres')
    assert.equal(connectionObject.password, 'root')
    assert.equal(connectionObject.port, null)
    assert.equal(connectionObject.database, 'postgres')
    assert.deepEqual(connectionObject.options, {})
    assert.deepEqual(connectionObject.host, ['127.0.0.1:5432', '127.0.0.1:5433', '127.0.0.1:5434'])

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    assert.equal(connectionUrl, url)
  }

  @Test()
  public async shouldBeAbleToParseAnObjectToObjectBuilder({ assert }: Context) {
    const object = { hello: 'world' }

    const builder = Parser.objectToBuilder(object)

    assert.deepEqual(builder.get(), { hello: 'world' })
  }

  @Test()
  public async shouldBeAbleToParseAnObjectBuilderToObject({ assert }: Context) {
    const array = [{ hello: 'world' }, { hello: 'world' }]

    const builders = Parser.arrayObjectToArrayBuilder(array)

    assert.deepEqual(builders[0].get(), { hello: 'world' })
  }
}
