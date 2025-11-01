import { describe, it, expect } from "vitest";
import { flatten, flattenToArray, escapeRegexKey } from "../src/flatten";

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

describe("flattenToArray", () => {
  describe("Array data reconstruction", () => {
    it("should reconstruct simple array from flattened data", () => {
      const flatData = {
        "users.[0].name": "John",
        "users.[0].age": 30,
        "users.[1].name": "Jane",
        "users.[1].age": 25,
      };

      const result = flattenToArray(flatData, "users");

      expect(result).toEqual([
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ]);
    });

    it("should handle array with nested properties", () => {
      const flatData = {
        "items.[0].tags.[0]": "frontend",
        "items.[0].tags.[1]": "react",
        "items.[0].name": "Component Library",
        "items.[1].tags.[0]": "backend",
        "items.[1].name": "API Server",
      };

      const result = flattenToArray(flatData, "items");

      expect(result).toEqual([
        { "tags.[0]": "frontend", "tags.[1]": "react", name: "Component Library" },
        { "tags.[0]": "backend", name: "API Server" },
      ]);
    });

    it("should handle sparse arrays (missing indices)", () => {
      const flatData = {
        "list.[0].value": "first",
        "list.[2].value": "third",
        "list.[5].value": "sixth",
      };

      const result = flattenToArray(flatData, "list");

      // Function returns compact array without undefined gaps
      expect(result).toEqual([{ value: "first" }, { value: "third" }, { value: "sixth" }]);
    });

    it("should handle array with single item", () => {
      const flatData = {
        "single.[0].id": 1,
        "single.[0].active": true,
      };

      const result = flattenToArray(flatData, "single");

      expect(result).toEqual([{ id: 1, active: true }]);
    });
  });

  describe("Object data as key-value pairs", () => {
    it("should convert object properties to key-value pairs", () => {
      const flatData = {
        "config.theme": "dark",
        "config.language": "en",
        "config.debug": true,
      };

      const result = flattenToArray(flatData, "config");

      expect(result).toEqual([
        { key: "theme", value: "dark" },
        { key: "language", value: "en" },
        { key: "debug", value: true },
      ]);
    });

    it("should handle nested object paths", () => {
      const flatData = {
        "app.settings.ui.color": "blue",
        "app.settings.ui.size": "large",
        "app.settings.performance.cache": false,
      };

      const result = flattenToArray(flatData, "app.settings");

      expect(result).toEqual([
        { key: "ui.color", value: "blue" },
        { key: "ui.size", value: "large" },
        { key: "performance.cache", value: false },
      ]);
    });

    it("should handle object with various value types", () => {
      const flatData = {
        "data.string": "text",
        "data.number": 42,
        "data.boolean": true,
        "data.null": null,
        "data.undefined": undefined,
      };

      const result = flattenToArray(flatData, "data");

      expect(result).toEqual([
        { key: "string", value: "text" },
        { key: "number", value: 42 },
        { key: "boolean", value: true },
        { key: "null", value: null },
        { key: "undefined", value: undefined },
      ]);
    });
  });

  describe("Edge cases", () => {
    it("should return empty array for non-existent path", () => {
      const flatData = {
        "users.[0].name": "John",
        "config.theme": "dark",
      };

      const result = flattenToArray(flatData, "nonexistent");

      expect(result).toEqual([]);
    });

    it("should return empty array for empty data", () => {
      const result = flattenToArray({}, "any.path");

      expect(result).toEqual([]);
    });

    it("should handle path that is a substring of existing keys", () => {
      const flatData = {
        "user.name": "John",
        "users.[0].name": "Jane",
      };

      const result = flattenToArray(flatData, "user");

      expect(result).toEqual([{ key: "name", value: "John" }]);
    });

    it("should handle path with dots in array reconstruction", () => {
      const flatData = {
        "api.endpoints.[0].method": "GET",
        "api.endpoints.[0].url": "/users",
        "api.endpoints.[1].method": "POST",
        "api.endpoints.[1].url": "/users",
      };

      const result = flattenToArray(flatData, "api.endpoints");

      expect(result).toEqual([
        { method: "GET", url: "/users" },
        { method: "POST", url: "/users" },
      ]);
    });
  });

  describe("Mixed scenarios", () => {
    it("should work with complex mixed data", () => {
      const flatData = {
        "app.users.[0].profile.name": "John",
        "app.users.[0].profile.email": "john@example.com",
        "app.users.[0].settings.theme": "dark",
        "app.users.[1].profile.name": "Jane",
        "app.users.[1].profile.email": "jane@example.com",
        "app.config.version": "1.0.0",
        "app.config.debug": false,
      };

      // Extract users array
      const users = flattenToArray(flatData, "app.users");
      expect(users).toEqual([
        {
          "profile.name": "John",
          "profile.email": "john@example.com",
          "settings.theme": "dark",
        },
        {
          "profile.name": "Jane",
          "profile.email": "jane@example.com",
        },
      ]);

      // Extract config object
      const config = flattenToArray(flatData, "app.config");
      expect(config).toEqual([
        { key: "version", value: "1.0.0" },
        { key: "debug", value: false },
      ]);
    });
  });
});

describe("escapeRegexKey", () => {
  describe("Basic escaping", () => {
    it("should escape dots in keys", () => {
      expect(escapeRegexKey("user.name")).toBe("user\\.name");
      expect(escapeRegexKey("config.database.host")).toBe("config\\.database\\.host");
    });

    it("should escape square brackets in keys", () => {
      expect(escapeRegexKey("data[0]")).toBe("data\\[0\\]");
      expect(escapeRegexKey("items[index][field]")).toBe("items\\[index\\]\\[field\\]");
    });

    it("should escape curly braces in keys", () => {
      expect(escapeRegexKey("config{env}")).toBe("config\\{env\\}");
      expect(escapeRegexKey("template{var}{other}")).toBe("template\\{var\\}\\{other\\}");
    });

    it("should escape multiple different special characters", () => {
      expect(escapeRegexKey("path.to[item].{key}")).toBe("path\\.to\\[item\\]\\.\\{key\\}");
      expect(escapeRegexKey("complex.{obj}[0].field")).toBe("complex\\.\\{obj\\}\\[0\\]\\.field");
    });
  });

  describe("Edge cases", () => {
    it("should return unchanged string for keys without special characters", () => {
      expect(escapeRegexKey("normalKey")).toBe("normalKey");
      expect(escapeRegexKey("simple_key")).toBe("simple_key");
      expect(escapeRegexKey("key-with-dashes")).toBe("key-with-dashes");
      expect(escapeRegexKey("keyWithCamelCase")).toBe("keyWithCamelCase");
    });

    it("should handle empty string", () => {
      expect(escapeRegexKey("")).toBe("");
    });

    it("should handle strings with only special characters", () => {
      expect(escapeRegexKey(".")).toBe("\\.");
      expect(escapeRegexKey("[]")).toBe("\\[\\]");
      expect(escapeRegexKey("{}")).toBe("\\{\\}");
      expect(escapeRegexKey(".[]{}")).toBe("\\.\\[\\]\\{\\}");
    });

    it("should handle consecutive special characters", () => {
      expect(escapeRegexKey("..")).toBe("\\.\\.");
      expect(escapeRegexKey("[[]]")).toBe("\\[\\[\\]\\]");
      expect(escapeRegexKey("{{}}")).toBe("\\{\\{\\}\\}");
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle API endpoint paths", () => {
      expect(escapeRegexKey("api.v1.users[id].profile")).toBe("api\\.v1\\.users\\[id\\]\\.profile");
    });

    it("should handle JSON path expressions", () => {
      expect(escapeRegexKey("$.store.book[0].title")).toBe("$\\.store\\.book\\[0\\]\\.title");
    });

    it("should handle template variable names", () => {
      expect(escapeRegexKey("config.{environment}.database.{host}")).toBe(
        "config\\.\\{environment\\}\\.database\\.\\{host\\}"
      );
    });

    it("should handle CSS-like selectors", () => {
      expect(escapeRegexKey("element[data-id].class{property}")).toBe(
        "element\\[data-id\\]\\.class\\{property\\}"
      );
    });
  });

  describe("Integration with RegExp", () => {
    it("should work correctly when used in RegExp constructor", () => {
      const keyToFind = "user.settings[theme]";
      const escapedKey = escapeRegexKey(keyToFind);

      expect(escapedKey).toBe("user\\.settings\\[theme\\]");

      // The escaped key can now be safely used in RegExp
      const regex = new RegExp(`^${escapedKey}$`);
      expect(regex.test("user.settings[theme]")).toBe(true);
      expect(regex.test("user_settings_theme")).toBe(false);
    });
  });
});
