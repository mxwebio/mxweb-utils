import { describe, it, expect } from "vitest";
import { isEqualPrimitive } from "../src/is-equal-primitive";

describe("isEqualPrimitive", () => {
  describe("Primitive values", () => {
    it("should return true for equal numbers", () => {
      expect(isEqualPrimitive(1, 1)).toBe(true);
      expect(isEqualPrimitive(0, 0)).toBe(true);
      expect(isEqualPrimitive(-5, -5)).toBe(true);
      expect(isEqualPrimitive(3.14, 3.14)).toBe(true);
    });

    it("should return false for different numbers", () => {
      expect(isEqualPrimitive(1, 2)).toBe(false);
      expect(isEqualPrimitive(0, 1)).toBe(false);
    });

    it("should return true for equal strings", () => {
      expect(isEqualPrimitive("hello", "hello")).toBe(true);
      expect(isEqualPrimitive("", "")).toBe(true);
    });

    it("should return false for different strings", () => {
      expect(isEqualPrimitive("hello", "world")).toBe(false);
    });

    it("should return true for equal booleans", () => {
      expect(isEqualPrimitive(true, true)).toBe(true);
      expect(isEqualPrimitive(false, false)).toBe(true);
    });

    it("should return false for different booleans", () => {
      expect(isEqualPrimitive(true, false)).toBe(false);
    });

    it("should return true for null === null", () => {
      expect(isEqualPrimitive(null, null)).toBe(true);
    });

    it("should return true for undefined === undefined", () => {
      expect(isEqualPrimitive(undefined, undefined)).toBe(true);
    });
  });

  describe("Different types", () => {
    it("should return false for different types", () => {
      expect(isEqualPrimitive(1, "1")).toBe(false);
      expect(isEqualPrimitive(true, 1)).toBe(false);
      expect(isEqualPrimitive(null, undefined)).toBe(false);
      expect(isEqualPrimitive([], {})).toBe(false);
      expect(isEqualPrimitive(0, false)).toBe(false);
      expect(isEqualPrimitive("", false)).toBe(false);
    });
  });

  describe("Arrays", () => {
    it("should return true for equal arrays", () => {
      expect(isEqualPrimitive([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqualPrimitive([], [])).toBe(true);
      expect(isEqualPrimitive(["a", "b"], ["a", "b"])).toBe(true);
    });

    it("should return false for different arrays", () => {
      expect(isEqualPrimitive([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqualPrimitive([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqualPrimitive([1, 2, 3], [1, 2])).toBe(false);
    });

    it("should handle nested arrays", () => {
      expect(isEqualPrimitive([1, [2, 3]], [1, [2, 3]])).toBe(true);
      expect(isEqualPrimitive([1, [2, 3]], [1, [2, 4]])).toBe(false);
      expect(isEqualPrimitive([[[]]], [[[]]])).toBe(true);
    });

    it("should handle mixed nested arrays", () => {
      expect(isEqualPrimitive([1, [2, [3, 4]]], [1, [2, [3, 4]]])).toBe(true);
      expect(isEqualPrimitive([1, [2, [3, 4]]], [1, [2, [3, 5]]])).toBe(false);
    });
  });

  describe("Objects", () => {
    it("should return true for equal objects", () => {
      expect(isEqualPrimitive({ a: 1 }, { a: 1 })).toBe(true);
      expect(isEqualPrimitive({}, {})).toBe(true);
      expect(isEqualPrimitive({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it("should return false for different objects", () => {
      expect(isEqualPrimitive({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqualPrimitive({ a: 1 }, { b: 1 })).toBe(false);
      expect(isEqualPrimitive({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should handle nested objects", () => {
      expect(isEqualPrimitive({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      expect(isEqualPrimitive({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
      expect(isEqualPrimitive({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
    });

    it("should not care about key order", () => {
      expect(isEqualPrimitive({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    });
  });

  describe("Mixed structures", () => {
    it("should handle objects with arrays", () => {
      expect(isEqualPrimitive({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true);
      expect(isEqualPrimitive({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(false);
    });

    it("should handle arrays with objects", () => {
      expect(isEqualPrimitive([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true);
      expect(isEqualPrimitive([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false);
    });

    it("should handle complex nested structures", () => {
      const obj1 = {
        users: [{ name: "John", age: 30 }],
        active: true,
        meta: { count: 1 },
      };
      const obj2 = {
        users: [{ name: "John", age: 30 }],
        active: true,
        meta: { count: 1 },
      };
      const obj3 = {
        users: [{ name: "John", age: 31 }],
        active: true,
        meta: { count: 1 },
      };

      expect(isEqualPrimitive(obj1, obj2)).toBe(true);
      expect(isEqualPrimitive(obj1, obj3)).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle NaN", () => {
      // NaN !== NaN in JavaScript
      expect(isEqualPrimitive(NaN, NaN)).toBe(false);
    });

    it("should handle -0 and 0", () => {
      // 0 === -0 in JavaScript
      expect(isEqualPrimitive(0, -0)).toBe(true);
    });

    it("should handle Infinity", () => {
      expect(isEqualPrimitive(Infinity, Infinity)).toBe(true);
      expect(isEqualPrimitive(-Infinity, -Infinity)).toBe(true);
      expect(isEqualPrimitive(Infinity, -Infinity)).toBe(false);
    });

    it("should handle empty structures", () => {
      expect(isEqualPrimitive([], [])).toBe(true);
      expect(isEqualPrimitive({}, {})).toBe(true);
      expect(isEqualPrimitive([[]], [[]])).toBe(true);
      expect(isEqualPrimitive({ a: {} }, { a: {} })).toBe(true);
    });
  });
});
