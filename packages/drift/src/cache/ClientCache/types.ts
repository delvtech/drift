import type { Abi } from "abitype";
import type {
  AdapterGetEventsParams,
  AdapterReadParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import type { NetworkGetBlockParams } from "src/adapter/types/Network";
import type { Transaction } from "src/adapter/types/Transaction";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { Address, TransactionHash } from "src/types";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { MaybePromise, DeepPartial as Partial } from "src/utils/types";

export type ClientCache<T extends SimpleCache = SimpleCache> = T & {
  // Chain ID //

  preloadChainId(
    params: ChainIdKeyParams & {
      value: number;
    },
  ): MaybePromise<void>;

  chainIdKey(params?: ChainIdKeyParams): SerializableKey;

  // Block //

  preloadBlock(
    params: BlockKeyParams & {
      value: Block;
    },
  ): MaybePromise<void>;

  blockKey(params?: BlockKeyParams): SerializableKey;

  // Balance //

  preloadBalance(
    params: BalanceKeyParams & {
      value: bigint;
    },
  ): MaybePromise<void>;

  invalidateBalance(params: BalanceKeyParams): MaybePromise<void>;

  balanceKey(params: BalanceKeyParams): SerializableKey;

  // Transaction //

  preloadTransaction(
    params: TransactionKeyParams & {
      value: Transaction;
    },
  ): MaybePromise<void>;

  transactionKey(params: TransactionKeyParams): SerializableKey;

  // Events //

  preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: EventsKeyParams<TAbi, TEventName> & {
      value: readonly ContactEvent<TAbi, TEventName>[];
    },
  ): MaybePromise<void>;

  eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: EventsKeyParams<TAbi, TEventName>,
  ): SerializableKey;

  // Read //

  preloadRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: ReadKeyParams<TAbi, TFunctionName> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): MaybePromise<void>;

  invalidateRead<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: ReadKeyParams<TAbi, TFunctionName>,
  ): MaybePromise<void>;

  invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: Partial<ReadKeyParams<TAbi, TFunctionName>>): MaybePromise<void>;

  readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: ReadKeyParams<TAbi, TFunctionName>,
  ): SerializableKey;

  partialReadKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: Partial<ReadKeyParams<TAbi, TFunctionName>>,
  ): SerializableKey;
};

export interface NameSpaceParam {
  /**
   * A namespace to distinguish this instance from others in the cache.
   */
  // TODO: This needs unit tests
  cacheNamespace?: PropertyKey;
}

export interface ChainIdKeyParams extends NameSpaceParam {}

export type BlockKeyParams = NameSpaceParam & NetworkGetBlockParams;

export type BalanceKeyParams = BlockKeyParams & {
  address: Address;
};

export interface TransactionKeyParams extends NameSpaceParam {
  hash: TransactionHash;
}

export type ReadKeyParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = NameSpaceParam & AdapterReadParams<TAbi, TFunctionName>;

export type EventsKeyParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = NameSpaceParam & AdapterGetEventsParams<TAbi, TEventName>;
