import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
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
  type DriftOptions,
  type EncodeFunctionDataParams,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadParams,
  type WaitForTransactionParams,
  type WriteParams,
} from "src/client/drift/Drift";
import type { OptionalKeys } from "src/utils/types";

export class MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends Drift<TAdapter, TCache> {
  constructor(
    adapter: TAdapter = new MockAdapter() as TAdapter,
    options?: DriftOptions<TCache>,
  ) {
    super(adapter, options);
  }

  reset = () => this.adapter.reset();

  contract = <TAbi extends Abi, TContractCache extends SimpleCache = TCache>({
    abi,
    address,
    cache = this.cache as SimpleCache as TContractCache,
    cacheNamespace = this.cacheNamespace,
  }: Omit<MockContractParams<TAbi, TAdapter, TContractCache>, "adapter">) => {
    return new MockContract({
      abi,
      adapter: this.adapter,
      address,
      cache,
      cacheNamespace,
    });
  };

  protected async initCacheNamespace(): Promise<PropertyKey> {
    return (
      this.cacheNamespace ??
      this.getChainId()
        .then((id) => {
          this.cacheNamespace = id;
          return id;
        })
        .catch(() => "__mock__")
    );
  }

  onGetChainId = () => this.adapter.onGetChainId();

  onGetBlock = (params?: Partial<GetBlockParams>) =>
    this.adapter.onGetBlock(params);

  onGetBalance = (params?: Partial<GetBalanceParams>) =>
    this.adapter.onGetBalance(params);

  onGetTransaction = (params?: Partial<GetTransactionParams>) =>
    this.adapter.onGetTransaction(params);

  onWaitForTransaction = (params?: Partial<WaitForTransactionParams>) =>
    this.adapter.onWaitForTransaction(params);

  onEncodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params?: OptionalKeys<
      EncodeFunctionDataParams<TAbi, TFunctionName>,
      "args"
    >,
  ) => this.adapter.onEncodeFunctionData(params);

  onDecodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<DecodeFunctionDataParams<TAbi, TFunctionName>, "data">,
  ) => this.adapter.onDecodeFunctionData(params);

  onGetEvents = <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OptionalKeys<GetEventsParams<TAbi, TEventName>, "address">,
  ) => this.adapter.onGetEvents(params);

  onRead = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: OptionalKeys<ReadParams<TAbi, TFunctionName>, "args" | "address">,
  ) => this.adapter.onRead(params);

  onSimulateWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) => this.adapter.onSimulateWrite(params);

  onWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params?: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) => this.adapter.onWrite(params);

  onGetSignerAddress = () => this.adapter.onGetSignerAddress();
}
