import { describe, it, expect, beforeEach, vi } from "vitest";
import { getEnv } from "../src/get-env";

describe("getEnv", () => {
  beforeEach(() => {
    // Clear environment variables
    delete process.env.TEST_VAR;
    delete process.env.NEXT_PUBLIC_TEST;
  });

  it("should return environment variable value", () => {
    vi.stubEnv("TEST_VAR", "test-value");
    expect(getEnv("TEST_VAR")).toBe("test-value");
  });

  it("should return default value when env var is not set", () => {
    expect(getEnv("NON_EXISTENT", "default")).toBe("default");
  });

  it("should return undefined when env var is not set and no default", () => {
    expect(getEnv("NON_EXISTENT")).toBeUndefined();
  });

  it("should handle empty string values", () => {
    vi.stubEnv("EMPTY_VAR", "");
    expect(getEnv("EMPTY_VAR")).toBe("");
  });

  it("should work with NEXT_PUBLIC_ prefix", () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    expect(getEnv("NEXT_PUBLIC_API_URL")).toBe("https://api.example.com");
  });
});
