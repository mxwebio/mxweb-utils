import { ObjectOf } from "./types";

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
 *
 * @since 0.0.1
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
 *
 * @since 0.0.1
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
 *
 * @since 0.0.1
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

/**
 * Converts flattened data back into array structure based on a specific path.
 *
 * This utility function reconstructs arrays from flattened object data. It can handle
 * both array structures (with indexed keys like `[0]`, `[1]`) and regular object
 * properties, returning them in different formats accordingly.
 *
 * @param data - The flattened data object containing dot-notation keys
 * @param path - The path prefix to extract and convert to array structure
 *
 * @returns An array containing either:
 *   - For array data: Objects reconstructed from indexed entries
 *   - For object data: Array of `{key, value}` pairs
 *   - Empty array if no matching paths found
 *
 * @example
 * ```typescript
 * // Flattened array data
 * const flatData = {
 *   "users.[0].name": "John",
 *   "users.[0].age": 30,
 *   "users.[1].name": "Jane",
 *   "users.[1].age": 25,
 *   "config.theme": "dark",
 *   "config.language": "en"
 * };
 *
 * // Extract array structure
 * flattenToArray(flatData, "users");
 * // Returns: [
 * //   { "name": "John", "age": 30 },
 * //   { "name": "Jane", "age": 25 }
 * // ]
 *
 * // Extract object structure as key-value pairs
 * flattenToArray(flatData, "config");
 * // Returns: [
 * //   { key: "theme", value: "dark" },
 * //   { key: "language", value: "en" }
 * // ]
 *
 * // No matching path
 * flattenToArray(flatData, "nonexistent");
 * // Returns: []
 * ```
 *
 * @example
 * ```typescript
 * // Complex nested array example
 * const complexData = {
 *   "items.[0].tags.[0]": "frontend",
 *   "items.[0].tags.[1]": "react",
 *   "items.[0].name": "Component Library",
 *   "items.[1].tags.[0]": "backend",
 *   "items.[1].name": "API Server"
 * };
 *
 * flattenToArray(complexData, "items");
 * // Returns: [
 * //   { "tags.[0]": "frontend", "tags.[1]": "react", "name": "Component Library" },
 * //   { "tags.[0]": "backend", "name": "API Server" }
 * // ]
 * ```
 *
 * @see {@link flatten} for the inverse operation (converting objects/arrays to flattened structure)
 * @see {@link flattenArray} for flattening arrays specifically
 * @see {@link flattenObject} for flattening objects specifically
 *
 * @since 0.0.2
 */
export function flattenToArray(data: Record<string, unknown>, path: string) {
  let isArray = false;

  const dataOfPath = Object.entries(data).filter(([key]) => {
    if (key.startsWith(`${path}.`)) {
      isArray = key.startsWith(`${path}.[`);
    }
    return key.startsWith(`${path}.`);
  });

  if (!dataOfPath.length) {
    return [];
  }

  if (!isArray) {
    return dataOfPath.map(([key, value]) => ({
      key: key.replace(`${path}.`, ""),
      value,
    }));
  }

  return Object.values(
    dataOfPath.reduce(
      (acc, [key, value]) => {
        const [index, ...remain] = key.replace(`${path}.[`, "").split("].");

        if (!acc[index as string]) {
          acc[index as string] = {};
        }

        acc[index as string]![remain.join("].")] = value;
        return acc;
      },
      {} as ObjectOf<Record<string, unknown>>
    )
  );
}

/**
 * Escapes special regex characters in strings for safe use in RegExp constructor.
 *
 * This utility function escapes characters that have special meaning in regular
 * expressions (dots, brackets, braces) by prefixing them with backslashes.
 * This allows strings containing these characters to be used safely in RegExp
 * patterns as literal characters rather than regex metacharacters.
 *
 * @param key - The string to escape for regex use
 *
 * @returns The escaped string with regex metacharacters properly escaped
 *
 * @example
 * ```typescript
 * // Escape dots for regex
 * escapeRegexKey("user.name");
 * // Returns: "user\.name"
 *
 * // Use in RegExp constructor
 * const pattern = new RegExp(`^${escapeRegexKey("data[0]")}$`);
 * // Creates: /^data\[0\]$/ - matches literal "data[0]"
 *
 * // Escape brackets and braces
 * escapeRegexKey("config{env}");
 * // Returns: "config\{env\}"
 *
 * // Complex string with multiple metacharacters
 * escapeRegexKey("path.to[item].{key}");
 * // Returns: "path\.to\[item\]\.\{key\}"
 *
 * // Normal strings unchanged
 * escapeRegexKey("normalKey");
 * // Returns: "normalKey"
 *
 * // Practical usage in pattern matching
 * const keyToFind = "user.settings[theme]";
 * const regex = new RegExp(`^${escapeRegexKey(keyToFind)}$`);
 * regex.test("user.settings[theme]"); // true
 * regex.test("user_settings_theme"); // false
 * ```
 *
 * @since 0.0.2
 */
export function escapeRegexKey(key: string) {
  return key.replace(/([.[\]{}])/g, "\\$1");
}
