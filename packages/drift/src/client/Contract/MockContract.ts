import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { Bytes } from "src/adapter/types/Abi";
import type {
  AdapterEncodeFunctionDataParams,
  AdapterReadParams,
  AdapterWriteParams,
} from "src/adapter/types/Adapter";
import type {
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import {
  Contract,
  type ContractGetEventsArgs,
  type ContractParams,
} from "src/client/contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { OptionalKeys } from "src/utils/types";

export type MockContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = OptionalKeys<ContractParams<TAbi, TAdapter, TCache>, "address" | "adapter">;

export class MockContract<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends Contract<TAbi, TAdapter, TCache> {
  constructor({
    abi,
    adapter = new MockAdapter() as TAdapter,
    address = ZERO_ADDRESS,
    cache,
    cacheNamespace,
  }: MockContractParams<TAbi, TAdapter, TCache>) {
    super({
      abi,
      adapter,
      address,
      cache,
      cacheNamespace,
    });
  }

  reset = () => this.adapter.reset();

  onGetEvents = <TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ) =>
    this.adapter.onGetEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });

  onRead = <TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ) =>
    this.adapter.onRead({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<
      AdapterReadParams<TAbi, TFunctionName>,
      "args" | "address"
    >);

  onSimulateWrite = <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) =>
    this.adapter.onSimulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >);

  onEncodeFunctionData = <TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) =>
    this.adapter.onEncodeFunctionData({
      abi: this.abi,
      fn,
      args,
    } as AdapterEncodeFunctionDataParams<TAbi, TFunctionName>);

  onDecodeFunctionData = (data?: Bytes) =>
    this.adapter.onDecodeFunctionData({
      abi: this.abi,
      data,
    });

  onGetSignerAddress = () => this.adapter.onGetSignerAddress();

  onWrite = <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) =>
    this.adapter.onWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    } as OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >);
}
