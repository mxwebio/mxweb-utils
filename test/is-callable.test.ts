import { describe, it, expect } from "vitest";
import { isCallable } from "../src/is-callable";

describe("isCallable", () => {
  describe("Standalone function checks", () => {
    it("should return true for regular functions", () => {
      expect(isCallable(function () {}, undefined)).toBe(true);
      expect(isCallable(() => {}, undefined)).toBe(true);
    });

    it("should return true for async functions", () => {
      expect(isCallable(async function () {}, undefined)).toBe(true);
      expect(isCallable(async () => {}, undefined)).toBe(true);
    });

    it("should return true for generator functions", () => {
      expect(isCallable(function* () {}, undefined)).toBe(true);
    });

    it("should return true for async generator functions", () => {
      expect(isCallable(async function* () {}, undefined)).toBe(true);
    });

    it("should return false for non-functions", () => {
      expect(isCallable("string", undefined)).toBe(false);
      expect(isCallable(123, undefined)).toBe(false);
      expect(isCallable(null, undefined)).toBe(false);
      expect(isCallable(undefined, undefined)).toBe(false);
      expect(isCallable({}, undefined)).toBe(false);
      expect(isCallable([], undefined)).toBe(false);
    });
  });

  describe("Object property checks", () => {
    it("should return true for callable object properties", () => {
      const obj = {
        onClick: () => console.log("clicked"),
        onSubmit: async () => {},
        generator: function* () {},
      };

      expect(isCallable("onClick", obj)).toBe(true);
      expect(isCallable("onSubmit", obj)).toBe(true);
      expect(isCallable("generator", obj)).toBe(true);
    });

    it("should return false for non-callable object properties", () => {
      const obj = {
        name: "John",
        age: 30,
        active: true,
        data: null,
        items: [],
      };

      expect(isCallable("name", obj)).toBe(false);
      expect(isCallable("age", obj)).toBe(false);
      expect(isCallable("active", obj)).toBe(false);
      expect(isCallable("data", obj)).toBe(false);
      expect(isCallable("items", obj)).toBe(false);
    });

    it("should return false for non-existent properties", () => {
      const obj = { name: "John" };
      expect(isCallable("nonExistent" as keyof typeof obj, obj)).toBe(false);
    });
  });

  describe("Class methods", () => {
    it("should detect own method properties (not prototype methods)", () => {
      class MyClass {
        ownMethod = () => {};
        property = "value";
      }

      const instance = new MyClass();
      // Own method (arrow function as property)
      expect(isCallable("ownMethod", instance)).toBe(true);
      // Property is not callable
      expect(isCallable("property", instance)).toBe(false);
    });
  });

  describe("Built-in methods", () => {
    it("should return false for inherited array methods (not own properties)", () => {
      const arr = [1, 2, 3];
      // These are inherited from Array.prototype, not own properties
      expect(isCallable("map", arr)).toBe(false);
      expect(isCallable("filter", arr)).toBe(false);
      expect(isCallable("length", arr)).toBe(false);
    });

    it("should return false for inherited string methods (not own properties)", () => {
      const str = "hello";
      // These are inherited from String.prototype, not own properties
      expect(isCallable("toUpperCase", str as any)).toBe(false);
      expect(isCallable("split", str as any)).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle null object", () => {
      expect(isCallable("key", null as any)).toBe(false);
    });

    it("should handle nested functions", () => {
      const obj = {
        nested: {
          fn: () => {},
        },
      };

      expect(isCallable("nested", obj)).toBe(false);
      expect(isCallable("fn", obj.nested)).toBe(true);
    });

    it("should handle bound functions", () => {
      const obj = {
        fn: function (this: { value: number }) {
          return this;
        }.bind({ value: 42 }),
      };

      expect(isCallable("fn", obj)).toBe(true);
    });

    it("should handle Symbol keys", () => {
      const sym = Symbol("method");
      const obj = {
        [sym]: () => {},
      };

      expect(isCallable(sym, obj)).toBe(true);
    });
  });

  describe("Function with attached properties", () => {
    it("should detect callable properties on functions", () => {
      const api = Object.assign(function request() {}, {
        get: () => {},
        post: async () => {},
        baseUrl: "https://example.com",
      });

      expect(isCallable("get", api)).toBe(true);
      expect(isCallable("post", api)).toBe(true);
      expect(isCallable("baseUrl", api)).toBe(false);
      expect(isCallable("nonExistent", api)).toBe(false);
    });

    it("should detect generator and async generator on functions", () => {
      const utils = Object.assign(function () {}, {
        gen: function* () {
          yield 1;
        },
        asyncGen: async function* () {
          yield 1;
        },
      });

      expect(isCallable("gen", utils)).toBe(true);
      expect(isCallable("asyncGen", utils)).toBe(true);
    });

    it("should handle Symbol keys on functions", () => {
      const sym = Symbol("method");
      const fn = Object.assign(function () {}, {
        [sym]: () => {},
      });

      expect(isCallable(sym, fn)).toBe(true);
    });
  });
});
