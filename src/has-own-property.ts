import { LiteralClass, LiteralFunction, LiteralObject } from "./types";

/**
 * Type-safe check if an object has a specific property as its own (not inherited).
 *
 * This is a type guard function that safely checks property existence using
 * `Object.prototype.hasOwnProperty.call()` to avoid issues with objects that
 * have a custom `hasOwnProperty` method or null prototype objects.
 *
 * When the function returns true, TypeScript narrows the object type to include
 * the checked property, enabling safe property access without additional type assertions.
 *
 * @template Obj - The object type extending LiteralObject, LiteralFunction, or LiteralClass
 * @template Key - The property key type (string, number, or symbol)
 * @template Value - The expected value type of the property (default: unknown)
 * @param {Obj} obj - The object to check
 * @param {Key} prop - The property key to check for
 * @returns {boolean} True if the object has the property as its own, false otherwise
 *
 * @example
 * ```typescript
 * // Basic usage
 * const user = { name: "John", age: 30 };
 *
 * if (hasOwnProperty(user, "name")) {
 *   // TypeScript knows user.name exists here
 *   console.log(user.name); // "John"
 * }
 *
 * hasOwnProperty(user, "email"); // false
 * ```
 *
 * @example
 * ```typescript
 * // Safe property access with unknown objects
 * function getProperty(obj: object, key: string): unknown {
 *   if (hasOwnProperty(obj, key)) {
 *     return obj[key]; // Safe access, TypeScript allows this
 *   }
 *   return undefined;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Checking for function properties with type hint
 * const handlers = { onClick: () => console.log("clicked") };
 *
 * if (hasOwnProperty<typeof handlers, "onClick", () => void>(handlers, "onClick")) {
 *   handlers.onClick(); // TypeScript knows it's a function
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handling objects with null prototype
 * const nullProtoObj = Object.create(null);
 * nullProtoObj.foo = "bar";
 *
 * // This would throw: nullProtoObj.hasOwnProperty("foo")
 * // But this works safely:
 * hasOwnProperty(nullProtoObj, "foo"); // true
 * ```
 *
 * @example
 * ```typescript
 * // Distinguishing own vs inherited properties
 * class Person {
 *   name = "John";
 * }
 * Person.prototype.greet = function() {};
 *
 * const person = new Person();
 * hasOwnProperty(person, "name"); // true (own property)
 * hasOwnProperty(person, "greet"); // false (inherited)
 * ```
 *
 * @example
 * ```typescript
 * // Checking properties on functions
 * const api = Object.assign(
 *   function request() {},
 *   { get: () => {}, baseUrl: "https://example.com" }
 * );
 *
 * hasOwnProperty(api, "get"); // true
 * hasOwnProperty(api, "baseUrl"); // true
 * hasOwnProperty(api, "name"); // true (function's own name property)
 * hasOwnProperty(api, "nonExistent"); // false
 * ```
 *
 * @since 0.0.5
 */
export function hasOwnProperty<
  Obj extends LiteralObject | LiteralFunction | LiteralClass,
  Key extends PropertyKey,
  Value = unknown,
>(obj: Obj, prop: Key): obj is Obj & Record<Key, Value> {
  const types = [typeof obj === "object" && obj !== null, typeof obj === "function"];
  return types.includes(true) && Object.prototype.hasOwnProperty.call(obj, prop);
}
