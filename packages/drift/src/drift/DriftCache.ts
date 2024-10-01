import type { Abi } from "abitype";
import isMatch from "lodash.ismatch";
import type { SimpleCache, SimpleCacheKey } from "src/cache/types/SimpleCache";
import { createSimpleCacheKey } from "src/cache/utils/createSimpleCacheKey";
import type { EventName } from "src/contract/types/Event";
import type { FunctionName } from "src/contract/types/Function";
import type { DriftGetEventsParams, DriftReadParams } from "src/drift/types";
import { createLruSimpleCache } from "src/exports";
import { extendInstance } from "src/utils/extendInstance";
import type { DeepPartial } from "src/utils/types";

export type DriftCache<T extends SimpleCache = SimpleCache> = T & {
  // Key Management //

  partialReadKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DeepPartial<Omit<DriftReadParams<TAbi, TFunctionName>, "cache">>,
  ): SimpleCacheKey;

  readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: Omit<DriftReadParams<TAbi, TFunctionName>, "cache">,
  ): SimpleCacheKey;

  eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: Omit<DriftGetEventsParams<TAbi, TEventName>, "cache">,
  ): SimpleCacheKey;

  // Cache Management //

  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadParams<TAbi, TFunctionName>,
  ): void;

  invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: DeepPartial<DriftReadParams<TAbi, TFunctionName>>): void;
};

/**
 * Extends a {@linkcode SimpleCache} with additional API methods for use with
 * Drift clients.
 */
export function createDriftCache<T extends SimpleCache>(
  cache: T = createLruSimpleCache({ max: 500 }) as T,
): DriftCache<T> {
  const driftCache: DriftCache<T> = extendInstance<
    T,
    Omit<DriftCache, keyof SimpleCache>
  >(cache, {
    partialReadKey: ({ abi, namespace, ...params }) =>
      createSimpleCacheKey([namespace, "read", params]),

    readKey: (params) => driftCache.partialReadKey(params),

    eventsKey: ({ abi, namespace, ...params }) =>
      createSimpleCacheKey([namespace, "events", params]),

    invalidateRead: ({ cache: targetCache = cache, ...params }) =>
      targetCache.delete(driftCache.readKey(params)),

    invalidateReadsMatching({ cache: targetCache = cache, ...params }) {
      const sourceKey = driftCache.partialReadKey(params);

      for (const [key] of cache.entries) {
        if (
          typeof key === "object" &&
          isMatch(key, sourceKey as SimpleCacheKey[])
        ) {
          cache.delete(key);
        }
      }
    },
  });

  return driftCache;
}
