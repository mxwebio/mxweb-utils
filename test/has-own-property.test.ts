import { describe, it, expect } from "vitest";
import { hasOwnProperty } from "../src/has-own-property";

describe("hasOwnProperty", () => {
  describe("Basic functionality", () => {
    it("should return true for existing own property", () => {
      const obj = { name: "John", age: 30 };
      expect(hasOwnProperty(obj, "name")).toBe(true);
      expect(hasOwnProperty(obj, "age")).toBe(true);
    });

    it("should return false for non-existing property", () => {
      const obj = { name: "John" };
      expect(hasOwnProperty(obj, "email")).toBe(false);
    });

    it("should return false for inherited properties", () => {
      class Parent {
        inherited = "value";
        protoMethod() {}
      }

      const child = new Parent();
      expect(hasOwnProperty(child, "inherited")).toBe(true);
      expect(hasOwnProperty(child, "protoMethod")).toBe(false);
      expect(hasOwnProperty(child, "toString")).toBe(false);
    });
  });

  describe("Null prototype objects", () => {
    it("should work with null prototype objects", () => {
      const obj = Object.create(null);
      obj.foo = "bar";
      expect(hasOwnProperty(obj, "foo")).toBe(true);
      expect(hasOwnProperty(obj, "bar")).toBe(false);
    });
  });

  describe("Different key types", () => {
    it("should work with string keys", () => {
      const obj = { key: "value" };
      expect(hasOwnProperty(obj, "key")).toBe(true);
    });

    it("should work with number keys", () => {
      const obj = { 0: "first", 1: "second" };
      expect(hasOwnProperty(obj, 0)).toBe(true);
      expect(hasOwnProperty(obj, 1)).toBe(true);
      expect(hasOwnProperty(obj, 2)).toBe(false);
    });

    it("should work with symbol keys", () => {
      const sym = Symbol("test");
      const obj = { [sym]: "value" };
      expect(hasOwnProperty(obj, sym)).toBe(true);
      expect(hasOwnProperty(obj, Symbol("other"))).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should return false for null", () => {
      expect(hasOwnProperty(null as any, "key")).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(hasOwnProperty(undefined as any, "key")).toBe(false);
    });

    it("should handle empty objects", () => {
      expect(hasOwnProperty({}, "key")).toBe(false);
    });

    it("should handle properties with undefined values", () => {
      const obj = { key: undefined };
      expect(hasOwnProperty(obj, "key")).toBe(true);
    });

    it("should handle properties with null values", () => {
      const obj = { key: null };
      expect(hasOwnProperty(obj, "key")).toBe(true);
    });
  });

  describe("Type narrowing", () => {
    it("should narrow type correctly", () => {
      const obj: Record<string, unknown> = { name: "John" };

      if (hasOwnProperty(obj, "name")) {
        expect(obj.name).toBe("John");
      }
    });

    it("should work with generic value type", () => {
      const handlers = {
        onClick: () => "clicked",
      };

      if (hasOwnProperty<typeof handlers, "onClick", () => string>(handlers, "onClick")) {
        const result = handlers.onClick();
        expect(result).toBe("clicked");
      }
    });
  });

  describe("Arrays", () => {
    it("should work with array indices", () => {
      const arr = ["a", "b", "c"];
      expect(hasOwnProperty(arr, 0)).toBe(true);
      expect(hasOwnProperty(arr, 2)).toBe(true);
      expect(hasOwnProperty(arr, 5)).toBe(false);
    });

    it("should return true for length property on arrays", () => {
      const arr = [1, 2, 3];
      expect(hasOwnProperty(arr, "length")).toBe(true);
    });
  });

  describe("Functions as objects", () => {
    it("should detect own properties on functions", () => {
      const fn = function namedFn() {};
      // Functions have own properties like name and length
      expect(hasOwnProperty(fn as any, "name")).toBe(true);
      expect(hasOwnProperty(fn as any, "length")).toBe(true);
    });

    it("should detect custom properties on functions", () => {
      const api = Object.assign(function request() {}, {
        get: () => {},
        baseUrl: "https://example.com",
      });

      expect(hasOwnProperty(api, "get")).toBe(true);
      expect(hasOwnProperty(api, "baseUrl")).toBe(true);
      expect(hasOwnProperty(api, "nonExistent")).toBe(false);
    });

    it("should return false for inherited function properties", () => {
      const fn = function () {};
      // call, apply, bind are inherited from Function.prototype
      expect(hasOwnProperty(fn as any, "call")).toBe(false);
      expect(hasOwnProperty(fn as any, "apply")).toBe(false);
      expect(hasOwnProperty(fn as any, "bind")).toBe(false);
    });
  });
});
