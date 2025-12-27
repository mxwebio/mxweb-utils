import {
  AsyncCallback,
  AsyncGeneratorCallback,
  Callback,
  GeneratorCallback,
  LiteralClass,
  LiteralFunction,
  LiteralObject,
} from "./types";
import { getTypeName } from "./get-type-name";
import { hasOwnProperty } from "./has-own-property";

/**
 * Union type representing all callable function types.
 *
 * Includes synchronous functions, async functions, generators, and async generators.
 *
 * @since 0.0.5
 */
export type Callable =
  | Callback<unknown>
  | AsyncCallback<unknown>
  | GeneratorCallback<unknown>
  | AsyncGeneratorCallback<unknown>;

/**
 * Utility type to determine valid keys or callable values for an object.
 *
 * When Obj is undefined, returns unknown (accepts any value).
 * When Obj is defined, returns keyof Obj (only valid property keys).
 *
 * @template Obj - The object type or undefined
 * @since 0.0.5
 */
export type KeyOrCallable<Obj extends LiteralObject | LiteralFunction | LiteralClass | undefined> =
  Obj extends undefined ? unknown : keyof Obj;

/**
 * Conditional type that evaluates whether a function or property is callable.
 *
 * Returns true if the function/property is a Callable type, false otherwise.
 *
 * @template Obj - The object type or undefined
 * @template Fn - The function or property key to check
 * @since 0.0.5
 */
export type IsCallable<
  Obj extends LiteralObject | LiteralFunction | LiteralClass | undefined,
  Fn = KeyOrCallable<Obj>,
> = Obj extends undefined
  ? Fn extends Callable
    ? true
    : false
  : Fn extends keyof Obj
    ? Obj[Fn] extends Callable
      ? true
      : false
    : Fn extends Callable
      ? true
      : false;

function isFunction(value: unknown): boolean {
  const type = getTypeName(value);
  return (
    typeof value === "function" ||
    type === "[object Function]" ||
    type === "[object AsyncFunction]" ||
    type === "[object GeneratorFunction]" ||
    type === "[object AsyncGeneratorFunction]"
  );
}

/**
 * Checks if a value or object property is a callable function.
 *
 * This function can check if a standalone value is callable, or if a property
 * on an object, function, or class is callable. It supports all function types including
 * regular functions, async functions, generators, and async generators.
 *
 * @template Obj - The object type, function type, class type, or undefined
 * @template Fn - The function or property key to check
 * @param {Fn} fn - The function to check, or property key if obj is provided
 * @param {Obj} obj - Optional object or function to check property on
 * @returns {IsCallable<Obj, Fn>} True if callable, false otherwise
 *
 * @example
 * ```typescript
 * // Check standalone functions
 * isCallable(() => {}, undefined); // true
 * isCallable(async () => {}, undefined); // true
 * isCallable(function*() {}, undefined); // true
 * isCallable("not a function", undefined); // false
 * ```
 *
 * @example
 * ```typescript
 * // Check object properties
 * const handlers = {
 *   onClick: () => console.log("clicked"),
 *   onSubmit: async () => await saveData(),
 *   name: "handler"
 * };
 *
 * isCallable("onClick", handlers); // true
 * isCallable("onSubmit", handlers); // true
 * isCallable("name", handlers); // false (string, not function)
 * isCallable("nonExistent", handlers); // false (property doesn't exist)
 * ```
 *
 * @example
 * ```typescript
 * // Check function with attached properties
 * const api = Object.assign(
 *   function request() { return fetch("/api"); },
 *   {
 *     get: () => fetch("/api", { method: "GET" }),
 *     post: async (data: unknown) => fetch("/api", { method: "POST", body: JSON.stringify(data) }),
 *     baseUrl: "https://example.com"
 *   }
 * );
 *
 * isCallable("get", api); // true
 * isCallable("post", api); // true
 * isCallable("baseUrl", api); // false (string, not function)
 * ```
 *
 * @example
 * ```typescript
 * // Safe method invocation pattern
 * function invokeIfCallable<T extends object>(obj: T, method: keyof T) {
 *   if (isCallable(method, obj)) {
 *     return (obj[method] as Function)();
 *   }
 *   return undefined;
 * }
 * ```
 *
 * @since 0.0.5
 */
export function isCallable<
  Obj extends LiteralObject | LiteralFunction | LiteralClass | undefined,
  Fn = KeyOrCallable<Obj>,
>(fn: Fn, obj: Obj): IsCallable<Obj, Fn> {
  if (obj !== undefined && obj !== null) {
    if (!hasOwnProperty(obj, fn as PropertyKey)) {
      return false as IsCallable<Obj, Fn>;
    }

    const value = (obj as unknown as Record<PropertyKey, unknown>)[fn as PropertyKey];
    return isFunction(value) as IsCallable<Obj, Fn>;
  }

  return isFunction(fn) as IsCallable<Obj, Fn>;
}
