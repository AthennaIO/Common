/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Number } from '#src'
import { Test, type Context } from '@athenna/test'

export default class NumberTest {
  @Test()
  public async shouldGetTheHigherAndLowerNumberFromAnArrayOfNumbers({ assert }: Context) {
    const numbersArray = [1, 2, 3, 4, 5]

    assert.equal(Number.getLower(numbersArray), 1)
    assert.equal(Number.getHigher(numbersArray), 5)
  }

  @Test()
  public async shouldGetKmRadiusBetweenTwoCoordinates({ assert }: Context) {
    const first = Number.getKmRadius(
      { latitude: -25503207, longitude: -545390592 },
      { latitude: -25503207, longitude: -545390592 },
    )
    const second = Number.getKmRadius(
      { latitude: -25503207, longitude: -545390592 },
      { latitude: -254957901, longitude: -545671577 },
    )

    assert.equal(first, 0)
    assert.equal(second, 5338.683217695541)
  }

  @Test()
  public async shouldExtractAllNumbersInsideOfAStringInNumberAndArrayFormat({ assert }: Context) {
    const stringWithNumbers =
      "My name is João Lenon and I've 21 years old and I've been living in Foz do Iguaçu for 19 years"

    const oneBigNumber = Number.extractNumber(stringWithNumbers)
    const numbersArray = Number.extractNumbers(stringWithNumbers)

    assert.equal(oneBigNumber, 2119)
    assert.deepEqual(numbersArray, [21, 19])
  }

  @Test()
  public async shouldGetTheAverageOfNumbersByArgsOrArrayOfNumbers({ assert }: Context) {
    const arrayNumbers = [1, 2, 3, 4, 5]

    const argsAverage = Number.argsAverage(arrayNumbers[0], arrayNumbers[1])
    const arrayAverage = Number.arrayAverage(arrayNumbers)

    assert.equal(argsAverage, 1.5)
    assert.equal(arrayAverage, 3)
  }

  @Test()
  public async shouldGenerateARandomIntegerBetweenTwoIntegerValues({ assert }: Context) {
    assert.isNumber(Number.randomIntFromInterval(0, 0))
    assert.isNumber(Number.randomIntFromInterval(1, 10))
  }
}
