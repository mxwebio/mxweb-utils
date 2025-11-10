/**
 * Extracts the value from a settled Promise result.
 *
 * This utility function safely extracts the value from a `PromiseSettledResult`,
 * returning the fulfilled value if the promise succeeded, or a fallback value
 * if it was rejected.
 *
 * @template T - The type of the fulfilled value
 * @param {PromiseSettledResult<T>} settled - The settled promise result from Promise.allSettled()
 * @param {T | null} [fallback=null] - The fallback value to return if the promise was rejected
 * @returns {T | null} The fulfilled value or the fallback value
 *
 * @example
 * ```typescript
 * const results = await Promise.allSettled([
 *   Promise.resolve(42),
 *   Promise.reject(new Error("Failed"))
 * ]);
 *
 * const value1 = getSettledValue(results[0], 0); // 42
 * const value2 = getSettledValue(results[1], 0); // 0
 * ```
 *
 * @example
 * ```typescript
 * // With custom fallback
 * const result = await Promise.allSettled([fetchUser()]);
 * const user = getSettledValue(result[0], { id: 0, name: "Guest" });
 * ```
 *
 * @example
 * ```typescript
 * // Processing multiple results
 * const promises = [fetch("/api/1"), fetch("/api/2"), fetch("/api/3")];
 * const results = await Promise.allSettled(promises);
 * const values = results.map(result => getSettledValue(result, null));
 * // values contains successful responses and null for failed requests
 * ```
 *
 * @since 0.0.3
 */
export function getSettledValue<T>(
  settled: PromiseSettledResult<T>,
  fallback: T | null = null
): T | null {
  if (settled.status === "fulfilled") {
    return settled.value as T;
  }

  return fallback;
}
