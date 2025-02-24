import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type {
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
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/types";
import type { ClientOptions } from "src/client/Client";
import { type MockClient, createMockClient } from "src/client/MockClient";
import { ReadWriteContract } from "src/client/contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { Eval, FunctionKey, OneOf, PartialBy } from "src/utils/types";

export type MockContractConfig<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends MockClient<TAdapter, TCache> = MockClient<TAdapter, TCache>,
> = Eval<
  Partial<ContractParams<TAbi>> &
    MockContractClientOptions<TAdapter, TCache, TClient>
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends MockClient<TAdapter, TCache> = MockClient<TAdapter, TCache>,
> extends ReadWriteContract<
  TAbi,
  TClient["adapter"],
  TClient["cache"]["store"],
  TClient
> {
  constructor({
    abi = [] as unknown as TAbi,
    address = ZERO_ADDRESS,
    client,
    ...clientOptions
  }: MockContractConfig<TAbi, TAdapter, TCache, TClient> = {}) {
    super({
      abi,
      address,
      client: (client ?? createMockClient(clientOptions)) as TClient,
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
    } as PartialBy<ReadParams<TAbi, TFunctionName>, "args" | "address">);
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
    } as PartialBy<WriteParams<TAbi, TFunctionName>, "args" | "address">);
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
    } as PartialBy<WriteParams<TAbi, TFunctionName>, "args" | "address">);
  }
}

export type MockContractClientOptions<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends MockClient<TAdapter, TCache> = MockClient<TAdapter, TCache>,
> = OneOf<
  | {
      client?: TClient;
    }
  | ({
      adapter?: TAdapter;
    } & ClientOptions<TCache>)
>;
