import type { Abi } from "abitype";
import type {
  AdapterGetEventsParams,
  AdapterReadParams,
} from "src/adapter/types/Adapter";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { MaybePromise, DeepPartial as Partial } from "src/utils/types";

export type ClientCache<T extends SimpleCache = SimpleCache> = T & {
  // Events //

  preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName> & {
      value: readonly ContactEvent<TAbi, TEventName>[];
    },
  ): MaybePromise<void>;

  eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: DriftEventsKeyParams<TAbi, TEventName>,
  ): SerializableKey;

  // Read //

  preloadRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): MaybePromise<void>;

  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): MaybePromise<void>;

  invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: Partial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): MaybePromise<void>;

  readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: DriftReadKeyParams<TAbi, TFunctionName>,
  ): SerializableKey;

  partialReadKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: Partial<DriftReadKeyParams<TAbi, TFunctionName>>,
  ): SerializableKey;
};

export interface NameSpaceParam {
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  // TODO: This needs unit tests
  namespace?: PropertyKey;
}

export type DriftReadKeyParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = NameSpaceParam & AdapterReadParams<TAbi, TFunctionName>;

export type DriftEventsKeyParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = NameSpaceParam & AdapterGetEventsParams<TAbi, TEventName>;
