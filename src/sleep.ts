/**
 * Pauses execution for a specified duration using a Promise-based delay.
 *
 * This function returns a Promise that resolves after the specified number of milliseconds,
 * making it useful for introducing delays in async operations. Negative values are treated as 0.
 *
 * @param ms - The number of milliseconds to sleep. Negative values will be clamped to 0.
 * @returns A Promise that resolves after the specified delay
 *
 * @example
 * ```typescript
 * // Pause for 1 second
 * await sleep(1000);
 * console.log('1 second has passed');
 *
 * // Use in async function
 * async function processWithDelay() {
 *   console.log('Starting...');
 *   await sleep(2000);
 *   console.log('After 2 seconds');
 * }
 *
 * // Retry with delay
 * async function retryWithDelay(fn: () => Promise<any>, attempts = 3) {
 *   for (let i = 0; i < attempts; i++) {
 *     try {
 *       return await fn();
 *     } catch (error) {
 *       if (i < attempts - 1) await sleep(1000);
 *     }
 *   }
 * }
 * ```
 *
 * @since 0.0.1
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(ms, 0)));
}
