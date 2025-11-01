import { sleep } from "./sleep";
import { AsyncCallback, Callback } from "./types";

/**
 * Configuration options for the RateLimiter class.
 *
 * @since 0.0.2
 * @interface RateLimitOptions
 */
export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the specified interval.
   * @default 1
   */
  maxRequests?: number;

  /**
   * Time interval in milliseconds for the rate limit window.
   * @default 1500
   */
  interval?: number;
}

/**
 * A rate limiter that controls the frequency of function execution.
 * Ensures that callbacks are executed within specified rate limits by queueing
 * requests and enforcing delays between executions.
 *
 * @since 0.0.2
 * @class RateLimiter
 * @example
 * ```typescript
 * import { RateLimiter } from "@mxweb/utils";
 *
 * // Create a rate limiter allowing 5 requests per 1000ms
 * const rateLimiter = new RateLimiter({
 *   maxRequests: 5,
 *   interval: 1000
 * });
 *
 * // Execute rate-limited requests
 * for (let i = 0; i < 10; i++) {
 *   rateLimiter.handle(async () => {
 *     console.log(`Request ${i + 1}`);
 *     return fetch(`/api/data/${i}`);
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Rate limit API calls
 * const apiLimiter = new RateLimiter({ maxRequests: 3, interval: 2000 });
 *
 * const results = await Promise.all([
 *   apiLimiter.handle(() => fetch('/api/users')),
 *   apiLimiter.handle(() => fetch('/api/posts')),
 *   apiLimiter.handle(() => fetch('/api/comments')),
 *   apiLimiter.handle(() => fetch('/api/likes')) // Will wait for rate limit
 * ]);
 * ```
 */
export class RateLimiter {
  /**
   * Default delay between requests in milliseconds.
   * @static
   * @readonly
   * @default 1500
   */
  static DEFAULT_DELAY = 1500;

  /**
   * Default maximum number of requests per interval.
   * @static
   * @readonly
   * @default 1
   */
  static DEFAULT_MAX_REQUESTS = 1;

  /**
   * Queue of pending callbacks waiting to be executed.
   * @private
   */
  private queues: Array<Callback<unknown> | AsyncCallback<unknown>> = [];

  /**
   * Array of timestamps for recent requests, used for rate limit calculation.
   * @private
   */
  private requestTimes: number[] = [];

  /**
   * Flag indicating whether the queue is currently being processed.
   * @private
   */
  private executing = false;

  /**
   * Creates a new RateLimiter instance.
   *
   * @param options - Configuration options for rate limiting
   * @param options.maxRequests - Maximum requests allowed per interval (default: 1)
   * @param options.interval - Time interval in milliseconds (default: 1500)
   *
   * @example
   * ```typescript
   * // Basic rate limiter
   * const limiter = new RateLimiter({ maxRequests: 10, interval: 1000 });
   *
   * // Strict rate limiter
   * const strictLimiter = new RateLimiter({ maxRequests: 1, interval: 2000 });
   * ```
   */
  constructor(private options: RateLimitOptions) {}

  /**
   * Waits for an available slot within the rate limit window.
   * Calculates necessary delay based on previous request times and enforces rate limits.
   *
   * @private
   * @returns Promise that resolves when a slot becomes available
   */
  private async waitForSlot() {
    const now = Date.now();
    const interval = this.options.interval || RateLimiter.DEFAULT_DELAY;
    const maxRequests = this.options.maxRequests || RateLimiter.DEFAULT_MAX_REQUESTS;

    this.requestTimes = this.requestTimes.filter((time) => time > now - interval);

    if (this.requestTimes.length >= maxRequests) {
      const oldRequestTime = this.requestTimes[0]!;
      const delay = oldRequestTime + interval - now;
      await sleep(delay);
    }

    this.requestTimes.push(now);
  }

  /**
   * Processes the queue of pending callbacks.
   * Ensures only one queue processing operation runs at a time.
   *
   * @private
   * @returns Promise that resolves when all queued callbacks are processed
   */
  private async queue() {
    if (this.executing) {
      return;
    }

    this.executing = true;

    while (this.queues.length) {
      const callback = this.queues.shift()!;
      callback && (await callback());
    }

    this.executing = false;
  }

  /**
   * Updates the rate limiter options.
   * Changes take effect for subsequent requests.
   *
   * @param options - New configuration options
   * @param options.maxRequests - Maximum requests allowed per interval
   * @param options.interval - Time interval in milliseconds
   * @returns The RateLimiter instance for method chaining
   *
   * @example
   * ```typescript
   * const limiter = new RateLimiter({ maxRequests: 5, interval: 1000 });
   *
   * // Update to more restrictive limits
   * limiter.setOptions({ maxRequests: 2, interval: 2000 });
   *
   * // Method chaining
   * limiter.setOptions({ maxRequests: 10, interval: 500 })
   *       .handle(() => fetch('/api/data'));
   * ```
   */
  setOptions(options: RateLimitOptions) {
    this.options = options;
    return this;
  }

  /**
   * Executes a callback function with rate limiting.
   * The callback is queued and executed when rate limits allow.
   *
   * @template T - The return type of the callback function
   * @param callback - The function to execute with rate limiting
   * @returns Promise that resolves with the callback's return value
   *
   * @example
   * ```typescript
   * const limiter = new RateLimiter({ maxRequests: 3, interval: 1000 });
   *
   * // Rate-limited API call
   * const userData = await limiter.handle(async () => {
   *   const response = await fetch('/api/user/123');
   *   return response.json();
   * });
   *
   * // Rate-limited with error handling
   * try {
   *   const result = await limiter.handle(() => {
   *     return performExpensiveOperation();
   *   });
   *   console.log(result);
   * } catch (error) {
   *   console.error('Rate-limited operation failed:', error);
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Batch processing with rate limiting
   * const limiter = new RateLimiter({ maxRequests: 5, interval: 2000 });
   * const urls = ['/api/1', '/api/2', '/api/3', '/api/4', '/api/5', '/api/6'];
   *
   * const results = await Promise.all(
   *   urls.map(url => limiter.handle(() => fetch(url)))
   * );
   * ```
   */
  async handle<T>(callback: Callback<T>) {
    return new Promise((resolve, reject) => {
      this.queues.push(async () => {
        try {
          await this.waitForSlot();
          const result = await callback();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.queue();
    });
  }
}
