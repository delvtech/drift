import type { Abi } from "abitype";
import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Bytes } from "src/adapter/types/Abi";
import type {
  EncodeFunctionDataParams,
  ReadParams,
  ReadWriteAdapter,
  WriteParams,
} from "src/adapter/types/Adapter";
import type {
  ContractParams,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/types";
import type { BaseClient, ClientOptions } from "src/client/BaseClient";
import { MockClient } from "src/client/MockClient";
import {
  Contract,
  type ContractGetEventsArgs,
} from "src/client/contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { FunctionKey, OneOf, OptionalKeys, Pretty } from "src/utils/types";

export type MockContractConfig<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends MockClient<TAdapter, TCache> = MockClient<TAdapter, TCache>,
> = Pretty<
  Partial<ContractParams<TAbi>> &
    MockContractClientOptions<TAdapter, TCache, TClient>
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends MockClient<TAdapter, TCache> = MockClient<TAdapter, TCache>,
> extends Contract<TAbi, TAdapter, TCache, TClient> {
  constructor({
    abi = [] as unknown as TAbi,
    address = ZERO_ADDRESS,
    client,
    ...clientOptions
  }: MockContractConfig<TAbi, TAdapter, TCache, TClient> = {}) {
    super({
      abi,
      address,
      client: client ?? (new MockClient(clientOptions) as TClient),
    });
  }

  get adapter() {
    return this.client.adapter;
  }

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.adapter.reset(method);
  }

  onGetEvents<TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
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

  onDecodeFunctionData(data?: Bytes) {
    return this.adapter.onDecodeFunctionData({
      abi: this.abi,
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
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends BaseClient<TAdapter, TCache> = BaseClient<TAdapter, TCache>,
> = OneOf<
  | {
      client?: TClient;
    }
  | ({
      adapter?: TAdapter;
    } & ClientOptions<TCache>)
>;
