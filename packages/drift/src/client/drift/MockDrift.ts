import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterParams } from "src/adapter/OxAdapter";
import type { ReadWriteAdapter } from "src/adapter/types/Adapter";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionName } from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import {
  MockContract,
  type MockContractParams,
} from "src/client/contract/MockContract";
import {
  type DecodeFunctionDataParams,
  Drift,
  type DriftParams,
  type EncodeFunctionDataParams,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadParams,
  type WaitForTransactionParams,
  type WriteParams,
} from "src/client/drift/Drift";
import type { FunctionKey, OptionalKeys } from "src/utils/types";

export type MockDriftParams<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Partial<Omit<DriftParams<TAdapter, TCache>, keyof OxAdapterParams>>;

export class MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends Drift<TAdapter, TCache> {
  constructor({
    adapter = new MockAdapter() as TAdapter,
    ...rest
  }: MockDriftParams<TAdapter, TCache> = {}) {
    super({ ...rest, adapter });
  }

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.adapter.reset(method);
  }

  contract<TAbi extends Abi, TContractCache extends SimpleCache = TCache>({
    abi,
    address,
    cache = this.cache as SimpleCache as TContractCache,
    cacheNamespace = this.cacheNamespace,
  }: Omit<MockContractParams<TAbi, TAdapter, TContractCache>, "adapter">) {
    return new MockContract({
      abi,
      adapter: this.adapter,
      address,
      cache,
      cacheNamespace,
    });
  }

  protected async initNamespace(): Promise<PropertyKey> {
    if (this.cacheNamespace) return this.cacheNamespace;
    return this.getChainId()
      .then((id) => {
        this.cacheNamespace = id;
        this.cache.preloadChainId({
          cacheNamespace: id,
          value: id,
        });
        return id;
      })
      .catch(() => "__mock__");
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
    params: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
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
