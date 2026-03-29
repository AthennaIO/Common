/**
 * @athenna/common
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


export class TimeoutBuilder<T> {
  private promise: Promise<T>;

  private options: {
    ms?: number;
    onTimeout?: () => any;
    onError?: (error: Error) => any;
  };

  public constructor(promise: Promise<T>) {
    this.options = {};
    this.promise = promise;
  }

  /**
   * Define the timeout in milliseconds.
   * 
   * @example
   * ```ts
   * const result = await Timeout.when(promise)
   *   .ms(1000)
   *   .race()
   * ```
   */
  public ms(ms: number) {
    this.options.ms = ms;

    return this;
  }

  /**
   * Define the callback to be executed when an error occurs handling
   * the promise.
   * 
   * @example
   * ```ts
   * const result = await Timeout.when(promise)
   *   .ms(1000)
   *   .onError(error => ('fallback error'))
   *   .race()
   * ```
   */
  public onError(closure: (error: Error) => Promise<T>) {
    this.options.onError = closure;

    return this;
  }

  /**
   * Define the callback to be executed when the timeout occurs.
   * 
   * @example
   * ```ts
   * const result = await Timeout.when(promise)
   *   .ms(1000)
   *   .onTimeout(() => ('fallback timeout'))
   *   .race()
   * ```
   */
  public onTimeout(closure: () => any) {
    this.options.onTimeout = closure;

    return this;
  }

  /**
   * Race the promise with timeout.
   * 
   * @example
   * ```ts
   * const result = await Timeout.when(promise)
   *   .ms(1000)
   *   .onTimeout(() => ('fallback timeout'))
   *   .onError(error => ('fallback error'))
   *   .race()
   * ```
   */
  public async race() {
    if (!this.options.ms) {
      throw new Error("ms is required");
    }

    if (!this.options.onTimeout) {
      throw new Error("onTimeout is required");
    }

    let timeoutId: NodeJS.Timeout;

    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(
        () => reject(new Error("__RaceTimeout__")),
        this.options.ms,
      );
    });

    return Promise.race([this.promise, timeout])
      .then((result) => {
        clearTimeout(timeoutId);
        return result;
      })
      .catch((error) => {
        clearTimeout(timeoutId);

        if (error.message === "__RaceTimeout__" && this.options.onTimeout) {
          return this.options.onTimeout();
        }

        if (this.options.onError) {
          return this.options.onError(error);
        }

        throw error;
      });
  }
}

export class Timeout {
  /**
   * Create a new timeout builder.
   * 
   * @example
   * ```ts
   * const result = await Timeout.when(promise)
   *   .ms(1000)
   *   .onTimeout(() => ('fallback timeout'))
   *   .onError(error => ('fallback error'))
   *   .race()
   * ```
   */
  public static when<T>(promise: Promise<T>) {
    return new TimeoutBuilder(promise);
  }
}
