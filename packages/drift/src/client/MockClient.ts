import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterConfig } from "src/adapter/OxAdapter";
import type {
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionName } from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type { SimpleCache } from "src/cache/types";
import { BaseClient, type ClientConfig } from "src/client/BaseClient";
import type { FunctionKey, OptionalKeys } from "src/utils/types";

export type MockClientConfig<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Partial<Omit<ClientConfig<TAdapter, TCache>, keyof OxAdapterConfig>>;

export class MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends BaseClient<TAdapter, TCache> {
  constructor({
    adapter = new MockAdapter() as TAdapter,
    ...rest
  }: MockClientConfig<TAdapter, TCache> = {}) {
    super({ ...rest, adapter });
  }

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.adapter.reset(method);
  }

  async getId() {
    return super.getId().catch(() => {
      this._id = "__mock__";
      return this._id;
    });
  }

  onGetChainId() {
    return this.adapter.onGetChainId();
  }

  onGetBlockNumber() {
    return this.adapter.onGetBlockNumber();
  }

  onGetBlock(params?: Partial<GetBlockParams>) {
    return this.adapter.onGetBlock(params);
  }

  onGetBalance(params?: Partial<GetBalanceParams>) {
    return this.adapter.onGetBalance(params);
  }

  onGetTransaction(params?: Partial<GetTransactionParams>) {
    return this.adapter.onGetTransaction(params);
  }

  onWaitForTransaction(params?: Partial<WaitForTransactionParams>) {
    return this.adapter.onWaitForTransaction(params);
  }

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params?: OptionalKeys<
      EncodeFunctionDataParams<TAbi, TFunctionName>,
      "args"
    >,
  ) {
    return this.adapter.onEncodeFunctionData(params);
  }

  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<DecodeFunctionDataParams<TAbi, TFunctionName>, "data">,
  ) {
    return this.adapter.onDecodeFunctionData(params);
  }

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OptionalKeys<GetEventsParams<TAbi, TEventName>, "address">,
  ) {
    return this.adapter.onGetEvents(params);
  }

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: OptionalKeys<ReadParams<TAbi, TFunctionName>, "args" | "address">) {
    return this.adapter.onRead(params);
  }

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<
      SimulateWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) {
    return this.adapter.onSimulateWrite(params);
  }

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params?: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) {
    return this.adapter.onWrite(params);
  }

  onGetSignerAddress() {
    return this.adapter.onGetSignerAddress();
  }
}
