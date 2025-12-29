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

/**
 * A union type of all built-in primitive and object types in JavaScript/TypeScript.
 *
 * This type includes:
 * - Basic primitives (string, number, boolean, null, undefined, bigint, symbol)
 * - Date and RegExp
 * - File API types (File, FileList, Blob, FormData)
 * - URL and URLSearchParams
 * - Binary data types (ArrayBuffer, SharedArrayBuffer, DataView, TypedArrays)
 * - Fetch API types (Headers, Request, Response)
 * - Abort API (AbortController, AbortSignal)
 * - Stream API (ReadableStream, WritableStream, TransformStream)
 * - Event types (Event, CustomEvent, EventTarget)
 * - Observer types (MutationObserver, IntersectionObserver, ResizeObserver)
 * - Worker and messaging types (Worker, MessageChannel, MessagePort, BroadcastChannel)
 * - Generator types (Generator, AsyncGenerator)
 * - DOM types (Element, HTMLElement, Node, Document, Window)
 * - Error types (Error, TypeError, RangeError, SyntaxError, ReferenceError, EvalError, AggregateError, URIError)
 *
 * @since 0.0.6
 * @example
 * ```typescript
 * // Use as a constraint for generic types
 * function isBuiltIn<T>(value: T): value is T & BuiltInPrimitive {
 *   return value instanceof Date || value instanceof RegExp || typeof value !== 'object';
 * }
 *
 * // Use in conditional types
 * type ExtractBuiltIn<T> = T extends BuiltInPrimitive ? T : never;
 * ```
 */
export type BuiltInPrimitive =
  | Primitive
  | bigint
  | symbol
  | Date
  | RegExp
  | File
  | FileList
  | URL
  | Blob
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
  | FormData
  | Headers
  | Request
  | Response
  | URLSearchParams
  | AbortController
  | AbortSignal
  | ReadableStream
  | WritableStream
  | TransformStream
  | Event
  | CustomEvent
  | EventTarget
  | MutationObserver
  | IntersectionObserver
  | ResizeObserver
  | Worker
  | MessageChannel
  | MessagePort
  | BroadcastChannel
  | Generator
  | AsyncGenerator
  | Element
  | HTMLElement
  | Node
  | Document
  | Window
  | Error
  | TypeError
  | RangeError
  | SyntaxError
  | ReferenceError
  | EvalError
  | AggregateError
  | URIError;

/**
 * A function type that can have additional properties attached to it.
 *
 * This type combines a callable function with an object type, allowing
 * functions to have custom properties. Useful for creating functions with
 * metadata, configuration, or namespaced utilities.
 *
 * @since 0.0.6
 * @template F - The function type (default: Callback<any, any[]>)
 * @template O - The object type for additional properties (default: LiteralObject)
 * @example
 * ```typescript
 * // Function with version property
 * type VersionedFn = ExtendedFunction<() => void, { version: string }>;
 * const myFn: VersionedFn = Object.assign(() => {}, { version: "1.0.0" });
 * myFn(); // callable
 * console.log(myFn.version); // "1.0.0"
 * ```
 *
 * @example
 * ```typescript
 * // Utility namespace pattern
 * type StringUtils = ExtendedFunction<
 *   (str: string) => string,
 *   { uppercase: (s: string) => string; lowercase: (s: string) => string }
 * >;
 *
 * const strUtils: StringUtils = Object.assign(
 *   (str: string) => str.trim(),
 *   {
 *     uppercase: (s: string) => s.toUpperCase(),
 *     lowercase: (s: string) => s.toLowerCase(),
 *   }
 * );
 * ```
 */
export type ExtendedFunction<F = Callback<any, any[]>, O = LiteralObject> = F & O;

/**
 * A deep partial type that correctly handles built-in types.
 *
 * Unlike the standard `Partial<T>`, this type recursively makes all properties
 * optional while preserving the structure of built-in types like Map, Set,
 * WeakMap, WeakSet, Promise, WeakRef, FinalizationRegistry, and Arrays.
 *
 * Built-in primitives (Date, RegExp, TypedArrays, etc.) are preserved as-is.
 * Object types have their properties made optional recursively.
 * Functions with properties have their properties made optional.
 *
 * @since 0.0.6
 * @template T - The type to make partially optional
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   address: {
 *     city: string;
 *     zip: string;
 *   };
 *   tags: Set<string>;
 * }
 *
 * // All properties become optional, including nested ones
 * type PartialUser = PartialBuiltIn<User>;
 * const user: PartialUser = {
 *   name: "John",
 *   // address and tags are optional
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Built-in types are preserved correctly
 * type PartialMap = PartialBuiltIn<Map<string, { value: number }>>;
 * // Result: Map<PartialBuiltIn<string>, PartialBuiltIn<{ value: number }>>
 *
 * type PartialPromise = PartialBuiltIn<Promise<{ data: string }>>;
 * // Result: Promise<PartialBuiltIn<{ data: string }>>
 * ```
 */
export type PartialBuiltIn<T> =
  T extends Map<infer K, infer V>
    ? Map<PartialBuiltIn<K>, PartialBuiltIn<V>>
    : T extends WeakMap<infer K, infer V>
      ? WeakMap<PartialBuiltIn<K>, PartialBuiltIn<V>>
      : T extends ReadonlyMap<infer K, infer V>
        ? ReadonlyMap<PartialBuiltIn<K>, PartialBuiltIn<V>>
        : T extends Set<infer U>
          ? Set<PartialBuiltIn<U>>
          : T extends WeakSet<infer U>
            ? WeakSet<PartialBuiltIn<U>>
            : T extends ReadonlySet<infer U>
              ? ReadonlySet<PartialBuiltIn<U>>
              : T extends Promise<infer U>
                ? Promise<PartialBuiltIn<U>>
                : T extends WeakRef<infer U>
                  ? WeakRef<PartialBuiltIn<U>>
                  : T extends FinalizationRegistry<infer U>
                    ? FinalizationRegistry<PartialBuiltIn<U>>
                    : T extends BuiltInPrimitive
                      ? T
                      : T extends ExtendedFunction
                        ? T extends ExtendedFunction<infer F>
                          ? F & {
                              [K in keyof T]?: PartialBuiltIn<T[K]>;
                            }
                          : T
                        : T extends LiteralObject
                          ? { [K in keyof T]?: PartialBuiltIn<T[K]> }
                          : T extends Array<infer U>
                            ? Array<PartialBuiltIn<U>>
                            : T extends ReadonlyArray<infer U>
                              ? ReadonlyArray<PartialBuiltIn<U>>
                              : T;
