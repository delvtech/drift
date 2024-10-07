import type { Abi } from "abitype";
import type { SinonStub } from "sinon";
import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { ClientCache } from "src/cache/ClientCache/types";
import {
  type ContractGetEventsArgs,
  type ContractParams,
  ReadWriteContract,
} from "src/client/Contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type {
  AdapterGetEventsParams,
  AdapterReadParams,
  AdapterWriteParams,
} from "src/exports";
import type { Bytes } from "src/types";
import { IERC20 } from "src/utils/testing/IERC20";
import type { OptionalKeys } from "src/utils/types";

export type MockContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
> = Omit<
  OptionalKeys<ContractParams<TAbi, TAdapter>, "address" | "adapter">,
  "cache"
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TCache extends ClientCache = ClientCache,
  TAdapter extends MockAdapter = MockAdapter,
> extends ReadWriteContract<TAbi, TAdapter, TCache> {
  constructor({
    abi,
    adapter = new MockAdapter() as TAdapter,
    address = ZERO_ADDRESS,
    cacheNamespace,
  }: MockContractParams<TAbi, TAdapter>) {
    super({
      abi,
      adapter,
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
    }) as SinonStub<
      [AdapterGetEventsParams<TAbi, TEventName>],
      Promise<ContractEvent<TAbi, TEventName>[]>
    >;

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
    }) as SinonStub as SinonStub<
      [AdapterReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >;

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
    }) as SinonStub as SinonStub<
      [AdapterWriteParams<TAbi, TFunctionName>, "abi" | "address"],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >;

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

const foo = new MockContract({ abi: IERC20.abi });
foo
  .onWrite("transfer", {
    to: "0x123",
    value: 100n,
  })
  .resolves();
