/**
 * Safely decodes a URI-encoded string with error handling.
 *
 * This function attempts to decode URI-encoded characters in a string. If decoding fails
 * for any component, it returns the original encoded value instead of throwing an error.
 * This prevents crashes from malformed URI components.
 *
 * @param str - The URI-encoded string to decode
 * @param component - Whether to use `decodeURIComponent` (true) or `decodeURI` (false).
 *                    Default is true. Use true for individual URI components (query params, path segments),
 *                    use false for complete URIs.
 * @returns The decoded string, or the original encoded value if decoding fails. Returns empty string if input is null/undefined.
 *
 * @example
 * ```typescript
 * // Decode a URI component
 * decodeURISafe('Hello%20World'); // Returns: "Hello World"
 *
 * // Handle malformed encoding gracefully
 * decodeURISafe('Hello%2World'); // Returns: "Hello%2World" (invalid encoding preserved)
 *
 * // Decode a full URI
 * decodeURISafe('https://example.com/path%20with%20spaces', false);
 * ```
 *
 * @since 0.0.1
 */
export function decodeURISafe(str: string, component = true): string {
  const handle = component ? decodeURIComponent : decodeURI;
  return (
    str?.replace(/(%[0-9A-F]{2})/gi, (match) => {
      try {
        return handle(match);
      } catch {
        console.warn(`Failed to decode component: ${match}`);
        return match;
      }
    }) ?? ""
  );
}

/**
 * Encodes a string to be safely used in a URI.
 *
 * This function encodes special characters in a string to make it safe for use in URIs.
 * It escapes characters that have special meaning in URIs, replacing them with percent-encoded values.
 *
 * @param str - The string to encode
 * @param component - Whether to use `encodeURIComponent` (true) or `encodeURI` (false).
 *                    Default is true. Use true for individual URI components (query params, path segments),
 *                    use false for complete URIs (preserves URI structure characters like :, /, ?, #).
 * @returns The URI-encoded string
 *
 * @example
 * ```typescript
 * // Encode a URI component (escapes all special characters)
 * encodeURISafe('Hello World'); // Returns: "Hello%20World"
 * encodeURISafe('name=value&other=data'); // Returns: "name%3Dvalue%26other%3Ddata"
 *
 * // Encode a full URI (preserves URI structure)
 * encodeURISafe('https://example.com/path with spaces', false);
 * // Returns: "https://example.com/path%20with%20spaces"
 * ```
 *
 * @since 0.0.1
 */
export function encodeURISafe(str: string, component = true): string {
  const handle = component ? encodeURIComponent : encodeURI;
  return handle(str);
}
