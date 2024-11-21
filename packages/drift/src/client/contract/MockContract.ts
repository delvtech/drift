import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterParams } from "src/adapter/OxAdapter";
import type { Bytes } from "src/adapter/types/Abi";
import type {
  AdapterEncodeFunctionDataParams,
  AdapterReadParams,
  AdapterWriteParams,
  ReadWriteAdapter,
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
import type { FunctionKey, OptionalKeys } from "src/utils/types";

export type MockContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Partial<
  Omit<ContractParams<TAbi, TAdapter, TCache>, keyof OxAdapterParams>
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends Contract<TAbi, TAdapter, TCache> {
  constructor({
    abi = [] as unknown as TAbi,
    adapter = new MockAdapter() as TAdapter,
    address = ZERO_ADDRESS,
    ...rest
  }: MockContractParams<TAbi, TAdapter, TCache> = {}) {
    super({
      ...rest,
      abi,
      adapter,
      address,
    });
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
    } as OptionalKeys<
      AdapterReadParams<TAbi, TFunctionName>,
      "args" | "address"
    >);
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
    } as OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >);
  }

  onEncodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) {
    return this.adapter.onEncodeFunctionData({
      abi: this.abi,
      fn,
      args,
    } as AdapterEncodeFunctionDataParams<TAbi, TFunctionName>);
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
    } as OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >);
  }
}
