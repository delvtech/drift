import type { Abi } from "abitype";
import type { Event, EventName } from "src/adapter/contract/types/Event";
import type {
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/Function";
import type { SimpleCache, SimpleCacheKey } from "src/cache/SimpleCache/types";
import type {
  DriftGetEventsParams,
  DriftReadParams,
} from "src/drift/types/DriftContract";
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
