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
    athenna: {
      /**
       * Call the toJSON method of each item
       * inside the array.
       */
      toJSON(criterias?: any): Record<string, any>[]

      /**
       * Call the toResource method of each item
       * inside the array.
       */
      toResource(criterias?: any): T[]

      /**
       * Transform the array to an Athenna collection.
       */
      toCollection(): Collection<T>
    }
  }
}

if (!Array.prototype.athenna) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Array.prototype, 'athenna', {
    get: function () {
      return {
        toJSON: (criterias: any = {}) => {
          return this.map(model => {
            if (model && model.toJSON) {
              return model.toJSON(criterias)
            }

            return null
          }).filter(Boolean)
        },
        toResource: (criterias: any = {}) => {
          return this.map(model => {
            if (model && model.toResource) {
              return model.toResource(criterias)
            }

            return null
          }).filter(Boolean)
        },
        toCollection: () => {
          return new Collection(this)
        }
      }
    }
  })
}
