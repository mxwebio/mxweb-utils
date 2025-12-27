/**
 * Checks if a value is null or undefined (nullish).
 *
 * This is a type guard function that narrows the type of the value
 * to `null | undefined` when it returns true, providing better
 * TypeScript type inference in conditional blocks.
 *
 * @param {unknown} value - The value to check
 * @returns {boolean} True if the value is null or undefined, false otherwise
 *
 * @example
 * ```typescript
 * // Basic usage
 * isNullish(null); // true
 * isNullish(undefined); // true
 * isNullish(0); // false
 * isNullish(""); // false
 * isNullish(false); // false
 * ```
 *
 * @example
 * ```typescript
 * // Type guard usage
 * function processValue(value: string | null | undefined) {
 *   if (isNullish(value)) {
 *     // TypeScript knows value is null | undefined here
 *     return "No value provided";
 *   }
 *   // TypeScript knows value is string here
 *   return value.toUpperCase();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Filtering nullish values from array
 * const values = [1, null, 2, undefined, 3];
 * const filtered = values.filter((v) => !isNullish(v));
 * // filtered: number[] = [1, 2, 3]
 * ```
 *
 * @example
 * ```typescript
 * // With optional chaining alternative
 * const user = { name: "John", email: null };
 *
 * if (!isNullish(user.email)) {
 *   // Safe to use user.email as string
 *   sendEmail(user.email);
 * }
 * ```
 *
 * @since 0.0.5
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
