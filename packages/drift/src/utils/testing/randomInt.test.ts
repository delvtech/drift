import { randomInt } from "src/utils/testing/randomInt";
import { describe, expect, it } from "vitest";

describe("randomInt", () => {
  it("generates positive integers", { repeats: 1_000 }, () => {
    const int = randomInt();
    expect(int).toBeGreaterThanOrEqual(0);
    expect(int).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    expect(Number.isSafeInteger(int)).toBe(true);
  });

  it("generates negative integers", { repeats: 1_000 }, () => {
    const int = randomInt(Number.MIN_SAFE_INTEGER, -1);
    expect(int).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
    expect(int).toBeLessThanOrEqual(-1);
    expect(Number.isSafeInteger(int)).toBe(true);
  });

  it("generates integers within a specified range", { repeats: 1_000 }, () => {
    const int = randomInt(-100, 100);
    expect(int).toBeGreaterThanOrEqual(-100);
    expect(int).toBeLessThanOrEqual(100);
    expect(Number.isSafeInteger(int)).toBe(true);
  });

  it("returns the same value for zero range", () => {
    expect(randomInt(5, 5)).toBe(5);
  });

  it("can generate boundary values", () => {
    const results = Array.from({ length: 1000 }, () => randomInt(0, 1));
    expect(results).toContain(0);
    expect(results).toContain(1);
    expect(results.every((num) => num === 0 || num === 1)).toBe(true);
  });
});
