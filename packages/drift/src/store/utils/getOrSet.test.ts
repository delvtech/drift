import { LruStore } from "src/store/LruStore";
import { getOrSet } from "src/store/utils/getOrSet";
import { describe, expect, it, vi } from "vitest";

describe("getOrSet", () => {
  it("caches falsy values", async () => {
    const store = new LruStore();
    const key = "falsy";
    const fn = vi.fn(() => 0);

    const result1 = await getOrSet({ store, key, fn });
    const result2 = await getOrSet({ store, key, fn });

    expect(result1).toBe(0);
    expect(result2).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not cache undefined values", async () => {
    const store = new LruStore();
    const key = "undefined";
    const fn = vi.fn(() => undefined);

    const result1 = await getOrSet({ store, key, fn });
    const result2 = await getOrSet({ store, key, fn });

    expect(result1).toBeUndefined();
    expect(result2).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
