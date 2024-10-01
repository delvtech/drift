import type { Abi } from "abitype";
import isMatch from "lodash.ismatch";
import type { SimpleCache, SimpleCacheKey } from "src/cache/types/SimpleCache";
import { createSimpleCacheKey } from "src/cache/utils/createSimpleCacheKey";
import type { Event, EventName } from "src/contract/types/Event";
import type { FunctionName, FunctionReturn } from "src/contract/types/Function";
import type { DriftGetEventsParams, DriftReadParams } from "src/drift/types";
import { createLruSimpleCache } from "src/exports";
import { extendInstance } from "src/utils/extendInstance";
import type { DeepPartial } from "src/utils/types";

export type DriftCache<T extends SimpleCache = SimpleCache> = T & {
  // Key Generators //

  partialReadKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): SimpleCacheKey;

  readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): SimpleCacheKey;

  eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName>,
  ): SimpleCacheKey;

  // Cache Management //

  preloadRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): void | Promise<void>;

  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): void | Promise<void>;

  invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): void | Promise<void>;

  preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName> & {
      value: readonly Event<TAbi, TEventName>[];
    },
  ): void | Promise<void>;
};

export type DriftReadKeyParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Omit<DriftReadParams<TAbi, TFunctionName>, "cache">;

export type DriftEventsKeyParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Omit<DriftGetEventsParams<TAbi, TEventName>, "cache">;

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

    preloadRead: ({ value, ...params }) =>
      cache.set(driftCache.readKey(params as DriftReadKeyParams), value),

    invalidateRead: (params) => cache.delete(driftCache.readKey(params)),

    invalidateReadsMatching(params) {
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

    preloadEvents: ({ value, ...params }) =>
      cache.set(driftCache.eventsKey(params), value),
  });

  return driftCache;
}
