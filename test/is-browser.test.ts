import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isBrowser } from "../src/is-browser";

describe("isBrowser", () => {
  const originalWindow = global.window;

  afterEach(() => {
    // Restore original window
    if (originalWindow !== undefined) {
      global.window = originalWindow;
    } else {
      // @ts-ignore
      delete global.window;
    }
  });

  describe("Node.js environment", () => {
    it("should return false when window is undefined", () => {
      // @ts-ignore
      delete global.window;
      expect(isBrowser()).toBe(false);
    });
  });

  describe("Browser environment", () => {
    it("should return true when window and document exist", () => {
      // @ts-ignore - mocking browser environment
      global.window = {
        document: {} as Document,
      };
      expect(isBrowser()).toBe(true);
    });

    it("should return false when window exists but document is missing", () => {
      // @ts-ignore
      global.window = {};
      expect(isBrowser()).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should return true when window.document is null", () => {
      // @ts-ignore - mocking browser environment with null document
      global.window = {
        document: null as unknown as Document,
      };
      // hasOwnProperty returns true because the property exists
      expect(isBrowser()).toBe(true);
    });

    it("should handle window being null", () => {
      // @ts-ignore
      global.window = null;
      expect(isBrowser()).toBe(false);
    });
  });
});
