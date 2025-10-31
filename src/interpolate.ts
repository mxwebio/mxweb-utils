import { flatten } from "./flatten";

/**
 * Interpolates a template string by replacing placeholders with values from an object or array.
 *
 * This function replaces placeholders in the format `{key}` with corresponding values from the
 * provided parameters. It supports dot notation for nested properties and automatically flattens
 * the parameters object/array. Placeholders without matching values are replaced with empty strings.
 *
 * @param pattern - The template string containing placeholders in the format `{key}` or `{path.to.key}`
 * @param params - An object or array containing values to interpolate. Defaults to an empty object.
 *                 Nested structures are supported through dot notation.
 * @returns The interpolated string with placeholders replaced by their corresponding values,
 *          or the original pattern if it's invalid or contains no placeholders
 *
 * @example
 * ```typescript
 * // Basic interpolation
 * interpolate('Hello {name}!', { name: 'John' });
 * // Returns: "Hello John!"
 *
 * // Nested object with dot notation
 * interpolate('User: {user.name}, Age: {user.age}', {
 *   user: { name: 'John', age: 30 }
 * });
 * // Returns: "User: John, Age: 30"
 *
 * // Array interpolation
 * interpolate('First: {0}, Second: {1}', ['Apple', 'Banana']);
 * // Returns: "First: Apple, Second: Banana"
 *
 * // Complex nested structure
 * interpolate('Email: {users.0.contact.email}', {
 *   users: [{ contact: { email: 'john@example.com' } }]
 * });
 * // Returns: "Email: john@example.com"
 *
 * // Missing values (replaced with empty string)
 * interpolate('Hello {name} {surname}!', { name: 'John' });
 * // Returns: "Hello John !"
 *
 * // No placeholders (returned as-is)
 * interpolate('Plain text', { name: 'John' });
 * // Returns: "Plain text"
 *
 * // URL/path interpolation
 * interpolate('/api/users/{userId}/posts/{postId}', {
 *   userId: 123,
 *   postId: 456
 * });
 * // Returns: "/api/users/123/posts/456"
 * ```
 */
export function interpolate(
  pattern: string,
  params: Record<string, unknown> | Array<unknown> = {}
) {
  if (
    !pattern ||
    typeof pattern !== "string" ||
    !pattern.trim().length ||
    !pattern.includes("{") ||
    !pattern.includes("}")
  ) {
    return pattern;
  }

  const flatParams = flatten(params);

  return pattern.replace(/\{[a-zA-Z-_0-9.]+\}/g, (match) => {
    const variable = match.replace("{", "").replace("}", "");
    return `${flatParams[variable] ?? ""}`;
  });
}
