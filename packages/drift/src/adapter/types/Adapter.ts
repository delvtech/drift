import type { Abi } from "abitype";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { Network } from "src/adapter/types/Network";
import type { TransactionReceipt } from "src/adapter/types/Transaction";
import type { AnyObject, EmptyObject } from "src/utils/types";

export interface Adapter extends ReadAdapter, Partial<WriteAdapter> {}

export interface ReadAdapter extends Network {
  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]>;

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes;

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName>;
}

export interface WriteAdapter {
  getSignerAddress(): Promise<Address>;

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<Hash>;
}

export interface ReadWriteAdapter extends ReadAdapter, WriteAdapter {}

export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
}

export type FunctionArgsParam<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Abi extends TAbi
  ? {
      args?: AnyObject;
    }
  : EmptyObject extends FunctionArgs<TAbi, TFunctionName>
    ? {
        args?: EmptyObject;
      }
    : {
        args: FunctionArgs<TAbi, TFunctionName>;
      };

export type ReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & FunctionArgsParam<TAbi, TFunctionName> &
  ContractReadOptions;

export interface GetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> extends ContractParams<TAbi>,
    ContractGetEventsOptions<TAbi, TEventName> {
  event: TEventName;
}

export type SimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & FunctionArgsParam<TAbi, TFunctionName> &
  ContractWriteOptions;

export interface OnMinedParam {
  onMined?: (receipt?: TransactionReceipt) => void;
}

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = SimulateWriteParams<TAbi, TFunctionName> & OnMinedParam;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & FunctionArgsParam<TAbi, TFunctionName>;

export interface DecodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> {
  abi: TAbi;
  data: Bytes;
  // TODO: This is optional and only used to determine the return type, but is
  // there another way to get the return type based on the function selector in
  // the data?
  fn?: TFunctionName;
}
