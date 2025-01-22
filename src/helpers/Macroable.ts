/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * @credits @poppinss/macroable
 *
 * https://github.com/poppinss/macroable/blob/1.x/index.ts
 */

export abstract class Macroable {
  /**
   * Add standard property to your class prototype.
   *
   * @example
   * ```ts
   * YourClass.macro('foo', 'bar')
   * ```
   */
  public static macro<
    T extends { new (...args: any[]): any },
    K extends keyof InstanceType<T>
  >(this: T, name: K, value: InstanceType<T>[K]) {
    this.prototype[name] = value
  }

  /**
   * Add getters to the class prototype using the Object.defineProperty()
   * method.
   *
   * @example
   * ```ts
   * YourClass.getter('foo', function foo () {
   *  return 'bar'
   * })
   *
   * const singleton = true
   *
   * // Add singleton getter:
   * YourClass.getter('foo', function foo() {
   *  return 'bar'
   * }, singleton)
   * ```
   */
  public static getter<
    T extends { new (...args: any[]): any },
    K extends keyof InstanceType<T>
  >(
    this: T,
    name: K,
    accumulator: () => InstanceType<T>[K],
    singleton: boolean = false
  ): void {
    Object.defineProperty(this.prototype, name, {
      get() {
        const value = accumulator.call(this)

        if (singleton) {
          Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            value,
            writable: false
          })
        }

        return value
      },
      configurable: true,
      enumerable: false
    })
  }

  /**
   * Add a standard static property to the class itself.
   *
   * @example
   * ```ts
   * YourClass.staticMacro('foo', 'bar')
   * ```
   */
  public static staticMacro<T extends typeof Macroable, K extends keyof T>(
    this: T,
    name: K,
    value: T[K]
  ) {
    Object.defineProperty(this, name, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  /**
   * Add static getters to the class itself using Object.defineProperty().
   *
   * @example
   * ```ts
   * YourClass.staticGetter('foo', () => 'bar')
   *
   * const singleton = true
   *
   * // Add singleton static getter:
   * YourClass.staticGetter('foo', () => 'bar', singleton)
   * ```
   */
  public static staticGetter<T extends typeof Macroable, K extends keyof T>(
    this: T,
    name: K,
    accumulator: () => T[K],
    singleton: boolean = false
  ) {
    Object.defineProperty(this, name, {
      get: function () {
        const value = accumulator.call(this)

        if (singleton) {
          Object.defineProperty(this, name, {
            configurable: false,
            enumerable: true,
            value,
            writable: false
          })
        }

        return value
      },
      configurable: true,
      enumerable: true
    })
  }
}
