/* eslint-disable @typescript-eslint/no-explicit-any */
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
 * A generator callback function type that returns a Generator.
 *
 * @since 0.0.5
 * @template T - The yielded type of the Generator
 * @template Args - The argument types of the callback (default: empty array)
 * @example
 * ```typescript
 * const genCallback: GeneratorCallback<number> = function* () {
 *   yield 1;
 *   yield 2;
 *   yield 3;
 * };
 *
 * const rangeGen: GeneratorCallback<number, [number, number]> = function* (start, end) {
 *   for (let i = start; i <= end; i++) {
 *     yield i;
 *   }
 * };
 * ```
 */
export interface GeneratorCallback<T, Args extends unknown[] = []> {
  (...args: Args): Generator<T>;
}

/**
 * An async generator callback function type that returns an AsyncGenerator.
 *
 * @since 0.0.5
 * @template T - The yielded type of the AsyncGenerator
 * @template Args - The argument types of the callback (default: empty array)
 * @example
 * ```typescript
 * const asyncGenCallback: AsyncGeneratorCallback<number> = async function* () {
 *   yield await Promise.resolve(1);
 *   yield await Promise.resolve(2);
 * };
 *
 * const fetchPages: AsyncGeneratorCallback<Data, [string]> = async function* (url) {
 *   let page = 1;
 *   while (true) {
 *     const data = await fetch(`${url}?page=${page}`).then(r => r.json());
 *     if (!data.length) break;
 *     yield data;
 *     page++;
 *   }
 * };
 * ```
 */
export interface AsyncGeneratorCallback<T, Args extends unknown[] = []> {
  (...args: Args): AsyncGenerator<T>;
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

/**
 * A generic object literal type that can hold any key-value pairs.
 *
 * This type is useful when you need to accept any object-like structure,
 * including plain objects, records, and class instances. It uses PropertyKey
 * to allow string, number, and symbol keys.
 *
 * @since 0.0.5
 * @example
 * ```typescript
 * // Plain object
 * const config: LiteralObject = { host: "localhost", port: 3000 };
 *
 * // Nested object
 * const user: LiteralObject = {
 *   name: "John",
 *   address: { city: "NYC", zip: "10001" }
 * };
 *
 * // With symbol keys
 * const sym = Symbol("id");
 * const data: LiteralObject = { [sym]: 123, name: "test" };
 * ```
 *
 * @example
 * ```typescript
 * // Function accepting any object
 * function processObject(obj: LiteralObject) {
 *   return Object.keys(obj);
 * }
 *
 * processObject({ a: 1, b: 2 }); // ["a", "b"]
 * ```
 */
export type LiteralObject =
  | Record<PropertyKey, unknown>
  | {
      [key: string]: unknown;
    }
  | object;

/**
 * A generic function type that can represent any callable function.
 *
 * This type is a safer alternative to the built-in `Function` type,
 * which is too broad and discouraged by TypeScript/ESLint.
 * It uses the existing `Callback` interface with `any` types for maximum flexibility.
 *
 * @since 0.0.5
 * @example
 * ```typescript
 * // Regular function
 * const greet: LiteralFunction = (name: string) => `Hello, ${name}`;
 *
 * // Function with properties
 * const fn: LiteralFunction = () => {};
 * fn.version = "1.0.0";
 *
 * // Checking if value is a function
 * function isFunc(value: unknown): value is LiteralFunction {
 *   return typeof value === "function";
 * }
 * ```
 */
export type LiteralFunction = Callback<unknown | Promise<unknown>, any[]>;

/**
 * A generic class/constructor type that can represent any instantiable class.
 *
 * This type is useful when you need to accept class constructors as arguments,
 * for dependency injection, factory patterns, or reflection-like operations.
 *
 * @since 0.0.5
 * @template T - The instance type that the class produces (default: unknown)
 * @example
 * ```typescript
 * class User {
 *   constructor(public name: string) {}
 * }
 *
 * // Accept any class constructor
 * function createInstance<T>(Cls: LiteralClass<T>, ...args: unknown[]): T {
 *   return new Cls(...args);
 * }
 *
 * const user = createInstance(User, "John");
 * ```
 *
 * @example
 * ```typescript
 * // Registry of classes
 * const registry: Map<string, LiteralClass> = new Map();
 * registry.set("User", User);
 * registry.set("Product", Product);
 *
 * // Get and instantiate
 * const UserClass = registry.get("User");
 * if (UserClass) {
 *   const instance = new UserClass();
 * }
 * ```
 */
export type LiteralClass<T = unknown> = new (...args: any[]) => T;
