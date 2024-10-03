import type { Abi } from "abitype";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/contract/types/contract";
import type { Event, EventName } from "src/adapter/contract/types/event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type { NetworkAdapter } from "src/adapter/network/types/NetworkAdapter";
import type { TransactionReceipt } from "src/adapter/network/types/Transaction";
import type { Address, Bytes, TransactionHash } from "src/types";
import type { EmptyObject } from "src/utils/types";

export interface ReadAdapter extends NetworkAdapter {
  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<Event<TAbi, TEventName>[]>;

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: WriteParams<TAbi, TFunctionName>,
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
  ): FunctionReturn<TAbi, TFunctionName>;
}

export interface ReadWriteAdapter extends ReadAdapter {
  getSignerAddress(): Promise<Address>;

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<TransactionHash>;
}

export type Adapter = ReadAdapter | ReadWriteAdapter;

export type ArgsParam<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = FunctionArgs<TAbi, TFunctionName> extends EmptyObject
  ? {
      args?: FunctionArgs<TAbi, TFunctionName>;
    }
  : Abi extends TAbi
    ? {
        args?: FunctionArgs<TAbi, TFunctionName>;
      }
    : {
        args: FunctionArgs<TAbi, TFunctionName>;
      };

export type ReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = ContractReadOptions & {
  abi: TAbi;
  address: Address;
  fn: TFunctionName;
} & ArgsParam<TAbi, TFunctionName>;

export interface GetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> extends ContractGetEventsOptions<TAbi, TEventName> {
  abi: TAbi;
  address: Address;
  event: TEventName;
}

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractWriteOptions & {
  abi: TAbi;
  address: Address;
  fn: TFunctionName;
  onMined?: (receipt?: TransactionReceipt) => void;
} & ArgsParam<TAbi, TFunctionName>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & ArgsParam<TAbi, TFunctionName>;

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
