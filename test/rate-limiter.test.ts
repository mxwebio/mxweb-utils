import { beforeEach, describe, expect, it, vi } from "vitest";
import { RateLimiter } from "../src/rate-limiter";

describe("RateLimiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("Constructor and Options", () => {
    it("should create a rate limiter with default options", () => {
      const limiter = new RateLimiter({});
      expect(limiter).toBeInstanceOf(RateLimiter);
    });

    it("should create a rate limiter with custom options", () => {
      const limiter = new RateLimiter({
        maxRequests: 5,
        interval: 1000,
      });
      expect(limiter).toBeInstanceOf(RateLimiter);
    });

    it("should use default values when options are not provided", async () => {
      const limiter = new RateLimiter({});
      const start = Date.now();

      const promises = [
        limiter.handle(() => Promise.resolve(1)),
        limiter.handle(() => Promise.resolve(2)),
      ];

      vi.advanceTimersByTime(RateLimiter.DEFAULT_DELAY);
      await vi.runAllTimersAsync();

      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2]);
    });

    it("should update options with setOptions", () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const result = limiter.setOptions({ maxRequests: 5, interval: 2000 });
      expect(result).toBe(limiter);
    });

    it("should support method chaining with setOptions", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter
        .setOptions({ maxRequests: 10, interval: 500 })
        .handle(() => Promise.resolve("chained"));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("chained");
    });
  });

  describe("Rate Limiting Behavior", () => {
    it("should execute single request immediately", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const callback = vi.fn(() => Promise.resolve("result"));

      const promise = limiter.handle(callback);
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("result");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should enforce rate limit for multiple requests", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 1000 });
      const callback = vi.fn((id: number) => Promise.resolve(id));

      const promises = [
        limiter.handle(() => callback(1)),
        limiter.handle(() => callback(2)),
        limiter.handle(() => callback(3)), // Should wait
      ];

      // First two requests execute immediately
      await vi.advanceTimersByTimeAsync(0);
      expect(callback).toHaveBeenCalledTimes(2);

      // Third request waits for interval
      await vi.advanceTimersByTimeAsync(1000);
      expect(callback).toHaveBeenCalledTimes(3);

      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2, 3]);
    });

    it("should handle multiple batches of requests", async () => {
      const limiter = new RateLimiter({ maxRequests: 3, interval: 1000 });
      const results: number[] = [];

      const promises = Array.from({ length: 9 }, (_, i) =>
        limiter.handle(async () => {
          results.push(i + 1);
          return i + 1;
        })
      );

      // First batch (3 requests)
      await vi.advanceTimersByTimeAsync(0);
      expect(results.length).toBeGreaterThanOrEqual(3);

      // Second batch (3 requests)
      await vi.advanceTimersByTimeAsync(1000);
      expect(results.length).toBeGreaterThanOrEqual(6);

      // Third batch (3 requests)
      await vi.advanceTimersByTimeAsync(1000);

      await Promise.all(promises);
      expect(results).toHaveLength(9);
      expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it("should respect interval between request batches", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 2000 });
      const timestamps: number[] = [];

      const promises = Array.from({ length: 4 }, () =>
        limiter.handle(() => {
          timestamps.push(Date.now());
          return Promise.resolve();
        })
      );

      // First batch
      await vi.advanceTimersByTimeAsync(0);
      expect(timestamps.length).toBe(2);
      const firstBatchTime = timestamps[0]!;

      // Second batch after interval
      await vi.advanceTimersByTimeAsync(2000);
      expect(timestamps.length).toBe(4);
      const secondBatchTime = timestamps[2]!;

      expect(secondBatchTime - firstBatchTime).toBeGreaterThanOrEqual(2000);

      await Promise.all(promises);
    });

    it("should handle concurrent requests properly", async () => {
      const limiter = new RateLimiter({ maxRequests: 5, interval: 1000 });
      const executionOrder: number[] = [];

      const promises = Array.from({ length: 10 }, (_, i) =>
        limiter.handle(async () => {
          executionOrder.push(i);
          return i;
        })
      );

      // First batch (5 requests)
      await vi.advanceTimersByTimeAsync(0);
      expect(executionOrder.length).toBe(5);

      // Second batch (5 requests)
      await vi.advanceTimersByTimeAsync(1000);
      expect(executionOrder.length).toBe(10);

      await Promise.all(promises);
      expect(executionOrder).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe("Error Handling", () => {
    it("should reject when callback throws error", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const error = new Error("Callback error");

      const promise = limiter.handle(() => {
        throw error;
      });

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow("Callback error");
    });

    it("should reject when callback returns rejected promise", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.reject(new Error("Async error")));

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow("Async error");
    });

    it("should handle errors without affecting other requests", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 1000 });

      const promises = [
        limiter.handle(() => Promise.resolve(1)),
        limiter.handle(() => Promise.reject(new Error("Failed"))),
        limiter.handle(() => Promise.resolve(3)),
      ];

      await vi.runAllTimersAsync();

      const results = await Promise.allSettled(promises);

      expect(results[0]).toEqual({ status: "fulfilled", value: 1 });
      expect(results[1]).toEqual({
        status: "rejected",
        reason: new Error("Failed"),
      });
      expect(results[2]).toEqual({ status: "fulfilled", value: 3 });
    });

    it("should handle multiple consecutive errors", async () => {
      const limiter = new RateLimiter({ maxRequests: 3, interval: 1000 });

      const promises = [
        limiter.handle(() => Promise.reject(new Error("Error 1"))),
        limiter.handle(() => Promise.reject(new Error("Error 2"))),
        limiter.handle(() => Promise.reject(new Error("Error 3"))),
      ];

      await vi.runAllTimersAsync();

      const results = await Promise.allSettled(promises);

      expect(results[0]).toEqual({
        status: "rejected",
        reason: new Error("Error 1"),
      });
      expect(results[1]).toEqual({
        status: "rejected",
        reason: new Error("Error 2"),
      });
      expect(results[2]).toEqual({
        status: "rejected",
        reason: new Error("Error 3"),
      });
    });

    it("should handle non-Error rejections", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.reject("String error"));

      await vi.runAllTimersAsync();

      await expect(promise).rejects.toBe("String error");
    });
  });

  describe("Return Types", () => {
    it("should return string values correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.resolve("test string"));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("test string");
    });

    it("should return number values correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.resolve(42));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe(42);
    });

    it("should return object values correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const testObject = { id: 1, name: "Test", data: [1, 2, 3] };

      const promise = limiter.handle(() => Promise.resolve(testObject));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual(testObject);
    });

    it("should return array values correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const testArray = [1, 2, 3, 4, 5];

      const promise = limiter.handle(() => Promise.resolve(testArray));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual(testArray);
    });

    it("should return null correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.resolve(null));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBeNull();
    });

    it("should return undefined correctly", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.resolve(undefined));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero maxRequests gracefully", async () => {
      const limiter = new RateLimiter({ maxRequests: 0, interval: 1000 });

      // With 0 maxRequests, should use default (1)
      const promise = limiter.handle(() => Promise.resolve("result"));

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("result");
    });

    it("should handle very small intervals", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 10 });
      const results: number[] = [];

      const promises = Array.from({ length: 4 }, (_, i) =>
        limiter.handle(() => {
          results.push(i);
          return Promise.resolve(i);
        })
      );

      await vi.advanceTimersByTimeAsync(0);
      expect(results.length).toBe(2);

      await vi.advanceTimersByTimeAsync(10);
      expect(results.length).toBe(4);

      await Promise.all(promises);
    });

    it("should handle very large intervals", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 10000 });

      const promises = [
        limiter.handle(() => Promise.resolve(1)),
        limiter.handle(() => Promise.resolve(2)),
      ];

      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(10000);

      const results = await Promise.all(promises);
      expect(results).toEqual([1, 2]);
    });

    it("should handle high maxRequests value", async () => {
      const limiter = new RateLimiter({ maxRequests: 100, interval: 1000 });
      const results: number[] = [];

      const promises = Array.from({ length: 100 }, (_, i) =>
        limiter.handle(() => {
          results.push(i);
          return Promise.resolve(i);
        })
      );

      await vi.runAllTimersAsync();

      expect(results.length).toBe(100);
      await Promise.all(promises);
    });

    it("should handle empty callback result", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => Promise.resolve());

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBeUndefined();
    });

    it("should handle synchronous callbacks", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });

      const promise = limiter.handle(() => {
        return Promise.resolve("sync result");
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toBe("sync result");
    });
  });

  describe("Real-world Scenarios", () => {
    it("should rate limit API calls", async () => {
      const limiter = new RateLimiter({ maxRequests: 3, interval: 1000 });
      const apiCalls: number[] = [];

      const mockApiCall = (id: number) =>
        limiter.handle(async () => {
          apiCalls.push(id);
          return { id, data: `Response ${id}` };
        });

      const promises = [
        mockApiCall(1),
        mockApiCall(2),
        mockApiCall(3),
        mockApiCall(4),
        mockApiCall(5),
      ];

      // First batch (3 calls)
      await vi.advanceTimersByTimeAsync(0);
      expect(apiCalls).toEqual([1, 2, 3]);

      // Second batch (2 calls)
      await vi.advanceTimersByTimeAsync(1000);
      expect(apiCalls).toEqual([1, 2, 3, 4, 5]);

      const results = await Promise.all(promises);
      expect(results).toHaveLength(5);
      expect(results[0]).toEqual({ id: 1, data: "Response 1" });
    });

    it("should handle database query rate limiting", async () => {
      const limiter = new RateLimiter({ maxRequests: 5, interval: 2000 });
      const queries: string[] = [];

      const mockDbQuery = (query: string) =>
        limiter.handle(async () => {
          queries.push(query);
          return { success: true, query };
        });

      const promises = [
        mockDbQuery("SELECT * FROM users WHERE id = 1"),
        mockDbQuery("SELECT * FROM users WHERE id = 2"),
        mockDbQuery("SELECT * FROM users WHERE id = 3"),
        mockDbQuery("SELECT * FROM users WHERE id = 4"),
        mockDbQuery("SELECT * FROM users WHERE id = 5"),
        mockDbQuery("SELECT * FROM users WHERE id = 6"),
      ];

      // First batch (5 queries)
      await vi.advanceTimersByTimeAsync(0);
      expect(queries).toHaveLength(5);

      // Second batch (1 query)
      await vi.advanceTimersByTimeAsync(2000);
      expect(queries).toHaveLength(6);

      const results = await Promise.all(promises);
      expect(results.every((r) => (r as { success: boolean }).success)).toBe(true);
    });

    it("should rate limit file downloads", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 1500 });
      const downloads: string[] = [];

      const mockDownload = (filename: string) =>
        limiter.handle(async () => {
          downloads.push(filename);
          return { filename, size: 1024, status: "completed" };
        });

      const promises = [
        mockDownload("file1.pdf"),
        mockDownload("file2.pdf"),
        mockDownload("file3.pdf"),
        mockDownload("file4.pdf"),
      ];

      // First batch (2 downloads)
      await vi.advanceTimersByTimeAsync(0);
      expect(downloads).toEqual(["file1.pdf", "file2.pdf"]);

      // Second batch (2 downloads)
      await vi.advanceTimersByTimeAsync(1500);
      expect(downloads).toEqual(["file1.pdf", "file2.pdf", "file3.pdf", "file4.pdf"]);

      const results = await Promise.all(promises);
      expect(results.every((r) => (r as { status: string }).status === "completed")).toBe(true);
    });

    it("should handle dynamic rate limit updates", async () => {
      const limiter = new RateLimiter({ maxRequests: 2, interval: 1000 });
      const executions: number[] = [];

      // First set of requests with initial limits
      const firstBatch = [
        limiter.handle(() => {
          executions.push(1);
          return Promise.resolve(1);
        }),
        limiter.handle(() => {
          executions.push(2);
          return Promise.resolve(2);
        }),
        limiter.handle(() => {
          executions.push(3);
          return Promise.resolve(3);
        }),
      ];

      await vi.advanceTimersByTimeAsync(0);
      expect(executions).toEqual([1, 2]);

      // Update rate limits
      limiter.setOptions({ maxRequests: 5, interval: 500 });

      await vi.advanceTimersByTimeAsync(1000);
      expect(executions).toEqual([1, 2, 3]);

      await Promise.all(firstBatch);
    });

    it("should handle mixed success and failure scenarios", async () => {
      const limiter = new RateLimiter({ maxRequests: 3, interval: 1000 });

      const promises = [
        limiter.handle(() => Promise.resolve({ status: 200, data: "OK" })),
        limiter.handle(() => Promise.reject(new Error("Network error"))),
        limiter.handle(() => Promise.resolve({ status: 200, data: "OK" })),
        limiter.handle(() => Promise.reject(new Error("Timeout"))),
        limiter.handle(() => Promise.resolve({ status: 200, data: "OK" })),
      ];

      await vi.runAllTimersAsync();

      const results = await Promise.allSettled(promises);

      expect(results[0]).toMatchObject({ status: "fulfilled" });
      expect(results[1]).toMatchObject({ status: "rejected" });
      expect(results[2]).toMatchObject({ status: "fulfilled" });
      expect(results[3]).toMatchObject({ status: "rejected" });
      expect(results[4]).toMatchObject({ status: "fulfilled" });
    });
  });

  describe("Performance and Timing", () => {
    it("should maintain correct timing across multiple intervals", async () => {
      const limiter = new RateLimiter({ maxRequests: 1, interval: 1000 });
      const executionOrder: number[] = [];

      const promises = Array.from({ length: 3 }, (_, i) =>
        limiter.handle(() => {
          executionOrder.push(i);
          return Promise.resolve(i);
        })
      );

      // Process all requests through the intervals
      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(1000);

      await Promise.all(promises);

      // Verify all requests were executed in order
      expect(executionOrder).toEqual([0, 1, 2]);
    });

    it("should handle rapid sequential requests", async () => {
      const limiter = new RateLimiter({ maxRequests: 10, interval: 100 });
      const count = 50;
      const results: number[] = [];

      const promises = Array.from({ length: count }, (_, i) =>
        limiter.handle(() => {
          results.push(i);
          return Promise.resolve(i);
        })
      );

      // Process all batches
      for (let i = 0; i < Math.ceil(count / 10); i++) {
        await vi.advanceTimersByTimeAsync(i === 0 ? 0 : 100);
      }

      await Promise.all(promises);
      expect(results).toHaveLength(count);
    });

    it("should not delay when under rate limit", async () => {
      const limiter = new RateLimiter({ maxRequests: 10, interval: 1000 });
      const start = Date.now();

      const promises = Array.from({ length: 5 }, (_, i) =>
        limiter.handle(() => Promise.resolve(i))
      );

      await vi.runAllTimersAsync();
      await Promise.all(promises);

      // All 5 requests should execute immediately since limit is 10
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });
});
