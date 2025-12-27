import { describe, it, expect } from "vitest";
import { getSettledValue } from "../src/get-settled-value";

describe("getSettledValue", () => {
  describe("Fulfilled promises", () => {
    it("should return the value from a fulfilled promise", () => {
      const settled: PromiseSettledResult<number> = {
        status: "fulfilled",
        value: 42,
      };

      const result = getSettledValue(settled);
      expect(result).toBe(42);
    });

    it("should return the value from a fulfilled promise with string", () => {
      const settled: PromiseSettledResult<string> = {
        status: "fulfilled",
        value: "success",
      };

      const result = getSettledValue(settled);
      expect(result).toBe("success");
    });

    it("should return the value from a fulfilled promise with object", () => {
      const user = { id: 1, name: "John" };
      const settled: PromiseSettledResult<typeof user> = {
        status: "fulfilled",
        value: user,
      };

      const result = getSettledValue(settled);
      expect(result).toEqual(user);
    });

    it("should return the value from a fulfilled promise with array", () => {
      const items = [1, 2, 3, 4, 5];
      const settled: PromiseSettledResult<number[]> = {
        status: "fulfilled",
        value: items,
      };

      const result = getSettledValue(settled);
      expect(result).toEqual(items);
    });

    it("should return null when fulfilled value is null", () => {
      const settled: PromiseSettledResult<null> = {
        status: "fulfilled",
        value: null,
      };

      const result = getSettledValue(settled);
      expect(result).toBe(null);
    });

    it("should return undefined when fulfilled value is undefined", () => {
      const settled: PromiseSettledResult<undefined> = {
        status: "fulfilled",
        value: undefined,
      };

      const result = getSettledValue(settled);
      expect(result).toBe(undefined);
    });
  });

  describe("Rejected promises", () => {
    it("should return null for a rejected promise when no fallback is provided", () => {
      const settled: PromiseSettledResult<number> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled);
      expect(result).toBe(null);
    });

    it("should return the fallback value for a rejected promise", () => {
      const settled: PromiseSettledResult<number> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled, 0);
      expect(result).toBe(0);
    });

    it("should return fallback string for a rejected promise", () => {
      const settled: PromiseSettledResult<string> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled, "default");
      expect(result).toBe("default");
    });

    it("should return fallback object for a rejected promise", () => {
      const fallback = { id: 0, name: "Guest" };
      const settled: PromiseSettledResult<typeof fallback> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled, fallback);
      expect(result).toEqual(fallback);
    });

    it("should return fallback array for a rejected promise", () => {
      const fallback: number[] = [];
      const settled: PromiseSettledResult<number[]> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled, fallback);
      expect(result).toEqual(fallback);
    });

    it("should return null fallback explicitly provided", () => {
      const settled: PromiseSettledResult<number> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      const result = getSettledValue(settled, null);
      expect(result).toBe(null);
    });
  });

  describe("Promise.allSettled integration", () => {
    it("should handle mixed settled results from Promise.allSettled", async () => {
      const promises = [
        Promise.resolve(1),
        Promise.reject(new Error("Failed")),
        Promise.resolve(3),
      ];

      const results = await Promise.allSettled(promises);

      expect(getSettledValue(results[0], 0)).toBe(1);
      expect(getSettledValue(results[1], 0)).toBe(0);
      expect(getSettledValue(results[2], 0)).toBe(3);
    });

    it("should extract all successful values from Promise.allSettled", async () => {
      const promises = [
        Promise.resolve("a"),
        Promise.reject(new Error("Failed")),
        Promise.resolve("c"),
        Promise.reject(new Error("Failed")),
        Promise.resolve("e"),
      ];

      const results = await Promise.allSettled(promises);
      const values = results.map((result) => getSettledValue(result, null));

      expect(values).toEqual(["a", null, "c", null, "e"]);
    });

    it("should work with fetch-like operations", async () => {
      const fetchSuccess = () => Promise.resolve({ data: "success" });
      const fetchFail = () => Promise.reject(new Error("Network error"));

      const results = await Promise.allSettled([fetchSuccess(), fetchFail(), fetchSuccess()]);

      const data = results.map((result) => getSettledValue(result, { data: "error" }));

      expect(data).toEqual([{ data: "success" }, { data: "error" }, { data: "success" }]);
    });

    it("should handle all rejected promises", async () => {
      const promises = [
        Promise.reject(new Error("Error 1")),
        Promise.reject(new Error("Error 2")),
        Promise.reject(new Error("Error 3")),
      ];

      const results = await Promise.allSettled(promises);
      const values = results.map((result) => getSettledValue(result, -1));

      expect(values).toEqual([-1, -1, -1]);
    });

    it("should handle all fulfilled promises", async () => {
      const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];

      const results = await Promise.allSettled(promises);
      const values = results.map((result) => getSettledValue(result, 0));

      expect(values).toEqual([1, 2, 3]);
    });
  });

  describe("Type safety", () => {
    it("should preserve type information for fulfilled values", () => {
      interface User {
        id: number;
        name: string;
      }

      const settled: PromiseSettledResult<User> = {
        status: "fulfilled",
        value: { id: 1, name: "John" },
      };

      const result = getSettledValue(settled, { id: 0, name: "Guest" });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("name");
    });

    it("should handle union types", () => {
      type Result = string | number | null;

      const settled1: PromiseSettledResult<Result> = {
        status: "fulfilled",
        value: "text",
      };
      const settled2: PromiseSettledResult<Result> = {
        status: "fulfilled",
        value: 42,
      };
      const settled3: PromiseSettledResult<Result> = {
        status: "rejected",
        reason: new Error("Failed"),
      };

      expect(getSettledValue(settled1, null)).toBe("text");
      expect(getSettledValue(settled2, null)).toBe(42);
      expect(getSettledValue(settled3, null)).toBe(null);
    });
  });

  describe("Edge cases", () => {
    it("should handle boolean values", () => {
      const settled: PromiseSettledResult<boolean> = {
        status: "fulfilled",
        value: false,
      };

      const result = getSettledValue(settled, true);
      expect(result).toBe(false);
    });

    it("should handle zero as a valid value", () => {
      const settled: PromiseSettledResult<number> = {
        status: "fulfilled",
        value: 0,
      };

      const result = getSettledValue(settled, -1);
      expect(result).toBe(0);
    });

    it("should handle empty string as a valid value", () => {
      const settled: PromiseSettledResult<string> = {
        status: "fulfilled",
        value: "",
      };

      const result = getSettledValue(settled, "default");
      expect(result).toBe("");
    });

    it("should handle empty array as a valid value", () => {
      const settled: PromiseSettledResult<any[]> = {
        status: "fulfilled",
        value: [],
      };

      const result = getSettledValue(settled, [1, 2, 3]);
      expect(result).toEqual([]);
    });

    it("should handle empty object as a valid value", () => {
      const settled: PromiseSettledResult<object> = {
        status: "fulfilled",
        value: {},
      };

      const result = getSettledValue(settled, { default: true });
      expect(result).toEqual({});
    });
  });
});
