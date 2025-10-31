import { describe, it, expect } from "vitest";
import { pascalToKebab } from "../src/pascal-to-kebab";

describe("pascalToKebab", () => {
  it("should convert PascalCase to kebab-case", () => {
    expect(pascalToKebab("PascalCase")).toBe("pascal-case");
    expect(pascalToKebab("HelloWorld")).toBe("hello-world");
  });

  it("should convert camelCase to kebab-case", () => {
    expect(pascalToKebab("camelCase")).toBe("camel-case");
    expect(pascalToKebab("myVariableName")).toBe("my-variable-name");
  });

  it("should handle single word", () => {
    expect(pascalToKebab("Hello")).toBe("hello");
    expect(pascalToKebab("hello")).toBe("hello");
  });

  it("should handle consecutive uppercase letters", () => {
    expect(pascalToKebab("HTTPSConnection")).toBe("https-connection");
    expect(pascalToKebab("XMLParser")).toBe("xml-parser");
  });

  it("should handle empty string", () => {
    expect(pascalToKebab("")).toBe("");
  });

  it("should handle already kebab-case string", () => {
    expect(pascalToKebab("already-kebab")).toBe("already-kebab");
  });

  it("should handle numbers", () => {
    expect(pascalToKebab("Test123")).toBe("test123");
    expect(pascalToKebab("Version2Update")).toBe("version2-update");
  });

  it("should handle single uppercase letter", () => {
    expect(pascalToKebab("A")).toBe("a");
  });
});
