import type { Abi } from "abitype";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { Network } from "src/adapter/types/Network";
import type { TransactionReceipt } from "src/adapter/types/Transaction";
import type { Address, Bytes, TransactionHash } from "src/types";
import type { AnyObject, EmptyObject } from "src/utils/types";

export type Adapter = ReadAdapter | ReadWriteAdapter;

export interface ReadAdapter extends Network {
  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: AdapterGetEventsParams<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]>;

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: AdapterReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>): Bytes;

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: AdapterDecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName>;
}

export interface ReadWriteAdapter extends ReadAdapter {
  getSignerAddress(): Promise<Address>;

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>): Promise<TransactionHash>;
}

export type AdapterArgsParam<
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

export type AdapterReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> = {
  abi: TAbi;
  address: Address;
  fn: TFunctionName;
} & AdapterArgsParam<TAbi, TFunctionName> &
  ContractReadOptions;

export interface AdapterGetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> extends ContractGetEventsOptions<TAbi, TEventName> {
  abi: TAbi;
  address: Address;
  event: TEventName;
}

export interface OnMinedParam {
  onMined?: (receipt?: TransactionReceipt) => void;
}

export type AdapterWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = {
  abi: TAbi;
  address: Address;
  fn: TFunctionName;
} & AdapterArgsParam<TAbi, TFunctionName> &
  ContractWriteOptions &
  OnMinedParam;

export type AdapterEncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & AdapterArgsParam<TAbi, TFunctionName>;

export interface AdapterDecodeFunctionDataParams<
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
