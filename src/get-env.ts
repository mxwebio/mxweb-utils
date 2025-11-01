/**
 * Polyfill interface for the Node.js process object to ensure type safety
 * in environments where process may not be available.
 *
 * @since 0.0.1
 */
interface PolyfillProcess {
  env: {
    NODE_ENV: "development" | "production" | "test" | string;
    [key: string]: string | undefined;
  };
}

/**
 * Internal process object that provides environment variables access.
 * Falls back to a polyfill with production defaults if process is undefined (browser environment).
 *
 * @since 0.0.1
 */
let _process: PolyfillProcess = process as unknown as PolyfillProcess;

if (typeof process === "undefined") {
  _process = {
    env: {
      NODE_ENV: "production",
    },
  };
}

/**
 * Gets an environment variable with automatic framework prefix detection.
 *
 * This function retrieves environment variables with support for multiple JavaScript framework
 * naming conventions. It automatically tries common prefixes used by popular frameworks
 * (React, Next.js, Vite, Nuxt, Gatsby, etc.) in addition to the raw key name.
 *
 * The function searches for environment variables in the following order:
 * 1. Original key (e.g., "API_URL")
 * 2. REACT_{key}
 * 3. REACT_APP_{key}
 * 4. NEXT_PUBLIC_{key}
 * 5. VITE_{key}
 * 6. PUBLIC_{key}
 * 7. NUXT_PUBLIC_{key}
 * 8. GATSBY_{key}
 * 9. SNOWPACK_PUBLIC_{key}
 * 10. ASTRO_PUBLIC_{key}
 *
 * All keys are converted to uppercase before lookup. Works in both Node.js and browser
 * environments (returns production defaults in browser if process is undefined).
 *
 * @template T - The type of the environment variable value
 * @param key - The environment variable key to search for (case-insensitive, will be uppercased)
 * @param defaultValue - The default value to return if the environment variable is not found.
 *                       If not provided, returns undefined when variable is missing.
 * @returns The environment variable value if found, otherwise the defaultValue.
 *          Return type is strictly typed based on whether defaultValue is provided.
 *
 * @example
 * ```typescript
 * // Basic usage (returns string | undefined)
 * const apiUrl = getEnv('API_URL');
 *
 * // With default value (returns string)
 * const apiUrl = getEnv('API_URL', 'https://default-api.com');
 *
 * // Typed with generic
 * const port = getEnv<number>('PORT', 3000);
 *
 * // Framework-specific examples:
 * // In React: looks for REACT_APP_API_URL
 * const reactApiUrl = getEnv('API_URL'); // Finds REACT_APP_API_URL
 *
 * // In Next.js: looks for NEXT_PUBLIC_API_URL
 * const nextApiUrl = getEnv('API_URL'); // Finds NEXT_PUBLIC_API_URL
 *
 * // In Vite: looks for VITE_API_URL
 * const viteApiUrl = getEnv('API_URL'); // Finds VITE_API_URL
 *
 * // Case insensitive (all converted to uppercase)
 * getEnv('api_url'); // Looks for API_URL, REACT_APP_API_URL, etc.
 * getEnv('Api_Url'); // Same as above
 *
 * // Empty key returns default
 * getEnv('', 'fallback'); // Returns: 'fallback'
 *
 * // Practical usage
 * const config = {
 *   apiUrl: getEnv('API_URL', 'http://localhost:3000'),
 *   apiKey: getEnv('API_KEY', ''),
 *   environment: getEnv('NODE_ENV', 'development'),
 *   debug: getEnv('DEBUG', 'false') === 'true',
 * };
 * ```
 *
 * @since 0.0.1
 */
export function getEnv<T>(
  key: string,
  defaultValue?: T
): typeof defaultValue extends undefined ? undefined : T {
  type Result = typeof defaultValue extends undefined ? T | undefined : T;

  if (!key) {
    return defaultValue as Result;
  }

  const allKeys = [
    key,
    `REACT_${key}`,
    `REACT_APP_${key}`,
    `NEXT_PUBLIC_${key}`,
    `VITE_${key}`,
    `PUBLIC_${key}`,
    `NUXT_PUBLIC_${key}`,
    `GATSBY_${key}`,
    `SNOWPACK_PUBLIC_${key}`,
    `ASTRO_PUBLIC_${key}`,
  ];

  for (const k of allKeys) {
    const upperKey = k.toUpperCase();

    if (upperKey in _process.env) {
      return _process.env[upperKey] as unknown as Result;
    }
  }

  return defaultValue as Result;
}
