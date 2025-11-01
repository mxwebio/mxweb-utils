import { sleep } from "./sleep";
import { AsyncCallback, Callback } from "./types";

/**
 * Configuration options for retry operations.
 *
 * @interface RetryOptions
 * @since 0.0.2
 */
export interface RetryOptions {
  /** Maximum number of retry attempts. Defaults to 1 if not specified. */
  maxRetries?: number;
  /** Delay between retry attempts in milliseconds. Defaults to 1500ms if not specified. */
  delay?: number;
}

/**
 * A utility class for executing functions with automatic retry logic and configurable delays.
 *
 * Provides a robust way to handle transient failures by automatically retrying failed operations
 * with customizable delay intervals and maximum retry attempts.
 *
 * @example
 * ```typescript
 * // Basic retry with default options (1 retry, 1500ms delay)
 * const retry = new Retry();
 * const result = await retry.execute(() => fetchData());
 *
 * // Custom retry configuration
 * const retry = new Retry({ maxRetries: 3, delay: 1000 });
 * const result = await retry.execute(async () => {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw new Error('Request failed');
 *   return response.json();
 * });
 *
 * // Modify options after creation
 * retry.setOptions({ maxRetries: 5, delay: 2000 });
 * ```
 *
 * @class Retry
 * @since 0.0.2
 */
export class Retry {
  /** Default delay between retry attempts in milliseconds. */
  static DEFAULT_DELAY = 1500;

  /**
   * Creates a new Retry instance with the specified options.
   *
   * @param options - Configuration options for retry behavior
   */
  constructor(private options: RetryOptions = {}) {}

  /**
   * Updates the retry configuration options.
   *
   * @param options - New configuration options to apply
   * @returns The Retry instance for method chaining
   *
   * @example
   * ```typescript
   * const retry = new Retry();
   * retry.setOptions({ maxRetries: 5, delay: 2000 });
   *
   * // Method chaining
   * const result = await retry
   *   .setOptions({ maxRetries: 3 })
   *   .execute(() => fetchData());
   * ```
   */
  setOptions(options: RetryOptions) {
    this.options = options;
    return this;
  }

  /**
   * Executes a function with automatic retry logic on failure.
   *
   * Attempts to execute the provided callback function. If it fails, automatically
   * retries up to the maximum number of attempts with the configured delay between attempts.
   *
   * @template T - The return type of the callback function
   * @param callback - The function to execute with retry logic (can be sync or async)
   * @returns A Promise that resolves to the callback's return value
   * @throws {Error} When maximum retries are reached, throws an error with retry details
   *
   * @example
   * ```typescript
   * // Retry a network request
   * const retry = new Retry({ maxRetries: 3, delay: 1000 });
   *
   * const data = await retry.execute(async () => {
   *   const response = await fetch('/api/data');
   *   if (!response.ok) {
   *     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
   *   }
   *   return response.json();
   * });
   *
   * // Retry a synchronous operation
   * const result = await retry.execute(() => {
   *   if (Math.random() < 0.7) throw new Error('Random failure');
   *   return 'Success!';
   * });
   *
   * // Database operation with retry
   * const user = await retry.execute(async () => {
   *   return await database.users.findById(userId);
   * });
   * ```
   */
  async execute<T>(callback: Callback<T> | AsyncCallback<T>): Promise<T> {
    let lastError: unknown;
    const delay = this.options.delay || Retry.DEFAULT_DELAY;
    const maxRetries = this.options.maxRetries || 1;

    for (let attemp = 1; attemp <= maxRetries; attemp++) {
      try {
        return await callback();
      } catch (error) {
        lastError = error;

        if (attemp === maxRetries) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`| Mailer Retry > Max retries reached (${maxRetries}): ${errorMessage}`);
        }

        await sleep(delay);
      }
    }

    throw lastError;
  }
}
