/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Collection } from '#src/helpers/Collection'

export {}

declare global {
  interface Array<T> {
    /**
     * Call the toJSON method of each item
     * inside the array.
     */
    toAthennaJSON(): Record<string, any>[]

    /**
     * Call the toResource method of each item
     * inside the array.
     */
    toAthennaResource(criterias?: any): T[]

    /**
     * Transform the array to an Athenna collection.
     */
    toAthennaCollection(): Collection<T>
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.toAthennaJSON = function () {
  return this.map(model => {
    if (model && model.toJSON) {
      return model.toJSON()
    }

    return null
  }).filter(Boolean)
}

// eslint-disable-next-line no-extend-native
Array.prototype.toAthennaResource = function (criterias = {}) {
  return this.map(model => {
    if (model && model.toResource) {
      return model.toResource(criterias)
    }

    return null
  }).filter(Boolean)
}

// eslint-disable-next-line no-extend-native
Array.prototype.toAthennaCollection = function () {
  return new Collection(this)
}
