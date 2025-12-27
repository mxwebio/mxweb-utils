/**
 * Returns the internal [[Class]] property of a value as a string.
 *
 * Uses `Object.prototype.toString.call()` to get the accurate type tag
 * of any JavaScript value, which is more reliable than `typeof` for
 * distinguishing between different object types.
 *
 * @param {unknown} value - The value to get the type name of
 * @returns {string} The type tag in format "[object Type]"
 *
 * @example
 * ```typescript
 * // Primitive types
 * getTypeName(null); // "[object Null]"
 * getTypeName(undefined); // "[object Undefined]"
 * getTypeName(42); // "[object Number]"
 * getTypeName("hello"); // "[object String]"
 * getTypeName(true); // "[object Boolean]"
 * getTypeName(Symbol("id")); // "[object Symbol]"
 * getTypeName(BigInt(123)); // "[object BigInt]"
 * ```
 *
 * @example
 * ```typescript
 * // Object types
 * getTypeName({}); // "[object Object]"
 * getTypeName([]); // "[object Array]"
 * getTypeName(new Date()); // "[object Date]"
 * getTypeName(/regex/); // "[object RegExp]"
 * getTypeName(new Map()); // "[object Map]"
 * getTypeName(new Set()); // "[object Set]"
 * getTypeName(new WeakMap()); // "[object WeakMap]"
 * getTypeName(new WeakSet()); // "[object WeakSet]"
 * ```
 *
 * @example
 * ```typescript
 * // Function types
 * getTypeName(function() {}); // "[object Function]"
 * getTypeName(async function() {}); // "[object AsyncFunction]"
 * getTypeName(function*() {}); // "[object GeneratorFunction]"
 * getTypeName(async function*() {}); // "[object AsyncGeneratorFunction]"
 * getTypeName(() => {}); // "[object Function]"
 * ```
 *
 * @example
 * ```typescript
 * // Type checking pattern
 * function isArray(value: unknown): value is unknown[] {
 *   return getTypeName(value) === "[object Array]";
 * }
 *
 * function isPlainObject(value: unknown): boolean {
 *   return getTypeName(value) === "[object Object]";
 * }
 * ```
 *
 * @since 0.0.5
 */
export function getTypeName(value: unknown): string {
  return Object.prototype.toString.call(value);
}
