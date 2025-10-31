import { describe, it, expect } from "vitest";
import { interpolate } from "../src/interpolate";

describe("interpolate", () => {
  it("should replace single placeholder", () => {
    const template = "Hello, {name}!";
    const params = { name: "John" };
    expect(interpolate(template, params)).toBe("Hello, John!");
  });

  it("should replace multiple placeholders", () => {
    const template = "{greeting}, {name}! You have {count} messages.";
    const params = { greeting: "Hello", name: "Alice", count: "5" };
    expect(interpolate(template, params)).toBe("Hello, Alice! You have 5 messages.");
  });

  it("should replace missing parameters with empty string", () => {
    const template = "Hello, {name}! You are {age} years old.";
    const params = { name: "Bob" };
    expect(interpolate(template, params)).toBe("Hello, Bob! You are  years old.");
  });

  it("should handle no placeholders", () => {
    const template = "Hello, World!";
    const params = { name: "John" };
    expect(interpolate(template, params)).toBe("Hello, World!");
  });

  it("should handle empty string", () => {
    expect(interpolate("", { name: "John" })).toBe("");
  });

  it("should replace empty params with empty string", () => {
    const template = "Hello, {name}!";
    expect(interpolate(template, {})).toBe("Hello, !");
  });

  it("should handle numeric values", () => {
    const template = "You have {count} items";
    const params = { count: 42 };
    expect(interpolate(template, params)).toBe("You have 42 items");
  });

  it("should handle same placeholder multiple times", () => {
    const template = "{name} loves {name}";
    const params = { name: "JavaScript" };
    expect(interpolate(template, params)).toBe("JavaScript loves JavaScript");
  });
});
