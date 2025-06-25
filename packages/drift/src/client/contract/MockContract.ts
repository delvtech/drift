import type {
  MockAdapter,
  OnReadParams,
  OnSimulateWriteParams,
  OnWriteParams,
} from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type {
  GetEventsOptions,
  MulticallOptions,
  ReadOptions,
  ReadWriteAdapter,
  WriteOptions,
} from "src/adapter/types/Adapter";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type { TransactionOptions } from "src/adapter/types/Transaction";
import {
  type ContractBaseOptions,
  ReadWriteContract,
} from "src/client/contract/Contract";
import {
  createMockClient,
  type MockClient,
  type MockClientOptions,
} from "src/client/MockClient";
import { ZERO_ADDRESS } from "src/constants";
import type { Store } from "src/store/Store";
import type { Eval, FunctionKey, OneOf } from "src/utils/types";

export type MockContractOptions<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
  TClient extends MockClient<TAdapter, TStore> = MockClient<TAdapter, TStore>,
> = Eval<
  Partial<ContractBaseOptions<TAbi>> &
    MockContractClientOptions<TAdapter, TStore, TClient>
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
  TClient extends MockClient<TAdapter, TStore> = MockClient<TAdapter, TStore>,
> extends ReadWriteContract<
  TAbi,
  TClient["adapter"],
  TClient["cache"]["store"],
  TClient
> {
  constructor({
    abi = [] as unknown as TAbi,
    address = ZERO_ADDRESS,
    epochBlock,
    client,
    ...clientOptions
  }: MockContractOptions<TAbi, TAdapter, TStore, TClient> = {}) {
    super({
      abi,
      address,
      epochBlock,
      client: (client ?? createMockClient(clientOptions)) as TClient,
    });
  }

  get adapter() {
    return this.client.adapter;
  }

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.adapter.reset(method);
  }

  onMulticall<
    TCalls extends ContractOnMulticallCall<TAbi>[],
    TAllowFailure extends boolean = true,
  >({
    calls,
    ...options
  }: ContractOnMulticallParams<TAbi, TCalls, TAllowFailure>) {
    return this.adapter.onMulticall<
      { [K in keyof TCalls]: { abi: TAbi; fn: NonNullable<TCalls[K]["fn"]> } },
      TAllowFailure
    >({
      calls: calls?.map((call) => ({
        abi: this.abi,
        address: this.address,
        ...call,
      })) as any,
      ...options,
    });
  }

  onGetEvents<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: GetEventsOptions<TAbi, TEventName>,
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
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>,
    options?: ReadOptions,
  ) {
    return this.adapter.onRead({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OnReadParams<TAbi, TFunctionName>);
  }

  onSimulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>,
    options?: TransactionOptions,
  ) {
    return this.adapter.onSimulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OnSimulateWriteParams<TAbi, TFunctionName>);
  }

  onGetSignerAddress() {
    return this.adapter.onGetSignerAddress();
  }

  onWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    fn?: TFunctionName,
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>,
    options?: WriteOptions,
  ) {
    return this.adapter.onWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OnWriteParams<TAbi, TFunctionName>);
  }
}

export type MockContractClientOptions<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
  TClient extends MockClient<TAdapter, TStore> = MockClient<TAdapter, TStore>,
> = OneOf<
  | {
      client?: TClient;
    }
  | MockClientOptions<TAdapter, TStore>
>;

type ContractOnMulticallCall<TAbi extends Abi> = {
  [F in FunctionName<TAbi>]: {
    fn?: F;
    args?: Partial<FunctionArgs<TAbi, F>>;
  };
}[FunctionName<TAbi>];

export type ContractOnMulticallParams<
  TAbi extends Abi = Abi,
  TCalls extends
    ContractOnMulticallCall<TAbi>[] = ContractOnMulticallCall<TAbi>[],
  TAllowFailure extends boolean = boolean,
> = {
  calls: TCalls;
} & MulticallOptions<TAllowFailure>;
