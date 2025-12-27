import { describe, it, expect } from "vitest";
import { isNullish } from "../src/is-nullish";

describe("isNullish", () => {
  describe("Nullish values", () => {
    it("should return true for null", () => {
      expect(isNullish(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isNullish(undefined)).toBe(true);
    });

    it("should return true for void 0", () => {
      expect(isNullish(void 0)).toBe(true);
    });
  });

  describe("Non-nullish values", () => {
    it("should return false for numbers", () => {
      expect(isNullish(0)).toBe(false);
      expect(isNullish(-0)).toBe(false);
      expect(isNullish(1)).toBe(false);
      expect(isNullish(NaN)).toBe(false);
      expect(isNullish(Infinity)).toBe(false);
    });

    it("should return false for strings", () => {
      expect(isNullish("")).toBe(false);
      expect(isNullish("hello")).toBe(false);
      expect(isNullish(" ")).toBe(false);
    });

    it("should return false for booleans", () => {
      expect(isNullish(false)).toBe(false);
      expect(isNullish(true)).toBe(false);
    });

    it("should return false for objects", () => {
      expect(isNullish({})).toBe(false);
      expect(isNullish({ a: 1 })).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isNullish([])).toBe(false);
      expect(isNullish([1, 2, 3])).toBe(false);
    });

    it("should return false for functions", () => {
      expect(isNullish(() => {})).toBe(false);
      expect(isNullish(function () {})).toBe(false);
    });

    it("should return false for symbols", () => {
      expect(isNullish(Symbol())).toBe(false);
      expect(isNullish(Symbol("test"))).toBe(false);
    });

    it("should return false for bigints", () => {
      expect(isNullish(BigInt(0))).toBe(false);
      expect(isNullish(0n)).toBe(false);
    });
  });

  describe("Type guard behavior", () => {
    it("should narrow type correctly when true", () => {
      const value: string | null | undefined = null;

      if (isNullish(value)) {
        // TypeScript should know value is null | undefined here
        const nullish: null | undefined = value;
        expect(nullish).toBe(null);
      }
    });

    it("should narrow type correctly when false", () => {
      const value: string | null | undefined = "hello";

      if (!isNullish(value)) {
        // TypeScript should know value is string here
        expect(value.toUpperCase()).toBe("HELLO");
      }
    });
  });

  describe("Practical use cases", () => {
    it("should work for optional parameter checking", () => {
      function greet(name?: string | null): string {
        if (isNullish(name)) {
          return "Hello, Guest!";
        }
        return `Hello, ${name}!`;
      }

      expect(greet()).toBe("Hello, Guest!");
      expect(greet(null)).toBe("Hello, Guest!");
      expect(greet(undefined)).toBe("Hello, Guest!");
      expect(greet("John")).toBe("Hello, John!");
    });

    it("should work for filtering arrays", () => {
      const values = [1, null, 2, undefined, 3, null];
      const filtered = values.filter((v) => !isNullish(v));
      expect(filtered).toEqual([1, 2, 3]);
    });

    it("should work for default value pattern", () => {
      function getValueOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
        return isNullish(value) ? defaultValue : value;
      }

      expect(getValueOrDefault(null, "default")).toBe("default");
      expect(getValueOrDefault(undefined, "default")).toBe("default");
      expect(getValueOrDefault("value", "default")).toBe("value");
      expect(getValueOrDefault(0, 10)).toBe(0);
      expect(getValueOrDefault("", "default")).toBe("");
    });
  });

  describe("Edge cases", () => {
    it("should handle document.all behavior", () => {
      // document.all is a weird object that's == null but typeof is 'undefined'
      // We don't have document.all in Node, so just ensure regular behavior
      expect(isNullish(null)).toBe(true);
      expect(isNullish(undefined)).toBe(true);
    });

    it("should handle nested property access result", () => {
      const obj: Record<string, unknown> = {};
      expect(isNullish(obj.nonExistent)).toBe(true);
      expect(isNullish(obj["also.nonExistent"])).toBe(true);
    });
  });
});
