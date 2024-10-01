import { createDriftCache } from "src/drift/DriftCache";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("createDriftCache", () => {
  it("Invalidates reads by their read key", () => {
    const driftCache = createDriftCache();
    const params = {
      abi: IERC20.abi,
      address: "0xContract",
      fn: "allowance",
      args: {
        owner: "0xOwner",
        spender: "0xSpender",
      },
    } as const;

    const key = driftCache.readKey(params);
    const value = 100n;
    driftCache.set(key, value);

    expect(driftCache.get(key)).toEqual(value);

    driftCache.invalidateRead(params);

    expect(driftCache.get(key)).toBeUndefined();
  });

  it("Invalidates reads matching a partial read key", () => {
    const driftCache = createDriftCache();
    const params = {
      abi: IERC20.abi,
      address: "0xContract",
      fn: "allowance",
      args: {
        owner: "0xOwner",
        spender: "0xSpender",
      },
    } as const;

    const key = driftCache.readKey(params);
    const value = 100n;
    driftCache.set(key, value);

    expect(driftCache.get(key)).toEqual(value);

    driftCache.invalidateReadsMatching({ address: "0xContract" });

    expect(driftCache.get(key)).toBeUndefined();
  });
});
