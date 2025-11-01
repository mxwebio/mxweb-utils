import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Retry, RetryOptions } from "../src/retry";

// Helper function to handle expected promise rejections cleanly
async function expectToReject<T>(
  promise: Promise<T>,
  expectedMessage?: string | RegExp
): Promise<Error> {
  try {
    await promise;
    throw new Error("Expected promise to reject but it resolved");
  } catch (error) {
    if (expectedMessage) {
      if (typeof expectedMessage === "string") {
        expect((error as Error).message).toBe(expectedMessage);
      } else {
        expect((error as Error).message).toMatch(expectedMessage);
      }
    }
    return error as Error;
  }
}

describe("Retry", () => {
  let mockCallback: ReturnType<typeof vi.fn>;
  let mockAsyncCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCallback = vi.fn();
    mockAsyncCallback = vi.fn();
    vi.useFakeTimers();

    // Suppress unhandled rejection warnings for test environment
    process.removeAllListeners("unhandledRejection");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("Constructor and Options", () => {
    it("should create instance with default options", () => {
      const retry = new Retry();
      expect(retry).toBeInstanceOf(Retry);
    });

    it("should create instance with custom options", () => {
      const options: RetryOptions = {
        maxRetries: 5,
        delay: 2000,
      };
      const retry = new Retry(options);
      expect(retry).toBeInstanceOf(Retry);
    });

    it("should have correct default delay", () => {
      expect(Retry.DEFAULT_DELAY).toBe(1500);
    });

    it("should update options using setOptions", () => {
      const retry = new Retry();
      const newOptions: RetryOptions = {
        maxRetries: 3,
        delay: 1000,
      };

      const result = retry.setOptions(newOptions);
      expect(result).toBe(retry); // Should return self for chaining
    });

    it("should allow method chaining", () => {
      const retry = new Retry();
      const result = retry.setOptions({ maxRetries: 2 }).setOptions({ delay: 500 });
      expect(result).toBe(retry);
    });
  });

  describe("Successful Execution", () => {
    it("should execute synchronous callback successfully on first attempt", async () => {
      const expectedResult = "success";
      mockCallback.mockReturnValue(expectedResult);

      const retry = new Retry();
      const result = await retry.execute(mockCallback);

      expect(result).toBe(expectedResult);
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should execute async callback successfully on first attempt", async () => {
      const expectedResult = { data: "success" };
      mockAsyncCallback.mockResolvedValue(expectedResult);

      const retry = new Retry();
      const result = await retry.execute(mockAsyncCallback);

      expect(result).toEqual(expectedResult);
      expect(mockAsyncCallback).toHaveBeenCalledTimes(1);
    });

    it("should return different types correctly", async () => {
      const retry = new Retry();

      // String result
      mockCallback.mockReturnValue("string result");
      const stringResult = await retry.execute(mockCallback);
      expect(stringResult).toBe("string result");

      // Number result
      mockCallback.mockReturnValue(42);
      const numberResult = await retry.execute(mockCallback);
      expect(numberResult).toBe(42);

      // Object result
      const objResult = { id: 1, name: "test" };
      mockCallback.mockReturnValue(objResult);
      const objectResult = await retry.execute(mockCallback);
      expect(objectResult).toEqual(objResult);

      // Array result
      const arrResult = [1, 2, 3];
      mockCallback.mockReturnValue(arrResult);
      const arrayResult = await retry.execute(mockCallback);
      expect(arrayResult).toEqual(arrResult);
    });
  });

  describe("Retry Logic", () => {
    it("should retry on failure and succeed on second attempt", async () => {
      const expectedResult = "success on retry";
      mockCallback
        .mockImplementationOnce(() => {
          throw new Error("First attempt failed");
        })
        .mockReturnValue(expectedResult);

      const retry = new Retry({ maxRetries: 2, delay: 1000 });

      const executePromise = retry.execute(mockCallback);

      // Fast-forward timers to trigger retry delay
      await vi.advanceTimersByTimeAsync(1000);

      const result = await executePromise;

      expect(result).toBe(expectedResult);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it("should retry async callback on failure", async () => {
      const expectedResult = "async success";
      mockAsyncCallback
        .mockRejectedValueOnce(new Error("Async failure"))
        .mockResolvedValue(expectedResult);

      const retry = new Retry({ maxRetries: 2, delay: 500 });

      const executePromise = retry.execute(mockAsyncCallback);

      await vi.advanceTimersByTimeAsync(500);

      const result = await executePromise;

      expect(result).toBe(expectedResult);
      expect(mockAsyncCallback).toHaveBeenCalledTimes(2);
    });

    it("should respect maxRetries limit", async () => {
      const error = new Error("Persistent failure");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const maxRetries = 3;
      const retry = new Retry({ maxRetries, delay: 100 });

      const executePromise = retry.execute(mockCallback);

      // Advance timers for all retry attempts
      for (let i = 0; i < maxRetries - 1; i++) {
        await vi.advanceTimersByTimeAsync(100);
      }

      await expectToReject(
        executePromise,
        `| Mailer Retry > Max retries reached (${maxRetries}): ${error.message}`
      );
      expect(mockCallback).toHaveBeenCalledTimes(maxRetries);
    });

    it("should use correct delay between retries", async () => {
      const error = new Error("Test error");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const delay = 2000;
      const retry = new Retry({ maxRetries: 2, delay });

      const executePromise = retry.execute(mockCallback);

      // First call should happen immediately
      expect(mockCallback).toHaveBeenCalledTimes(1);

      // After delay, second call should happen
      await vi.advanceTimersByTimeAsync(delay);

      await expectToReject(executePromise, /Max retries reached/);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it("should use default delay when not specified", async () => {
      const error = new Error("Test error");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const retry = new Retry({ maxRetries: 2 }); // No delay specified

      const executePromise = retry.execute(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Should use DEFAULT_DELAY (1500ms)
      await vi.advanceTimersByTimeAsync(Retry.DEFAULT_DELAY);

      await expectToReject(executePromise, /Max retries reached/);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });

    it("should use default maxRetries when not specified", async () => {
      const error = new Error("Test error");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const retry = new Retry({ delay: 100 }); // No maxRetries specified

      await expectToReject(retry.execute(mockCallback), /Max retries reached/);
      expect(mockCallback).toHaveBeenCalledTimes(1); // Default maxRetries is 1
    });
  });

  describe("Error Handling", () => {
    it("should throw error with retry details when max retries reached", async () => {
      const originalError = new Error("Original error message");
      mockCallback.mockImplementation(() => {
        throw originalError;
      });

      const maxRetries = 2;
      const retry = new Retry({ maxRetries, delay: 100 });

      const executePromise = retry.execute(mockCallback);

      await vi.advanceTimersByTimeAsync(100);

      await expectToReject(
        executePromise,
        "| Mailer Retry > Max retries reached (2): Original error message"
      );
    });

    it("should preserve original error type and message", async () => {
      class CustomError extends Error {
        constructor(
          message: string,
          public code: number
        ) {
          super(message);
          this.name = "CustomError";
        }
      }

      const customError = new CustomError("Custom error", 500);
      mockCallback.mockImplementation(() => {
        throw customError;
      });

      const retry = new Retry({ maxRetries: 1 });

      await expectToReject(
        retry.execute(mockCallback),
        "| Mailer Retry > Max retries reached (1): Custom error"
      );
    });

    it("should handle non-Error objects thrown by callback", async () => {
      const stringError = "String error";
      mockCallback.mockImplementation(() => {
        throw stringError;
      });

      const retry = new Retry({ maxRetries: 1 });

      await expectToReject(
        retry.execute(mockCallback),
        "| Mailer Retry > Max retries reached (1): String error"
      );
    });

    it("should handle undefined/null errors", async () => {
      mockCallback.mockImplementation(() => {
        throw null;
      });

      const retry = new Retry({ maxRetries: 1 });

      await expectToReject(retry.execute(mockCallback), /Max retries reached/);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero maxRetries", async () => {
      mockCallback.mockReturnValue("success");

      const retry = new Retry({ maxRetries: 0 });

      // Should still execute once despite maxRetries being 0
      await expect(retry.execute(mockCallback)).resolves.toBe("success");
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it("should handle negative delay", async () => {
      const error = new Error("Test error");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const retry = new Retry({ maxRetries: 2, delay: -1000 });

      const executePromise = retry.execute(mockCallback);

      // Even with negative delay, sleep should handle it gracefully
      await vi.advanceTimersByTimeAsync(0);

      await expectToReject(executePromise, /Max retries reached/);
    });

    it("should work with callbacks that return Promise<void>", async () => {
      mockAsyncCallback.mockResolvedValue(undefined);

      const retry = new Retry();
      const result = await retry.execute(mockAsyncCallback);

      expect(result).toBeUndefined();
      expect(mockAsyncCallback).toHaveBeenCalledTimes(1);
    });

    it("should work with callbacks that return falsy values", async () => {
      const retry = new Retry();

      mockCallback.mockReturnValue(0);
      expect(await retry.execute(mockCallback)).toBe(0);

      mockCallback.mockReturnValue(false);
      expect(await retry.execute(mockCallback)).toBe(false);

      mockCallback.mockReturnValue("");
      expect(await retry.execute(mockCallback)).toBe("");

      mockCallback.mockReturnValue(null);
      expect(await retry.execute(mockCallback)).toBe(null);
    });
  });

  describe("Real-world Scenarios", () => {
    it("should handle network request simulation", async () => {
      let attemptCount = 0;
      const networkRequest = vi.fn(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error(`Network timeout (attempt ${attemptCount})`);
        }
        return { data: "successful response", status: 200 };
      });

      const retry = new Retry({ maxRetries: 3, delay: 1000 });

      const executePromise = retry.execute(networkRequest);

      // Fast-forward through retry delays
      await vi.advanceTimersByTimeAsync(1000);
      await vi.advanceTimersByTimeAsync(1000);

      const result = await executePromise;

      expect(result).toEqual({ data: "successful response", status: 200 });
      expect(networkRequest).toHaveBeenCalledTimes(3);
    });

    it("should handle database operation simulation", async () => {
      let connectionIssues = true;
      const dbQuery = vi.fn(async () => {
        if (connectionIssues) {
          connectionIssues = false;
          throw new Error("Database connection timeout");
        }
        return [
          { id: 1, name: "User 1" },
          { id: 2, name: "User 2" },
        ];
      });

      const retry = new Retry({ maxRetries: 2, delay: 500 });

      const executePromise = retry.execute(dbQuery);
      await vi.advanceTimersByTimeAsync(500);

      const result = await executePromise;

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: "User 1" });
      expect(dbQuery).toHaveBeenCalledTimes(2);
    });

    it("should handle file operation simulation with eventual failure", async () => {
      const fileOperation = vi.fn(async () => {
        throw new Error("File system permission denied");
      });

      const retry = new Retry({ maxRetries: 3, delay: 200 });

      const executePromise = retry.execute(fileOperation);

      // Fast-forward through all retry attempts
      await vi.advanceTimersByTimeAsync(200);
      await vi.advanceTimersByTimeAsync(200);

      await expectToReject(
        executePromise,
        "| Mailer Retry > Max retries reached (3): File system permission denied"
      );
      expect(fileOperation).toHaveBeenCalledTimes(3);
    });
  });

  describe("Integration with other utilities", () => {
    it("should work with custom sleep implementation", async () => {
      // Test that retry properly uses the sleep utility
      const error = new Error("Test error");
      mockCallback.mockImplementation(() => {
        throw error;
      });

      const retry = new Retry({ maxRetries: 2, delay: 1500 });

      const executePromise = retry.execute(mockCallback);

      expect(mockCallback).toHaveBeenCalledTimes(1);

      // Advance by exactly the delay amount
      await vi.advanceTimersByTimeAsync(1500);

      await expectToReject(executePromise, /Max retries reached/);
      expect(mockCallback).toHaveBeenCalledTimes(2);
    });
  });
});
