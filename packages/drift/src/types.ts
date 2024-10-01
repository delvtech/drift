import type { Abi } from "abitype";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/contract/types/Contract";
import type { EventName } from "src/adapter/contract/types/Event";
import type {
  FunctionArgs,
  FunctionName,
} from "src/adapter/contract/types/Function";
import type { TransactionReceipt } from "src/adapter/network/Transaction";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { EmptyObject } from "src/utils/types";

export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: string;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export type ReadParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = {
  fn: TFunctionName;
} & (FunctionArgs<TAbi, TFunctionName> extends EmptyObject
  ? {
      args?: FunctionArgs<TAbi, TFunctionName>;
    }
  : {
      args: FunctionArgs<TAbi, TFunctionName>;
    }) &
  ContractReadOptions &
  ContractParams<TAbi>;

export interface GetEventsParams<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> extends ContractGetEventsOptions<TAbi, TEventName>,
    ContractParams<TAbi> {
  event: TEventName;
}

export type WriteParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractWriteOptions & {
  abi: TAbi;
  address: string;
  fn: TFunctionName;
  onMined?: (receipt?: TransactionReceipt) => void;
} & (FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? {
        args?: FunctionArgs<TAbi, TFunctionName>;
      }
    : {
        args: FunctionArgs<TAbi, TFunctionName>;
      });

export type EncodeFunctionDataParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & (FunctionArgs<TAbi, TFunctionName> extends EmptyObject
  ? {
      args?: FunctionArgs<TAbi, TFunctionName>;
    }
  : {
      args: FunctionArgs<TAbi, TFunctionName>;
    });

export interface DecodeFunctionDataParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> {
  abi: TAbi;
  data: string;
  fn?: TFunctionName;
}
