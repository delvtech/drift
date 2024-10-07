import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventName } from "src/adapter/types/Event";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type { ClientCache } from "src/cache/ClientCache/types";
import {
  type ContractGetEventsArgs,
  type ContractParams,
  ReadWriteContract,
} from "src/client/Contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { Bytes } from "src/types";
import type { OptionalKeys } from "src/utils/types";

export type MockContractParams<TAbi extends Abi = Abi> = Omit<
  OptionalKeys<ContractParams<TAbi, MockAdapter>, "address">,
  "adapter" | "cache"
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TCache extends ClientCache = ClientCache,
> extends ReadWriteContract<TAbi, MockAdapter, TCache> {
  constructor({
    abi,
    address = ZERO_ADDRESS,
    cacheNamespace,
  }: MockContractParams<TAbi>) {
    super({
      abi,
      adapter: new MockAdapter(),
      address,
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
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });

  onSimulateWrite = <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) =>
    this.adapter.onSimulateWrite({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });

  onEncodeFunctionData = <TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) =>
    this.adapter.onEncodeFunctionData({
      abi: this.abi,
      fn,
      args,
    });

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
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
}
