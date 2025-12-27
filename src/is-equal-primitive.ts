/**
 * Performs a deep equality comparison between two values.
 *
 * This function recursively compares primitive values, arrays, and plain objects
 * to determine if they are structurally and value-equal. It handles nested
 * structures and supports all primitive types including null and undefined.
 *
 * @param {unknown} val1 - The first value to compare
 * @param {unknown} val2 - The second value to compare
 * @returns {boolean} True if values are deeply equal, false otherwise
 *
 * @example
 * ```typescript
 * // Primitive comparison
 * isEqualPrimitive(1, 1); // true
 * isEqualPrimitive("hello", "hello"); // true
 * isEqualPrimitive(null, null); // true
 * isEqualPrimitive(1, "1"); // false (different types)
 * ```
 *
 * @example
 * ```typescript
 * // Array comparison
 * isEqualPrimitive([1, 2, 3], [1, 2, 3]); // true
 * isEqualPrimitive([1, [2, 3]], [1, [2, 3]]); // true (nested arrays)
 * isEqualPrimitive([1, 2], [1, 2, 3]); // false (different length)
 * isEqualPrimitive([], []); // true (empty arrays)
 * ```
 *
 * @example
 * ```typescript
 * // Object comparison
 * isEqualPrimitive({ a: 1 }, { a: 1 }); // true
 * isEqualPrimitive({ a: { b: 2 } }, { a: { b: 2 } }); // true (nested objects)
 * isEqualPrimitive({ a: 1 }, { a: 1, b: 2 }); // false (different keys)
 * isEqualPrimitive({}, {}); // true (empty objects)
 * ```
 *
 * @example
 * ```typescript
 * // Mixed nested structures
 * const obj1 = { users: [{ name: "John", age: 30 }], active: true };
 * const obj2 = { users: [{ name: "John", age: 30 }], active: true };
 * isEqualPrimitive(obj1, obj2); // true
 *
 * const obj3 = { users: [{ name: "John", age: 31 }], active: true };
 * isEqualPrimitive(obj1, obj3); // false (different nested value)
 * ```
 *
 * @example
 * ```typescript
 * // Edge cases
 * isEqualPrimitive(undefined, undefined); // true
 * isEqualPrimitive(NaN, NaN); // false (NaN !== NaN in JavaScript)
 * isEqualPrimitive(0, -0); // true (0 === -0 in JavaScript)
 * ```
 *
 * @since 0.0.5
 */
export function isEqualPrimitive(val1: unknown, val2: unknown): boolean {
  if (typeof val1 !== typeof val2) {
    return false;
  }

  if (typeof val1 !== "object" || val1 === null || val2 === null) {
    return val1 === val2;
  }

  if (Array.isArray(val1)) {
    if (!Array.isArray(val2) || val1.length !== val2.length) {
      return false;
    }

    if (val1.length === 0) {
      return true;
    }

    for (let index = 0; index < val1.length; index++) {
      if (!isEqualPrimitive(val1[index], (val2 as unknown[])[index])) {
        return false;
      }
    }

    return true;
  }

  const keys1 = Object.keys(val1 as Record<string, unknown>);
  const keys2 = Object.keys(val2 as Record<string, unknown>);

  if (keys1.length !== keys2.length) {
    return false;
  }

  if (keys1.length === 0) {
    return true;
  }

  for (const key of keys1) {
    if (
      !(key in (val2 as Record<string, unknown>)) ||
      !isEqualPrimitive(
        (val1 as Record<string, unknown>)[key],
        (val2 as Record<string, unknown>)[key]
      )
    ) {
      return false;
    }
  }

  return true;
}
