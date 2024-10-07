import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionName } from "src/adapter/types/Function";
import type { ClientCache } from "src/cache/ClientCache/types";
import {
  MockContract,
  type MockContractParams,
} from "src/client/Contract/MockContract";
import {
  type DecodeFunctionDataParams,
  Drift,
  type EncodeFunctionDataParams,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadParams,
  type WaitForTransactionParams,
  type WriteParams,
} from "src/client/Drift/Drift";
import type { OptionalKeys } from "src/utils/types";

export class MockDrift extends Drift<MockAdapter> {
  constructor() {
    super(new MockAdapter());
  }

  reset = () => this.adapter.reset();

  contract = <TAbi extends Abi, TCache extends ClientCache = ClientCache>(
    params: MockContractParams<TAbi>,
  ): MockContract<TAbi, TCache> =>
    new MockContract({
      ...params,
      adapter: this.adapter,
    });

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
  >({
    abi,
    fn,
    args,
  }: OptionalKeys<EncodeFunctionDataParams<TAbi, TFunctionName>, "args">) =>
    this.adapter.onEncodeFunctionData({
      abi,
      fn,
      args,
    });

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
    params: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) => this.adapter.onWrite(params);

  onGetSignerAddress = () => this.adapter.onGetSignerAddress();
}
