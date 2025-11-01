/**
 * Generic object type with string keys and values of type T.
 *
 * @since 0.0.2
 * @template T - The type of values in the object
 * @example
 * ```typescript
 * const obj: ObjectOf<number> = { a: 1, b: 2 };
 * const obj2: ObjectOf<string> = { name: "John", email: "john@example.com" };
 * ```
 */
export type ObjectOf<T = unknown> =
  | Record<string, T>
  | {
      [key: string]: T;
    };

/**
 * A synchronous callback function type.
 *
 * @since 0.0.2
 * @template T - The return type of the callback
 * @template Args - The argument types of the callback (default: empty array)
 * @example
 * ```typescript
 * const callback: Callback<number> = () => 42;
 * const callback2: Callback<string, [number, string]> = (num, str) => `${num}-${str}`;
 * ```
 */
export interface Callback<T, Args extends unknown[] = []> {
  (...args: Args): T;
}

/**
 * An asynchronous callback function type that returns a Promise.
 *
 * @since 0.0.2
 * @template T - The resolved type of the Promise
 * @template Args - The argument types of the callback (default: empty array)
 * @example
 * ```typescript
 * const asyncCallback: AsyncCallback<number> = async () => 42;
 * const asyncCallback2: AsyncCallback<User, [string]> = async (id) => {
 *   return await fetchUser(id);
 * };
 * ```
 */
export interface AsyncCallback<T, Args extends unknown[] = []> {
  (...args: Args): Promise<T>;
}

/**
 * Primitive JavaScript types.
 *
 * @since 0.0.2
 * @example
 * ```typescript
 * const str: Primitive = "hello";
 * const num: Primitive = 42;
 * const bool: Primitive = true;
 * const nul: Primitive = null;
 * const undef: Primitive = undefined;
 * ```
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * Object with string keys and primitive values.
 * Commonly used for flattened object representations.
 *
 * @since 0.0.2
 * @example
 * ```typescript
 * const flatData: FlattenedPrimitive = {
 *   "user.name": "John",
 *   "user.age": 30,
 *   "user.active": true,
 * };
 * ```
 */
export type FlattenedPrimitive =
  | Record<string, Primitive>
  | {
      [key: string]: Primitive;
    };
