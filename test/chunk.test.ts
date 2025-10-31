import { describe, it, expect } from "vitest";
import { chunk } from "../src/chunk";

describe("chunk", () => {
  it("should split array into chunks of specified size", () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const result = chunk(array, 3);
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it("should return empty array for empty input", () => {
    const result = chunk([], 2);
    expect(result).toEqual([]);
  });

  it("should handle size larger than array length", () => {
    const array = [1, 2, 3];
    const result = chunk(array, 10);
    expect(result).toEqual([[1, 2, 3]]);
  });

  it("should handle size of 1", () => {
    const array = [1, 2, 3];
    const result = chunk(array, 1);
    expect(result).toEqual([[1], [2], [3]]);
  });

  it("should handle exact division", () => {
    const array = [1, 2, 3, 4, 5, 6];
    const result = chunk(array, 2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it("should clamp size to 1 for 0 or negative values", () => {
    const array = [1, 2, 3];
    expect(chunk(array, 0)).toEqual([[1], [2], [3]]);
    expect(chunk(array, -1)).toEqual([[1], [2], [3]]);
  });
});
