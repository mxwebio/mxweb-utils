import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../src/storage";

describe("Storage - localStorage", () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    // Mock window object
    vi.stubGlobal("window", {
      localStorage: localStorageMock,
    });
  });

  it("should set and get string value", () => {
    const store = storage.local;
    store.setItem("key", "value");
    expect(store.getItem("key")).toBe("value");
  });

  it("should set and get object value", () => {
    const store = storage.local;
    const obj = { name: "John", age: 30 };
    store.setItem("user", obj);
    expect(store.getItem("user")).toEqual(obj);
  });

  it("should set and get array value", () => {
    const store = storage.local;
    const arr = [1, 2, 3, 4, 5];
    store.setItem("numbers", arr);
    expect(store.getItem("numbers")).toEqual(arr);
  });

  it("should return null for non-existent key", () => {
    const store = storage.local;
    expect(store.getItem("nonexistent")).toBeNull();
  });

  it("should remove item", () => {
    const store = storage.local;
    store.setItem("key", "value");
    expect(store.getItem("key")).toBe("value");
    store.removeItem("key");
    expect(store.getItem("key")).toBeNull();
  });

  it("should handle null values", () => {
    const store = storage.local;
    store.setItem("null", null);
    expect(store.getItem("null")).toBeNull();
  });

  it("should handle boolean values", () => {
    const store = storage.local;
    store.setItem("true", true);
    store.setItem("false", false);
    expect(store.getItem("true")).toBe(true);
    expect(store.getItem("false")).toBe(false);
  });

  it("should handle number values", () => {
    const store = storage.local;
    store.setItem("number", 42);
    store.setItem("float", 3.14);
    expect(store.getItem("number")).toBe(42);
    expect(store.getItem("float")).toBe(3.14);
  });

  it("should handle nested objects", () => {
    const store = storage.local;
    const nested = {
      user: {
        name: "John",
        address: {
          city: "NYC",
          zip: "10001",
        },
      },
    };
    store.setItem("nested", nested);
    expect(store.getItem("nested")).toEqual(nested);
  });
});

describe("Storage - sessionStorage", () => {
  beforeEach(() => {
    const sessionStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    vi.stubGlobal("window", {
      sessionStorage: sessionStorageMock,
    });
  });

  it("should work with sessionStorage", () => {
    const store = storage.session;
    store.setItem("session-key", "session-value");
    expect(store.getItem("session-key")).toBe("session-value");
  });

  it("should remove item from sessionStorage", () => {
    const store = storage.session;
    store.setItem("key", "value");
    store.removeItem("key");
    expect(store.getItem("key")).toBeNull();
  });
});

describe("Storage - factory", () => {
  beforeEach(() => {
    const localStorageMock = {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] || null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      },
    };

    vi.stubGlobal("window", {
      localStorage: localStorageMock,
    });
  });

  it("should create storage from type", () => {
    const store = storage.from("localStorage");
    store.setItem("key", "value");
    expect(store.getItem("key")).toBe("value");
  });
});
