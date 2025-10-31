import { describe, it, expect } from "vitest";
import { sleep } from "../src/sleep";

describe("sleep", () => {
  it("should delay execution for specified time", async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some margin
    expect(elapsed).toBeLessThan(150);
  });

  it("should resolve immediately for 0ms", async () => {
    const start = Date.now();
    await sleep(0);
    const end = Date.now();
    expect(end - start).toBeLessThan(10);
  });
});
