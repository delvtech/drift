import type { Abi } from "abitype";
import type { Adapter, ReadWriteAdapter } from "src/adapter/types";
import type { SimpleCache } from "src/cache/types/SimpleCache";
import type {
  CachedReadContract,
  CachedReadWriteContract,
} from "src/contract/types/CachedContract";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/contract/types/Contract";
import type { EventName } from "src/contract/types/Event";
import type { FunctionArgs, FunctionName } from "src/contract/types/Function";
import type { TransactionReceipt } from "src/network/types/Transaction";
import type { EmptyObject } from "src/utils/types";

export type DriftContract<
  TAbi extends Abi,
  TAdapter extends Adapter = Adapter,
> = TAdapter extends ReadWriteAdapter
  ? CachedReadWriteContract<TAbi>
  : CachedReadContract<TAbi>;

export interface DriftContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: string;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

export type DriftReadParams<
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
  DriftContractParams<TAbi>;

export interface DriftGetEventsParams<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
> extends ContractGetEventsOptions<TAbi, TEventName>,
    DriftContractParams<TAbi> {
  event: TEventName;
}

export type DriftWriteParams<
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

export type DriftEncodeFunctionDataParams<
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

export interface DriftDecodeFunctionDataParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
> {
  abi: TAbi;
  data: string;
  fn?: TFunctionName;
}
