import type { Abi } from "abitype";
import type { SinonStub } from "sinon";
import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
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
import type { AdapterReadParams } from "src/exports";
import type { Address, Bytes, TransactionHash } from "src/types";
import { MockStore } from "src/utils/testing/MockStore";
import type { OptionalKeys } from "src/utils/types";

// TODO: DRY up the mock clients and integrate them better so that modifying a
// mock fn in one client will modify the same mock in another client, even if
// the signatures are different. This might mean replacing the `on` methods with
// specific mock methods to control their behavior.

export type MockContractParams<TAbi extends Abi = Abi> = Omit<
  OptionalKeys<ContractParams<TAbi, MockAdapter>, "address">,
  "adapter" | "cache"
>;

export class MockContract<
  TAbi extends Abi = Abi,
  TCache extends ClientCache = ClientCache,
> extends ReadWriteContract<TAbi, MockAdapter, TCache> {
  mocks = new MockStore<ReadWriteContract<TAbi, MockAdapter, TCache>>();

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

  // getEvents //

  onGetEvents<TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ) {
    return this.mocks
      .get<
        [
          event: TEventName,
          options?: ContractGetEventsOptions<TAbi, TEventName>,
        ],
        Promise<ContractEvent<TAbi, TEventName>[]>
      >({
        method: "getEvents",
        key: event,
      })
      .withArgs(event, options);
  }

  getEvents = async <TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ) => {
    return this.mocks.get<
      [event: TEventName, options?: ContractGetEventsOptions<TAbi, TEventName>],
      Promise<ContractEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: event,
    })(event, options);
  };

  // read //

  onRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ) {
    // return this.mocks
    //   .get<
    //     ContractReadArgs<TAbi, TFunctionName>,
    //     Promise<FunctionReturn<TAbi, TFunctionName>>
    //   >({
    //     method: "read",
    //   })
    //   .withArgs(fn, args as any, options);

    // const mock = this.adapter.onRead({
    //   abi: this.abi as Abi,
    //   address: this.address,
    //   fn,
    //   ...{
    //     args,
    //     ...options,
    //   },
    // }) as SinonStub as SinonStub<
    //   ContractReadArgs<TAbi, TFunctionName>,
    //   Promise<FunctionReturn<TAbi, TFunctionName>>
    // >;

    // return mock.withArgs(fn, args as any, options);

    return this.adapter.onRead({
      abi: this.abi as Abi,
      address: this.address,
      args,
      fn,
      ...options,
    }) as SinonStub as SinonStub<
      [Omit<AdapterReadParams<TAbi, TFunctionName>, "address" | "abi" | "fn">],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >;
  }

  read = async <TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ) => {
    // return this.mocks.get<
    //   ContractReadArgs<TAbi, TFunctionName>,
    //   Promise<FunctionReturn<TAbi, TFunctionName>>
    // >({
    //   method: "read",
    //   key: fn,
    // })(fn, args as any, options);

    // return this.onRead(fn, args as any, options)(fn, args as any, options);

    // return this.onRead(
    //   fn,
    //   args as any,
    //   options,
    // )({
    //   args,
    //   ...options,
    // } as Omit<
    //   AdapterReadParams<TAbi, TFunctionName>,
    //   "address" | "abi" | "fn"
    // >);
    return this.adapter.onRead({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    })({
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    }) as unknown as FunctionReturn<TAbi, TFunctionName>;
  };

  // simulateWrite //

  onSimulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.mocks
      .get<
        ContractWriteArgs<TAbi, TFunctionName>,
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "simulateWrite",
        key: fn,
      })
      .withArgs(fn, args as any, options);
  }

  simulateWrite = async <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ) => {
    return this.mocks.get<
      ContractWriteArgs<TAbi, TFunctionName>,
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: fn,
    })(fn, args as any, options);
  };

  // encodeFunction //

  onEncodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
  ) {
    let mock = this.mocks.get<
      ContractEncodeFunctionDataArgs<TAbi, TFunctionName>,
      Bytes
    >({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    });
    if (fn && args) {
      mock = mock.withArgs(fn, args);
    }
    return mock;
  }

  encodeFunctionData = <TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ) => {
    return this.mocks.get<
      ContractEncodeFunctionDataArgs<TAbi, TFunctionName>,
      Bytes
    >({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    })(fn, args as FunctionArgs<TAbi, TFunctionName>);
  };

  // decodeFunction //

  onDecodeFunctionData<TFunctionName extends FunctionName<TAbi>>(data?: Bytes) {
    return this.mocks
      .get<[data: Bytes], DecodedFunctionData<TAbi, TFunctionName>>({
        method: "decodeFunctionData",
      })
      .withArgs(data);
  }

  decodeFunctionData = <TFunctionName extends FunctionName<TAbi>>(
    data: Bytes,
  ) => {
    return this.mocks.get<
      [data: Bytes],
      DecodedFunctionData<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
    })(data);
  };

  // getSignerAddress //

  onGetSignerAddress() {
    return this.mocks.get<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    });
  }

  getSignerAddress = async () => {
    return this.mocks.get<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    })();
  };

  // write //

  onWrite<TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    fn: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractWriteOptions,
  ) {
    return this.mocks
      .get<ContractWriteArgs<TAbi, TFunctionName>, Promise<TransactionHash>>({
        method: "write",
        key: fn,
        create: (mock) => mock.resolves("0x0"),
      })
      .withArgs(fn, args as any, options);
  }

  write = async <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ) => {
    return this.mocks.get<
      ContractWriteArgs<TAbi, TFunctionName>,
      Promise<TransactionHash>
    >({
      method: "write",
      key: fn,
      create: (mock) => mock.resolves("0x0"),
    })(fn, args as any, options);
  };
}
