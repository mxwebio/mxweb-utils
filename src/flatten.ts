/**
 * Flattens an array into a single-level object with dot-notated keys.
 *
 * This function converts a nested array structure into a flat object where keys
 * represent the path to each value using dot notation with array indices.
 *
 * @param data - The array to flatten
 * @returns A flattened object with dot-notated keys representing array indices and nested paths
 *
 * @example
 * ```typescript
 * // Simple array
 * flattenArray([1, 2, 3]);
 * // Returns: { "0": 1, "1": 2, "2": 3 }
 *
 * // Nested array with objects
 * flattenArray([{ name: 'John' }, { name: 'Jane' }]);
 * // Returns: { "0.name": "John", "1.name": "Jane" }
 *
 * // Mixed nested structure
 * flattenArray([1, { value: 2 }, [3, 4]]);
 * // Returns: { "0": 1, "1.value": 2, "2.0": 3, "2.1": 4 }
 * ```
 */
export function flattenArray(data: Array<unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  data.forEach((value, index) => {
    if (typeof value === "object" && value !== null) {
      const resultItem = flatten(value as Record<string, unknown> | Array<unknown>);

      Object.entries(resultItem).forEach(([subKey, subValue]) => {
        result[`${index}.${subKey}`] = subValue;
      });
    } else {
      result[`${index}`] = value;
    }
  });

  return result;
}

/**
 * Flattens an object into a single-level object with dot-notated keys.
 *
 * This function converts a nested object structure into a flat object where keys
 * represent the path to each value using dot notation.
 *
 * @param data - The object to flatten
 * @returns A flattened object with dot-notated keys representing the path to each value
 *
 * @example
 * ```typescript
 * // Simple nested object
 * flattenObject({ user: { name: 'John', age: 30 } });
 * // Returns: { "user.name": "John", "user.age": 30 }
 *
 * // Deeply nested object
 * flattenObject({
 *   user: {
 *     profile: {
 *       name: 'John',
 *       address: { city: 'NYC' }
 *     }
 *   }
 * });
 * // Returns: { "user.profile.name": "John", "user.profile.address.city": "NYC" }
 *
 * // Mixed with arrays
 * flattenObject({ users: [{ name: 'John' }, { name: 'Jane' }] });
 * // Returns: { "users.0.name": "John", "users.1.name": "Jane" }
 * ```
 */
export function flattenObject(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== "object") {
    return data as Record<string, unknown>;
  }

  const result: Record<string, unknown> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      const resultItem = flatten(value as Record<string, unknown> | Array<unknown>);

      Object.entries(resultItem).forEach(([subKey, subValue]) => {
        result[`${key}.${subKey}`] = subValue;
      });
    } else {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Flattens a nested object or array into a single-level object with dot-notated keys.
 *
 * This is the main flatten function that automatically detects whether the input is an
 * object or array and delegates to the appropriate flattening function. It recursively
 * flattens all nested structures into a flat object where keys use dot notation to
 * represent the path to each value.
 *
 * @param data - The object or array to flatten
 * @returns A flattened object with dot-notated keys, or the original data if it's not an object/array
 *
 * @example
 * ```typescript
 * // Flatten a nested object
 * flatten({
 *   user: {
 *     name: 'John',
 *     contacts: { email: 'john@example.com' }
 *   }
 * });
 * // Returns: { "user.name": "John", "user.contacts.email": "john@example.com" }
 *
 * // Flatten an array
 * flatten([1, 2, { value: 3 }]);
 * // Returns: { "0": 1, "1": 2, "2.value": 3 }
 *
 * // Complex nested structure
 * flatten({
 *   items: [
 *     { id: 1, data: { name: 'Item 1' } },
 *     { id: 2, data: { name: 'Item 2' } }
 *   ],
 *   meta: { count: 2 }
 * });
 * // Returns: {
 * //   "items.0.id": 1,
 * //   "items.0.data.name": "Item 1",
 * //   "items.1.id": 2,
 * //   "items.1.data.name": "Item 2",
 * //   "meta.count": 2
 * // }
 *
 * // Non-object input (returned as-is)
 * flatten("string"); // Returns: "string"
 * flatten(null); // Returns: null
 * ```
 */
export function flatten(data: Record<string, unknown> | Array<unknown>): Record<string, unknown> {
  if (typeof data !== "object" || data === null) {
    return data as Record<string, unknown>;
  }

  if (Array.isArray(data)) {
    return flattenArray(data);
  }

  return flattenObject(data);
}
