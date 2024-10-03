import type { Abi } from "abitype";
import type { Event, EventName } from "src/adapter/contract/types/event";
import type {
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type { GetEventsParams, ReadParams } from "src/adapter/types";
import type { SimpleCache, SimpleCacheKey } from "src/cache/SimpleCache/types";
import type { DeepPartial, MaybePromise } from "src/utils/types";

export type DriftCache<T extends SimpleCache = SimpleCache> = T & {
  // Key generation //

  partialReadKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): SimpleCacheKey;

  readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): SimpleCacheKey;

  eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName>,
  ): SimpleCacheKey;

  // Cache management //

  preloadRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): MaybePromise<void>;

  preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName> & {
      value: readonly Event<TAbi, TEventName>[];
    },
  ): MaybePromise<void>;

  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): MaybePromise<void>;

  invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DeepPartial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): MaybePromise<void>;
};

export type DriftReadKeyParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Omit<ReadParams<TAbi, TFunctionName>, "cache">;

export type DriftEventsKeyParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Omit<GetEventsParams<TAbi, TEventName>, "cache">;
