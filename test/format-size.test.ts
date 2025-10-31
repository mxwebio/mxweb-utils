import { describe, it, expect } from "vitest";
import { formatSize } from "../src/format-size";

describe("formatSize", () => {
  it("should format bytes correctly", () => {
    expect(formatSize(0)).toBe("0 B");
    expect(formatSize(100)).toBe("100 B");
    expect(formatSize(1023)).toBe("1023 B");
  });

  it("should format KB correctly", () => {
    expect(formatSize(1024)).toBe("1 KB");
    expect(formatSize(1536)).toBe("1.5 KB");
    expect(formatSize(10240)).toBe("10 KB");
  });

  it("should format MB correctly", () => {
    expect(formatSize(1048576)).toBe("1 MB");
    expect(formatSize(5242880)).toBe("5 MB");
    expect(formatSize(1572864)).toBe("1.5 MB");
  });

  it("should format GB correctly", () => {
    expect(formatSize(1073741824)).toBe("1 GB");
    expect(formatSize(5368709120)).toBe("5 GB");
  });

  it("should format TB correctly", () => {
    expect(formatSize(1099511627776)).toBe("1 TB");
    expect(formatSize(2199023255552)).toBe("2 TB");
  });

  it("should handle custom base units", () => {
    const customUnits = ["Bytes", "Kilobytes", "Megabytes"];
    expect(formatSize(1024, customUnits)).toBe("1 Kilobytes");
    expect(formatSize(1048576, customUnits)).toBe("1 Megabytes");
  });

  it("should handle negative values", () => {
    expect(formatSize(-1024)).toBe("0 B");
    expect(formatSize(-1048576)).toBe("0 B");
  });
});
