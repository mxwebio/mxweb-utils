import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { requestTimeout } from "../src/request-timeout";

describe("requestTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Basic functionality", () => {
    it("should execute callback after specified delay", () => {
      const callback = vi.fn();
      requestTimeout(callback, 1000);

      expect(callback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should execute callback immediately with 0 delay", () => {
      const callback = vi.fn();
      requestTimeout(callback, 0);

      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should execute callback immediately when no delay is provided", () => {
      const callback = vi.fn();
      requestTimeout(callback);

      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle negative delay as 0", () => {
      const callback = vi.fn();
      requestTimeout(callback, -500);

      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should execute async callback", async () => {
      const asyncCallback = vi.fn(async (): Promise<void> => {
        await Promise.resolve();
      });

      requestTimeout(asyncCallback, 500);

      expect(asyncCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(500);
      expect(asyncCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Return value", () => {
    it("should return object with rid, sid, and cancel properties", () => {
      const callback = vi.fn();
      const result = requestTimeout(callback, 1000);

      expect(result).toHaveProperty("rid");
      expect(result).toHaveProperty("sid");
      expect(result).toHaveProperty("cancel");
      expect(typeof result.cancel).toBe("function");
    });

    it("should have null rid when requestAnimationFrame is not available", () => {
      const originalRAF = global.requestAnimationFrame;
      // @ts-ignore
      global.requestAnimationFrame = undefined;

      const callback = vi.fn();
      const result = requestTimeout(callback, 1000);

      expect(result.rid).toBe(null);
      expect(result.sid).not.toBe(null);

      global.requestAnimationFrame = originalRAF;
    });

    it("should have non-null rid when requestAnimationFrame is available", () => {
      const mockRAF = vi.fn((cb) => {
        setTimeout(cb, 0);
        return 123;
      });
      const originalRAF = global.requestAnimationFrame;
      global.requestAnimationFrame = mockRAF;

      const callback = vi.fn();
      const result = requestTimeout(callback, 1000);

      expect(result.rid).not.toBe(null);
      expect(mockRAF).toHaveBeenCalled();

      global.requestAnimationFrame = originalRAF;
    });
  });

  describe("Cancel functionality", () => {
    it("should cancel timeout before execution", () => {
      const callback = vi.fn();
      const timeout = requestTimeout(callback, 1000);

      timeout.cancel();
      vi.advanceTimersByTime(1000);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should cancel timeout immediately", () => {
      const callback = vi.fn();
      const timeout = requestTimeout(callback, 0);

      timeout.cancel();
      vi.advanceTimersByTime(0);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should be safe to call cancel multiple times", () => {
      const callback = vi.fn();
      const timeout = requestTimeout(callback, 1000);

      expect(() => {
        timeout.cancel();
        timeout.cancel();
        timeout.cancel();
      }).not.toThrow();

      vi.advanceTimersByTime(1000);
      expect(callback).not.toHaveBeenCalled();
    });

    it("should cancel both rid and sid when requestAnimationFrame is used", () => {
      const mockRAF = vi.fn((cb) => {
        setTimeout(cb, 0);
        return 123;
      });
      const mockCAF = vi.fn();
      const originalRAF = global.requestAnimationFrame;
      const originalCAF = global.cancelAnimationFrame;

      global.requestAnimationFrame = mockRAF;
      global.cancelAnimationFrame = mockCAF;

      const callback = vi.fn();
      const timeout = requestTimeout(callback, 1000);

      timeout.cancel();

      expect(mockCAF).toHaveBeenCalledWith(123);

      global.requestAnimationFrame = originalRAF;
      global.cancelAnimationFrame = originalCAF;
    });

    it("should not cancel after callback has executed", () => {
      const callback = vi.fn();
      const timeout = requestTimeout(callback, 1000);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);

      timeout.cancel();
      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Multiple timeouts", () => {
    it("should handle multiple simultaneous timeouts", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      requestTimeout(callback1, 500);
      requestTimeout(callback2, 1000);
      requestTimeout(callback3, 1500);

      vi.advanceTimersByTime(500);
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).not.toHaveBeenCalled();

      vi.advanceTimersByTime(500);
      expect(callback3).toHaveBeenCalledTimes(1);
    });

    it("should cancel specific timeout without affecting others", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const timeout1 = requestTimeout(callback1, 1000);
      requestTimeout(callback2, 1000);
      requestTimeout(callback3, 1000);

      timeout1.cancel();

      vi.advanceTimersByTime(1000);
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback3).toHaveBeenCalledTimes(1);
    });
  });

  describe("Callback execution context", () => {
    it("should execute callback with proper scope", () => {
      let executedValue = "";
      const callback = () => {
        executedValue = "executed";
      };

      requestTimeout(callback, 100);
      vi.advanceTimersByTime(100);

      expect(executedValue).toBe("executed");
    });

    it("should execute callback with side effects", () => {
      const sideEffects: string[] = [];
      const callback = () => {
        sideEffects.push("effect1");
        sideEffects.push("effect2");
      };

      requestTimeout(callback, 100);
      vi.advanceTimersByTime(100);

      expect(sideEffects).toEqual(["effect1", "effect2"]);
    });

    it("should handle callback that throws error", () => {
      const callback = vi.fn(() => {
        throw new Error("Callback error");
      });

      requestTimeout(callback, 100);

      expect(() => {
        vi.advanceTimersByTime(100);
      }).toThrow("Callback error");

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Timing precision", () => {
    it("should respect exact delay timing", () => {
      const callback = vi.fn();
      requestTimeout(callback, 2500);

      vi.advanceTimersByTime(2499);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle very long delays", () => {
      const callback = vi.fn();
      requestTimeout(callback, 60000); // 1 minute

      vi.advanceTimersByTime(59999);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle fractional delays", () => {
      const callback = vi.fn();
      requestTimeout(callback, 100.5);

      vi.advanceTimersByTime(101);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge cases", () => {
    it("should handle callback that returns void", () => {
      const callback = vi.fn((): void => {
        console.log("executed");
      });
      requestTimeout(callback, 100);

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle async callback that resolves", async () => {
      const asyncCallback = vi.fn(async (): Promise<void> => {
        await Promise.resolve();
      });

      requestTimeout(asyncCallback, 100);
      vi.advanceTimersByTime(100);

      expect(asyncCallback).toHaveBeenCalledTimes(1);
    });

    it("should handle async callback that rejects", async () => {
      const asyncCallback = vi.fn(async () => {
        throw new Error("Async error");
      });

      requestTimeout(asyncCallback, 100);

      vi.advanceTimersByTime(100);
      expect(asyncCallback).toHaveBeenCalledTimes(1);
    });

    it("should handle undefined delay as 0", () => {
      const callback = vi.fn();
      requestTimeout(callback, undefined);

      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle NaN delay as 0", () => {
      const callback = vi.fn();
      requestTimeout(callback, NaN);

      vi.advanceTimersByTime(0);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("Real-world scenarios", () => {
    it("should work for debouncing pattern", () => {
      const callback = vi.fn();
      let timeout = requestTimeout(callback, 500);

      // Simulate rapid calls
      timeout.cancel();
      timeout = requestTimeout(callback, 500);

      timeout.cancel();
      timeout = requestTimeout(callback, 500);

      timeout.cancel();
      timeout = requestTimeout(callback, 500);

      vi.advanceTimersByTime(500);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should work for delayed UI updates", () => {
      const updateUI = vi.fn();
      const showNotification = () => {
        requestTimeout(() => {
          updateUI("Notification shown");
        }, 300);
      };

      showNotification();
      expect(updateUI).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(updateUI).toHaveBeenCalledWith("Notification shown");
    });

    it("should work for auto-save functionality", () => {
      const save = vi.fn();
      let saveTimeout: ReturnType<typeof requestTimeout> | null = null;

      const scheduleAutoSave = () => {
        if (saveTimeout) {
          saveTimeout.cancel();
        }
        saveTimeout = requestTimeout(save, 2000);
      };

      scheduleAutoSave();
      vi.advanceTimersByTime(1000);
      scheduleAutoSave(); // User continues typing

      vi.advanceTimersByTime(1000);
      expect(save).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(save).toHaveBeenCalledTimes(1);
    });
  });
});
