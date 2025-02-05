import type { Abi } from "abitype";
import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Bytes } from "src/adapter/types/Abi";
import type {
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  ReadParams,
  ReadWriteAdapter,
  WriteParams,
} from "src/adapter/types/Adapter";
import type {
  ContractGetEventsOptions,
  ContractParams,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventName } from "src/adapter/types/Event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/types";
import type { AdapterType, CacheType, ClientOptions } from "src/client/Client";
import { type MockClient, createMockClient } from "src/client/MockClient";
import { ReadWriteContract } from "src/client/contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { Eval, FunctionKey, OneOf, OptionalKeys } from "src/utils/types";

export type MockContractConfig<
  TAbi extends Abi = Abi,
  TClient extends MockClient | undefined = MockClient | undefined,
  TAdapter extends MockAdapter | undefined =
    | AdapterType<TClient, MockAdapter>
    | undefined,
  TCache extends SimpleCache | undefined = CacheType<TClient> | undefined,
> = Eval<
  Partial<ContractParams<TAbi>> &
    MockContractClientOptions<TClient, TAdapter, TCache>
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TClient extends MockClient = MockClient,
> extends ReadWriteContract<TAbi, TClient> {
  constructor({
    abi = [] as unknown as TAbi,
    address = ZERO_ADDRESS,
    client,
    ...clientOptions
  }: MockContractConfig<TAbi, TClient> = {}) {
    super({
      abi,
      address,
      client:
        client ?? (createMockClient(clientOptions as ClientOptions) as TClient),
    });
  }

  get adapter() {
    return this.client.adapter;
  }

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.adapter.reset(method);
  }

  onGetEvents<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ) {
    return this.adapter.onGetEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });
  }

  onRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ) {
    return this.adapter.onRead({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<ReadParams<TAbi, TFunctionName>, "args" | "address">);
  }

  onSimulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.adapter.onSimulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">);
  }

  onEncodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) {
    return this.adapter.onEncodeFunctionData({
      abi: this.abi,
      fn,
      args,
    } as EncodeFunctionDataParams<TAbi, TFunctionName>);
  }

  onEncodeFunctionReturn<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    value?: FunctionReturn<TAbi, TFunctionName>,
  ) {
    return this.adapter.onEncodeFunctionReturn({
      abi: this.abi,
      fn,
      value,
    } as EncodeFunctionReturnParams<TAbi, TFunctionName>);
  }

  onDecodeFunctionData<TFunctionName extends FunctionName<TAbi>>(data?: Bytes) {
    return this.adapter.onDecodeFunctionData<TAbi, TFunctionName>({
      abi: this.abi,
      data,
    });
  }

  onDecodeFunctionReturn<TFunctionName extends FunctionName<TAbi>>(
    fn: TFunctionName,
    data?: Bytes,
  ) {
    return this.adapter.onDecodeFunctionReturn({
      abi: this.abi,
      fn,
      data,
    });
  }

  onGetSignerAddress() {
    return this.adapter.onGetSignerAddress();
  }

  onWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.adapter.onWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">);
  }
}

export type MockContractClientOptions<
  TClient extends MockClient | undefined = MockClient | undefined,
  TAdapter extends MockAdapter | undefined =
    | AdapterType<TClient, MockAdapter>
    | undefined,
  TCache extends SimpleCache | undefined = CacheType<TClient> | undefined,
> = OneOf<
  | {
      client?: TClient;
    }
  | ({
      adapter?: TAdapter;
    } & ClientOptions<TCache>)
>;
