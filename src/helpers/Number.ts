/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src/helpers/Parser'

export class Number {
  /**
   * Get the higher number from an array of numbers.
   */
  public static getHigher(numbers: number[]): number {
    // eslint-disable-next-line prefer-spread
    return Math.max.apply(Math, numbers)
  }

  /**
   * Get km radius between two coordinates.
   */
  public static getKmRadius(
    centerCord: { latitude: number; longitude: number },
    pointCord: { latitude: number; longitude: number }
  ): number {
    const deg2rad = deg => deg * (Math.PI / 180)

    const radius = 6371

    const { latitude: latitude1, longitude: longitude1 } = centerCord
    const { latitude: latitude2, longitude: longitude2 } = pointCord

    const dLat = deg2rad(latitude2 - latitude1)
    const dLon = deg2rad(longitude2 - longitude1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(latitude1)) *
        Math.cos(deg2rad(latitude2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return radius * center
  }

  /**
   * Get the lower number from an array of numbers.
   */
  public static getLower(numbers: number[]): number {
    // eslint-disable-next-line prefer-spread
    return Math.min.apply(Math, numbers)
  }

  /**
   * Extract all numbers inside a string and
   * return as a unique number.
   */
  public static extractNumber(string: string): number {
    return Parser.stringToNumber(string.replace(/\D/g, ''))
  }

  /**
   * Extract all numbers inside a string.
   */
  public static extractNumbers(string: string): number[] {
    return string.match(/\d+/g).map(numberString => {
      return Parser.stringToNumber(numberString)
    })
  }

  /**
   * The average of all numbers in function arguments.
   */
  public static argsAverage(...args: number[]): number {
    return Number.arrayAverage(args)
  }

  /**
   * The average of all numbers in the array.
   */
  public static arrayAverage(array: number[]): number {
    return array.reduce((acc, curr) => acc + curr, 0) / array.length
  }

  /**
   * Generate a random integer from a determined interval of numbers.
   */
  public static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
