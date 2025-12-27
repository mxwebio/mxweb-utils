import { describe, it, expect } from "vitest";
import { getTypeName } from "../src/get-type-name";

describe("getTypeName", () => {
  describe("Primitive types", () => {
    it("should return [object Null] for null", () => {
      expect(getTypeName(null)).toBe("[object Null]");
    });

    it("should return [object Undefined] for undefined", () => {
      expect(getTypeName(undefined)).toBe("[object Undefined]");
    });

    it("should return [object Number] for numbers", () => {
      expect(getTypeName(42)).toBe("[object Number]");
      expect(getTypeName(0)).toBe("[object Number]");
      expect(getTypeName(-1)).toBe("[object Number]");
      expect(getTypeName(3.14)).toBe("[object Number]");
      expect(getTypeName(NaN)).toBe("[object Number]");
      expect(getTypeName(Infinity)).toBe("[object Number]");
    });

    it("should return [object String] for strings", () => {
      expect(getTypeName("hello")).toBe("[object String]");
      expect(getTypeName("")).toBe("[object String]");
    });

    it("should return [object Boolean] for booleans", () => {
      expect(getTypeName(true)).toBe("[object Boolean]");
      expect(getTypeName(false)).toBe("[object Boolean]");
    });

    it("should return [object Symbol] for symbols", () => {
      expect(getTypeName(Symbol("test"))).toBe("[object Symbol]");
      expect(getTypeName(Symbol.iterator)).toBe("[object Symbol]");
    });

    it("should return [object BigInt] for bigints", () => {
      expect(getTypeName(BigInt(123))).toBe("[object BigInt]");
      expect(getTypeName(123n)).toBe("[object BigInt]");
    });
  });

  describe("Object types", () => {
    it("should return [object Object] for plain objects", () => {
      expect(getTypeName({})).toBe("[object Object]");
      expect(getTypeName({ a: 1 })).toBe("[object Object]");
    });

    it("should return [object Array] for arrays", () => {
      expect(getTypeName([])).toBe("[object Array]");
      expect(getTypeName([1, 2, 3])).toBe("[object Array]");
    });

    it("should return [object Date] for dates", () => {
      expect(getTypeName(new Date())).toBe("[object Date]");
    });

    it("should return [object RegExp] for regular expressions", () => {
      expect(getTypeName(/test/)).toBe("[object RegExp]");
      expect(getTypeName(new RegExp("test"))).toBe("[object RegExp]");
    });

    it("should return [object Map] for maps", () => {
      expect(getTypeName(new Map())).toBe("[object Map]");
    });

    it("should return [object Set] for sets", () => {
      expect(getTypeName(new Set())).toBe("[object Set]");
    });

    it("should return [object WeakMap] for weak maps", () => {
      expect(getTypeName(new WeakMap())).toBe("[object WeakMap]");
    });

    it("should return [object WeakSet] for weak sets", () => {
      expect(getTypeName(new WeakSet())).toBe("[object WeakSet]");
    });

    it("should return [object Error] for errors", () => {
      expect(getTypeName(new Error())).toBe("[object Error]");
      expect(getTypeName(new TypeError())).toBe("[object Error]");
    });

    it("should return [object Promise] for promises", () => {
      expect(getTypeName(Promise.resolve())).toBe("[object Promise]");
    });
  });

  describe("Function types", () => {
    it("should return [object Function] for regular functions", () => {
      expect(getTypeName(function () {})).toBe("[object Function]");
      expect(getTypeName(() => {})).toBe("[object Function]");
    });

    it("should return [object AsyncFunction] for async functions", () => {
      expect(getTypeName(async function () {})).toBe("[object AsyncFunction]");
      expect(getTypeName(async () => {})).toBe("[object AsyncFunction]");
    });

    it("should return [object GeneratorFunction] for generator functions", () => {
      expect(getTypeName(function* () {})).toBe("[object GeneratorFunction]");
    });

    it("should return [object AsyncGeneratorFunction] for async generator functions", () => {
      expect(getTypeName(async function* () {})).toBe("[object AsyncGeneratorFunction]");
    });
  });

  describe("Special objects", () => {
    it("should return [object Arguments] for arguments object", () => {
      function testFn() {
        return getTypeName(arguments);
      }
      expect(testFn()).toBe("[object Arguments]");
    });

    it("should return [object ArrayBuffer] for array buffers", () => {
      expect(getTypeName(new ArrayBuffer(8))).toBe("[object ArrayBuffer]");
    });

    it("should return appropriate type for typed arrays", () => {
      expect(getTypeName(new Uint8Array())).toBe("[object Uint8Array]");
      expect(getTypeName(new Int32Array())).toBe("[object Int32Array]");
      expect(getTypeName(new Float64Array())).toBe("[object Float64Array]");
    });
  });
});
