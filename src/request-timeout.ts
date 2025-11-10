/**
 * Type alias for the return value of setTimeout.
 *
 * Represents a timeout identifier that can be used with clearTimeout.
 *
 * @since 0.0.3
 */
export type Timeout = ReturnType<typeof setTimeout>;

/**
 * Return value from the requestTimeout function.
 *
 * Contains timeout identifiers and a cancel method to stop the scheduled callback.
 *
 * @property {number | null} rid - RequestAnimationFrame ID (if available)
 * @property {Timeout | null} sid - setTimeout ID
 * @property {() => void} cancel - Function to cancel the scheduled timeout
 *
 * @since 0.0.3
 */
export interface RequestTimeoutReturn {
  rid: number | null;
  sid: Timeout | null;
  cancel: () => void;
}

/**
 * Schedules a callback to run after a specified delay using requestAnimationFrame when available.
 *
 * This function provides a more efficient alternative to setTimeout by leveraging
 * requestAnimationFrame for better performance and timing accuracy in browser environments.
 * Falls back to setTimeout when requestAnimationFrame is not available (e.g., Node.js).
 *
 * @param {() => void | Promise<void>} callback - The function to execute after the delay
 * @param {number} [ms] - Delay in milliseconds (default: 0, minimum: 0)
 * @returns {RequestTimeoutReturn} Object containing timeout IDs and a cancel method
 *
 * @example
 * ```typescript
 * // Basic usage
 * const timeout = requestTimeout(() => {
 *   console.log("Executed after 1 second");
 * }, 1000);
 * ```
 *
 * @example
 * ```typescript
 * // Cancel before execution
 * const timeout = requestTimeout(() => {
 *   console.log("This won't be executed");
 * }, 2000);
 *
 * timeout.cancel(); // Cancel the timeout
 * ```
 *
 * @example
 * ```typescript
 * // With async callback
 * const timeout = requestTimeout(async () => {
 *   const data = await fetchData();
 *   console.log(data);
 * }, 500);
 * ```
 *
 * @example
 * ```typescript
 * // Immediate execution (0ms delay)
 * const timeout = requestTimeout(() => {
 *   console.log("Executed on next frame");
 * });
 *
 * // Later cancel if needed
 * if (shouldCancel) {
 *   timeout.cancel();
 * }
 * ```
 *
 * @since 0.0.3
 */
export function requestTimeout(callback: () => void | Promise<void>, ms?: number) {
  const timeout = Math.max(ms ?? 0, 0);

  const rs: RequestTimeoutReturn = {
    rid: null,
    sid: null,
    cancel: () => {
      if (rs.rid !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rs.rid);
      }

      if (rs.sid !== null) {
        clearTimeout(rs.sid);
      }
    },
  };

  function fn() {
    callback();
    rs.cancel();
  }

  if (typeof requestAnimationFrame === "function") {
    rs.rid = requestAnimationFrame(() => {
      rs.sid = setTimeout(fn, timeout);
    });
  } else {
    rs.sid = setTimeout(fn, timeout);
  }

  return rs;
}
