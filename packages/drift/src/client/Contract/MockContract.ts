import type { Abi } from "abitype";
import type { SinonStub } from "sinon";
import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { ClientCache } from "src/cache/ClientCache/types";
import {
  type ContractEncodeFunctionDataArgs,
  type ContractGetEventsArgs,
  type ContractParams,
  type ContractReadArgs,
  type ContractWriteArgs,
  ReadWriteContract,
} from "src/client/Contract/Contract";
import { ZERO_ADDRESS } from "src/constants";
import type { Bytes, TransactionHash } from "src/types";
import type { OptionalKeys } from "src/utils/types";

export type MockContractParams<TAbi extends Abi = Abi> = Omit<
  OptionalKeys<ContractParams<TAbi, MockAdapter>, "address">,
  "adapter" | "cache"
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TCache extends ClientCache = ClientCache,
> extends ReadWriteContract<TAbi, MockAdapter, TCache> {
  // mocks //

  constructor({
    abi,
    address = ZERO_ADDRESS,
    cacheNamespace: namespace,
  }: MockContractParams<TAbi>) {
    super({
      abi,
      adapter: new MockAdapter(),
      address,
      cacheNamespace: namespace,
    });
  }

  reset = () => this.adapter.reset();

  // getEvents //

  onGetEvents<TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ) {
    return this.adapter.onGetEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    }) as SinonStub as SinonStub<
      ContractGetEventsArgs<TAbi, TEventName>,
      Promise<ContactEvent<TAbi, TEventName>[]>
    >;
  }

  // read //

  onRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ) {
    return this.adapter.onRead({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    }) as SinonStub as SinonStub<
      ContractReadArgs<TAbi, TFunctionName>,
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >;
  }

  // simulateWrite //

  onSimulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.adapter.onSimulateWrite({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    }) as SinonStub as SinonStub<
      ContractWriteArgs<TAbi, TFunctionName>,
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >;
  }

  // encodeFunction //

  onEncodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) {
    return this.adapter.onEncodeFunctionData({
      abi: this.abi,
      fn,
      args,
    }) as SinonStub as SinonStub<
      ContractEncodeFunctionDataArgs<TAbi, TFunctionName>,
      Bytes
    >;
  }

  // decodeFunction //

  onDecodeFunctionData<TFunctionName extends FunctionName<TAbi>>(data?: Bytes) {
    return this.adapter.onDecodeFunctionData({
      abi: this.abi,
      data,
    }) as SinonStub as SinonStub<
      [data: Bytes],
      DecodedFunctionData<TAbi, TFunctionName>
    >;
  }

  // getSignerAddress //

  onGetSignerAddress() {
    return this.adapter.onGetSignerAddress();
  }

  // write //

  onWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.adapter.onWrite({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    }) as SinonStub as SinonStub<
      ContractWriteArgs<TAbi, TFunctionName>,
      Promise<TransactionHash>
    >;
  }
}
