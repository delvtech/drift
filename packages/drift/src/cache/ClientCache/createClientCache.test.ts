import { createClientCache } from "src/cache/ClientCache/createClientCache";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

describe("createClientCache", () => {
  it("Invalidates reads by their read key", () => {
    const cache = createClientCache();
    const params = {
      abi: erc20.abi,
      address: "0xContract",
      fn: "allowance",
      args: {
        owner: "0xOwner",
        spender: "0xSpender",
      },
    } as const;
    const key = cache.readKey(params);
    const value = 100n;

    cache.set(key, value);
    expect(cache.get(key)).toEqual(value);

    cache.invalidateRead(params);
    expect(cache.get(key)).toBeUndefined();
  });

  it("Invalidates reads matching a partial read key", () => {
    const cache = createClientCache();
    const params = {
      abi: erc20.abi,
      address: "0xContract",
      fn: "allowance",
      args: {
        owner: "0xOwner",
        spender: "0xSpender",
      },
    } as const;
    const key = cache.readKey(params);
    const value = 100n;

    cache.set(key, value);
    expect(cache.get(key)).toEqual(value);

    cache.invalidateReadsMatching({ address: "0xContract" });
    expect(cache.get(key)).toBeUndefined();
  });

  it("Preloads reads by their key", async () => {
    const cache = createClientCache();
    const params = {
      abi: erc20.abi,
      address: "0xContract",
      fn: "allowance",
      args: {
        owner: "0xOwner",
        spender: "0xSpender",
      },
    } as const;
    const key = cache.readKey(params);
    const value = 100n;

    cache.preloadRead({ value, ...params });
    expect(cache.get(key)).toEqual(value);
  });

  it("Preloads events by their key", async () => {
    const cache = createClientCache();
    const params = {
      abi: erc20.abi,
      address: "0xContract",
      event: "Approval",
    } as const;
    const key = cache.eventsKey(params);
    const value = [
      {
        eventName: "Approval",
        args: {
          owner: "0xOwner",
          spender: "0xSpender",
          value: 100n,
        },
      },
    ] as const;

    cache.preloadEvents({ value, ...params });
    expect(cache.get(key)).toEqual(value);
  });
});
