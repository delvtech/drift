import type { Abi } from "abitype";
import type {
  AdapterReadContract,
  AdapterReadWriteContract,
  ContractGetEventsArgs,
  ContractReadArgs,
} from "src/adapter/contract/types/contract";
import type { EventName } from "src/adapter/contract/types/event";
import type { Event } from "src/adapter/contract/types/event";
import type {
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type {
  DriftCache,
  DriftReadKeyParams,
} from "src/cache/DriftCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { Address } from "src/types";
import type { MaybePromise } from "src/utils/types";

export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export type ReadContract<
  TAbi extends Abi = Abi,
  TAdapterContract extends
    AdapterReadContract<TAbi> = AdapterReadContract<TAbi>,
  TCache extends DriftCache = DriftCache,
> = TAdapterContract & {
  cache: TCache;

  // Key generation //

  partialReadKey<TFunctionName extends FunctionName<TAbi>>(
    ...args: Partial<ContractReadArgs<TAbi, TFunctionName>>
  ): string;

  readKey<TFunctionName extends FunctionName<TAbi>>(
    ...args: ContractReadArgs<TAbi, TFunctionName>
  ): string;

  eventsKey<TEventName extends EventName<TAbi>>(
    ...args: ContractGetEventsArgs<TAbi, TEventName>
  ): string;

  // Cache management //

  preloadRead<TFunctionName extends FunctionName<TAbi>>(
    params: ContractReadKeyParams<TAbi, TFunctionName> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): MaybePromise<void>;

  preloadEvents<TEventName extends EventName<TAbi>>(
    ...args: ContractGetEventsArgs<TAbi, TEventName> & {
      value: readonly Event<TAbi, TEventName>[];
    }
  ): MaybePromise<void>;

  invalidateRead<TFunctionName extends FunctionName<TAbi>>(
    ...args: ContractReadArgs<TAbi, TFunctionName>
  ): MaybePromise<void>;

  invalidateReadsMatching<TFunctionName extends FunctionName<TAbi>>(
    ...args: Partial<ContractReadArgs<TAbi, TFunctionName>>
  ): MaybePromise<void>;

  invalidateAllReads(): void;
};

export interface ReadWriteContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi>,
    AdapterReadWriteContract<TAbi> {}

export type ContractReadKeyParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> = Omit<DriftReadKeyParams<TAbi, TFunctionName>, keyof ContractParams>;
