import { describe, it, expect } from "vitest";
import { decodeURISafe, encodeURISafe } from "../src/uri";

describe("decodeURISafe", () => {
  it("should decode valid URI components", () => {
    expect(decodeURISafe("Hello%20World")).toBe("Hello World");
    expect(decodeURISafe("test%40example.com")).toBe("test@example.com");
  });

  it("should handle malformed encoding gracefully", () => {
    expect(decodeURISafe("Hello%2World")).toBe("Hello%2World");
    expect(decodeURISafe("test%")).toBe("test%");
  });

  it("should decode special characters", () => {
    expect(decodeURISafe("name%3Dvalue%26other%3Ddata")).toBe("name=value&other=data");
    expect(decodeURISafe("%2F%2F%2F")).toBe("///");
  });

  it("should handle empty string", () => {
    expect(decodeURISafe("")).toBe("");
  });

  it("should use decodeURI when component=false", () => {
    const encoded = "https://example.com/path%20with%20spaces";
    expect(decodeURISafe(encoded, false)).toBe("https://example.com/path with spaces");
  });

  it("should handle strings without encoding", () => {
    expect(decodeURISafe("NoEncodingHere")).toBe("NoEncodingHere");
  });

  it("should handle multiple encoded sequences", () => {
    expect(decodeURISafe("%48%65%6C%6C%6F")).toBe("Hello");
  });
});

describe("encodeURISafe", () => {
  it("should encode special characters", () => {
    expect(encodeURISafe("Hello World")).toBe("Hello%20World");
    expect(encodeURISafe("test@example.com")).toBe("test%40example.com");
  });

  it("should encode URI components", () => {
    expect(encodeURISafe("name=value&other=data")).toBe("name%3Dvalue%26other%3Ddata");
  });

  it("should handle empty string", () => {
    expect(encodeURISafe("")).toBe("");
  });

  it("should preserve URI structure when component=false", () => {
    const uri = "https://example.com/path with spaces";
    const encoded = encodeURISafe(uri, false);
    expect(encoded).toBe("https://example.com/path%20with%20spaces");
    expect(encoded).toContain("://");
  });

  it("should encode all special characters in component mode", () => {
    const result = encodeURISafe("a/b:c?d#e", true);
    expect(result).toContain("%2F"); // /
    expect(result).toContain("%3A"); // :
    expect(result).toContain("%3F"); // ?
    expect(result).toContain("%23"); // #
  });

  it("should handle already encoded strings", () => {
    const encoded = encodeURISafe("Hello%20World");
    expect(encoded).toBe("Hello%2520World"); // Double encoded
  });
});
