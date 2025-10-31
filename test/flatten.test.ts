import { describe, it, expect } from "vitest";
import { flatten } from "../src/flatten";

describe("flatten", () => {
  it("should flatten nested object with dot notation", () => {
    const input = {
      user: {
        name: "John",
        address: {
          city: "New York",
          zip: "10001",
        },
      },
    };
    const result = flatten(input);
    expect(result).toEqual({
      "user.name": "John",
      "user.address.city": "New York",
      "user.address.zip": "10001",
    });
  });

  it("should handle arrays", () => {
    const input = {
      items: [1, 2, 3],
      nested: {
        arr: ["a", "b"],
      },
    };
    const result = flatten(input);
    expect(result).toEqual({
      "items.0": 1,
      "items.1": 2,
      "items.2": 3,
      "nested.arr.0": "a",
      "nested.arr.1": "b",
    });
  });

  it("should handle empty object", () => {
    const result = flatten({});
    expect(result).toEqual({});
  });

  it("should handle flat object", () => {
    const input = { a: 1, b: 2 };
    const result = flatten(input);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should handle null and undefined values", () => {
    const input = {
      a: null,
      b: undefined,
      c: {
        d: null,
      },
    };
    const result = flatten(input);
    expect(result).toEqual({
      a: null,
      b: undefined,
      "c.d": null,
    });
  });
});
