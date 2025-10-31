/**
 * Types of storage mechanisms supported by the storage utility.
 */
type StorageType = "localStorage" | "sessionStorage" | "cookie";

/**
 * Internal storage class that provides a unified interface for different storage mechanisms.
 *
 * This class abstracts away the differences between localStorage, sessionStorage, and cookies,
 * providing a consistent API for storing and retrieving data with automatic JSON serialization.
 */
class InnerStorage {
  /**
   * Creates a new InnerStorage instance.
   *
   * @param storageType - The type of storage to use. Defaults to "localStorage".
   */
  constructor(private readonly storageType: StorageType = "localStorage") {}

  /**
   * Gets a raw string value from storage.
   *
   * @param key - The key to retrieve the value for
   * @returns The stored string value, or null if not found or in a server environment
   * @private
   */
  private get(key: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    switch (this.storageType) {
      case "localStorage":
        return window.localStorage.getItem(key);
      case "sessionStorage":
        return window.sessionStorage.getItem(key);
      case "cookie":
        return (
          document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${key}=`))
            ?.split("=")[1] || null
        );
      default:
        return null;
    }
  }

  /**
   * Sets a raw string value in storage.
   *
   * @param key - The key to store the value under
   * @param value - The string value to store
   * @private
   */
  private set(key: string, value: string): void {
    if (typeof window === "undefined") {
      return;
    }

    switch (this.storageType) {
      case "localStorage":
        window.localStorage.setItem(key, value);
        break;
      case "sessionStorage":
        window.sessionStorage.setItem(key, value);
        break;
      case "cookie":
        document.cookie = `${key}=${value}; path=/`;
        break;
    }
  }

  /**
   * Removes a value from storage.
   *
   * @param key - The key of the value to remove
   * @private
   */
  private remove(key: string): void {
    if (typeof window === "undefined") {
      return;
    }

    switch (this.storageType) {
      case "localStorage":
        window.localStorage.removeItem(key);
        break;
      case "sessionStorage":
        window.sessionStorage.removeItem(key);
        break;
      case "cookie":
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        break;
    }
  }

  /**
   * Retrieves an item from storage with automatic JSON deserialization.
   *
   * This method attempts to parse the stored value as JSON. If parsing fails,
   * it returns the raw string value cast to the expected type.
   *
   * @template T - The expected type of the stored value
   * @param key - The key of the item to retrieve
   * @returns The parsed value of type T, or null if the item doesn't exist or in a server environment
   *
   * @example
   * ```typescript
   * // Store and retrieve an object
   * const user = storage.local.getItem<{ name: string; age: number }>('user');
   *
   * // Store and retrieve a primitive
   * const count = storage.session.getItem<number>('count');
   * ```
   */
  getItem<T>(key: string): T | null {
    const item = this.get(key);

    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  /**
   * Stores an item in storage with automatic JSON serialization.
   *
   * This method automatically serializes objects to JSON. String values are stored as-is.
   * The value is stored according to the configured storage type (localStorage, sessionStorage, or cookie).
   *
   * @template T - The type of value to store (defaults to string)
   * @param key - The key to store the value under
   * @param value - The value to store. Objects are automatically serialized to JSON.
   *
   * @example
   * ```typescript
   * // Store an object
   * storage.local.setItem('user', { name: 'John', age: 30 });
   *
   * // Store a primitive value
   * storage.session.setItem('count', 42);
   *
   * // Store a string
   * storage.cookie.setItem('token', 'abc123');
   * ```
   */
  setItem<T = string>(key: string, value: T): void {
    const item = typeof value === "string" ? value : JSON.stringify(value);
    this.set(key, item);
  }

  /**
   * Removes an item from storage.
   *
   * This method removes the item associated with the specified key from the configured storage.
   * For cookies, it sets an expiration date in the past to delete the cookie.
   *
   * @param key - The key of the item to remove
   *
   * @example
   * ```typescript
   * // Remove from localStorage
   * storage.local.removeItem('user');
   *
   * // Remove from sessionStorage
   * storage.session.removeItem('token');
   *
   * // Remove a cookie
   * storage.cookie.removeItem('preferences');
   * ```
   */
  removeItem(key: string): void {
    this.remove(key);
  }
}

/**
 * Unified storage utility that provides a consistent interface for localStorage, sessionStorage, and cookies.
 *
 * This utility automatically handles JSON serialization/deserialization and provides a type-safe API
 * for storing and retrieving data. It's safe to use in server-side rendering environments.
 *
 * @example
 * ```typescript
 * // Use localStorage
 * storage.local.getItem<User>('user');
 *
 * // Use sessionStorage
 * storage.session.getItem<string>('token');
 *
 * // Use cookies
 * storage.cookie.getItem<Preferences>('preferences');
 *
 * // Create a custom storage instance
 * const customStorage = storage.from('localStorage');
 * ```
 */
export const storage = {
  /**
   * Creates a storage instance of the specified type.
   *
   * @param type - The type of storage to create ("localStorage", "sessionStorage", or "cookie")
   * @returns A new InnerStorage instance configured for the specified storage type
   */
  from(type: StorageType): InnerStorage {
    return new InnerStorage(type);
  },
  /**
   * Gets a localStorage instance.
   *
   * @returns A new InnerStorage instance configured for localStorage
   */
  get local() {
    return new InnerStorage("localStorage");
  },
  /**
   * Gets a sessionStorage instance.
   *
   * @returns A new InnerStorage instance configured for sessionStorage
   */
  get session() {
    return new InnerStorage("sessionStorage");
  },
  /**
   * Gets a cookie storage instance.
   *
   * @returns A new InnerStorage instance configured for cookie storage
   */
  get cookie() {
    return new InnerStorage("cookie");
  },
};
