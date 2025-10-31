/**
 * Converts a PascalCase or camelCase string to kebab-case.
 *
 * This function transforms strings by inserting hyphens before capital letters
 * and converting all characters to lowercase. It handles both PascalCase and
 * camelCase inputs, as well as consecutive capital letters (acronyms).
 *
 * @param str - The PascalCase or camelCase string to convert
 * @returns The kebab-case formatted string, or the original string if empty/null
 *
 * @example
 * ```typescript
 * // Basic PascalCase conversion
 * pascalToKebab('PascalCase'); // Returns: "pascal-case"
 *
 * // camelCase conversion
 * pascalToKebab('camelCase'); // Returns: "camel-case"
 *
 * // Handling acronyms
 * pascalToKebab('XMLHttpRequest'); // Returns: "xml-http-request"
 * pascalToKebab('HTMLElement'); // Returns: "html-element"
 *
 * // Multiple words
 * pascalToKebab('MyComponentName'); // Returns: "my-component-name"
 *
 * // With numbers
 * pascalToKebab('Item123Value'); // Returns: "item123-value"
 *
 * // Empty or null handling
 * pascalToKebab(''); // Returns: ""
 * pascalToKebab(null); // Returns: null
 * ```
 */
export function pascalToKebab(str: string): string {
  if (!str) {
    return str;
  }

  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}
