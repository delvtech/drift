import type { Bytes } from "src/adapter/types/Abi";
import type {
  Adapter,
  MulticallCallResult,
  MulticallCalls,
  MulticallParams,
  MulticallReturn,
} from "src/adapter/types/Adapter";
import type { ClientCache } from "src/client/cache/ClientCache";

export interface CachedMulticallParams<
  TCalls extends readonly unknown[] = unknown[],
  TAllowFailure extends boolean = boolean,
> {
  adapter: Adapter;
  cache: ClientCache;
  params: MulticallParams<TCalls, TAllowFailure>;
}

export async function cachedMulticall<
  TCalls extends readonly unknown[],
  TAllowFailure extends boolean = true,
>({
  adapter,
  cache,
  params: { calls, multicallAddress, allowFailure, ...callOptions },
}: CachedMulticallParams<TCalls, TAllowFailure>): Promise<
  NoInfer<MulticallReturn<TCalls, TAllowFailure>>
> {
  const uncachedCallIndices = new Map<number, number>();
  const unCachedCalls: MulticallCalls = [];

  // Check the cache for each call to ensure we only fetch uncached calls.
  const results: unknown[] = await Promise.all(
    calls.map(async (call, i) => {
      let cached: unknown | undefined;

      if (call.abi) {
        // Check read cache
        cached = await cache.getRead({
          ...call,
          block: callOptions?.block,
        });
      } else {
        // Check call cache
        cached = await cache.getCall({
          ...call,
          ...callOptions,
        });
      }

      if (cached !== undefined) {
        return allowFailure === false
          ? cached
          : ({
              success: true,
              value: cached,
            } satisfies MulticallCallResult);
      }

      uncachedCallIndices.set(i, unCachedCalls.length);
      unCachedCalls.push(call);
      return undefined;
    }),
  );

  if (!unCachedCalls.length) {
    return results as MulticallReturn<TCalls, TAllowFailure>;
  }

  const fetched = await adapter.multicall({
    calls: unCachedCalls,
    multicallAddress,
    allowFailure,
    ...callOptions,
  });

  // Merge cached results with fetched results and return in the same order.
  return Promise.all(
    results.map(async (result, i) => {
      // If the value was cached, return it directly.
      if (result !== undefined) return result;

      const index = uncachedCallIndices.get(i)!;
      const { abi, address, fn, args, to, data } = unCachedCalls[index]!;
      const fetchedResult = fetched[index]!;
      const fetchedValue =
        allowFailure === false
          ? fetchedResult
          : (fetchedResult as MulticallCallResult).value;

      // Cache the newly fetched value.
      if (fetchedValue !== undefined) {
        if (abi) {
          await cache.preloadRead({
            abi,
            address,
            fn,
            args,
            block: callOptions?.block,
            value: fetchedValue,
          });
        } else {
          await cache.preloadCall({
            to,
            data,
            ...callOptions,
            preloadValue: fetchedValue as Bytes,
          });
        }
      }

      return fetchedResult;
    }),
  ) as MulticallReturn<TCalls, TAllowFailure>;
}
