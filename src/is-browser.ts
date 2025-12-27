import { hasOwnProperty } from "./has-own-property";

/**
 * Checks if the current environment is a browser.
 *
 * This function detects browser environments by checking for the existence
 * of the `window` object and ensuring it has a `document` property. This is
 * useful for conditional code execution in isomorphic/universal applications
 * that run on both server (Node.js) and client (browser) environments.
 *
 * @returns {boolean} True if running in a browser environment, false otherwise
 *
 * @example
 * ```typescript
 * // Conditional browser-only code
 * if (isBrowser()) {
 *   // Safe to use browser APIs
 *   document.addEventListener("click", handleClick);
 *   localStorage.setItem("key", "value");
 * }
 * ```
 *
 * @example
 * ```typescript
 * // SSR/SSG safe initialization
 * function initializeApp() {
 *   if (isBrowser()) {
 *     // Client-side only initialization
 *     window.analytics?.initialize();
 *   } else {
 *     // Server-side initialization
 *     console.log("Running on server");
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Creating isomorphic utilities
 * const storage = {
 *   get: (key: string) => {
 *     if (!isBrowser()) return null;
 *     return localStorage.getItem(key);
 *   },
 *   set: (key: string, value: string) => {
 *     if (!isBrowser()) return;
 *     localStorage.setItem(key, value);
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // React/Next.js useEffect alternative check
 * import { useEffect, useState } from "react";
 *
 * function useWindowSize() {
 *   const [size, setSize] = useState({ width: 0, height: 0 });
 *
 *   useEffect(() => {
 *     if (!isBrowser()) return;
 *
 *     const handleResize = () => {
 *       setSize({ width: window.innerWidth, height: window.innerHeight });
 *     };
 *
 *     handleResize();
 *     window.addEventListener("resize", handleResize);
 *     return () => window.removeEventListener("resize", handleResize);
 *   }, []);
 *
 *   return size;
 * }
 * ```
 *
 * @since 0.0.5
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && hasOwnProperty(window, "document");
}
