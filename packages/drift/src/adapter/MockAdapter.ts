import type { Abi } from "abitype";
import stringify from "fast-json-stable-stringify";
import { type SinonStub, stub as sinonStub } from "sinon";
import type { Event, EventName } from "src/adapter/contract/types/event";
import type {
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type { Block } from "src/adapter/network/types/Block";
import type {
  NetworkGetBalanceArgs,
  NetworkGetBlockArgs,
  NetworkGetTransactionArgs,
  NetworkWaitForTransactionArgs,
} from "src/adapter/network/types/NetworkAdapter";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/network/types/Transaction";
import type {
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  WriteParams,
} from "src/adapter/types";
import type { SimpleCacheKey } from "src/exports";
import type { Address, Bytes, TransactionHash } from "src/types";
import type { OptionalKeys } from "src/utils/types";

// TODO: Allow configuration of error throwing/default return value behavior
export class MockAdapter implements ReadWriteAdapter {
  // stubs //

  protected mocks = new Map<string, SinonStub>();

  protected getMock<TArgs extends any[], TReturnType = any>({
    method,
    key,
    create,
  }: {
    method: keyof ReadWriteAdapter;
    key?: SimpleCacheKey;
    create?: (mock: SinonStub<TArgs, TReturnType>) => SinonStub;
  }): SinonStub<TArgs, TReturnType> {
    let mockKey: string = method;
    if (key) {
      mockKey += `:${stringify(key)}`;
    }
    let mock = this.mocks.get(mockKey);
    if (!mock) {
      mock = sinonStub().throws(
        new NotImplementedError({
          method,
          mockKey,
        }),
      );
      if (create) {
        // TODO: Cleanup type casting
        mock = create(mock as any);
      }
      this.mocks.set(mockKey, mock);
    }
    return mock as any;
  }

  reset() {
    this.mocks.clear();
  }

  // getBalance //

  onGetBalance(...args: Partial<NetworkGetBalanceArgs>) {
    return this.getMock<NetworkGetBalanceArgs, Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    }).withArgs(...args);
  }

  async getBalance(...args: NetworkGetBalanceArgs) {
    return this.getMock<NetworkGetBalanceArgs, Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    })(...args);
  }

  // getBlock //

  onGetBlock(...args: Partial<NetworkGetBlockArgs>) {
    return this.getMock<NetworkGetBlockArgs, Promise<Block | undefined>>({
      method: "getBlock",
      create: (mock) =>
        mock.resolves({
          blockNumber: 0n,
          timestamp: 0n,
        }),
    }).withArgs(...args);
  }

  async getBlock(...args: NetworkGetBlockArgs) {
    return this.getMock<NetworkGetBlockArgs, Promise<Block | undefined>>({
      method: "getBlock",
      create: () =>
        sinonStub().resolves({
          blockNumber: 0n,
          timestamp: 0n,
        }),
    })(...args);
  }

  // getChainId //

  onGetChainId() {
    return this.getMock<[], number>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    });
  }

  async getChainId() {
    return this.getMock<[], number>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    })();
  }

  // getTransaction //

  onGetTransaction(...args: Partial<NetworkGetTransactionArgs>) {
    return this.getMock<
      NetworkGetTransactionArgs,
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (mock) => mock.resolves(undefined),
    }).withArgs(...args);
  }

  async getTransaction(...args: NetworkGetTransactionArgs) {
    return this.getMock<
      NetworkGetTransactionArgs,
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (mock) => mock.resolves(undefined),
    })(...args);
  }

  // waitForTransaction //

  onWaitForTransaction(...args: Partial<NetworkWaitForTransactionArgs>) {
    return this.getMock<
      NetworkWaitForTransactionArgs,
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (mock) => mock.resolves(undefined),
    }).withArgs(...args);
  }

  async waitForTransaction(...args: NetworkWaitForTransactionArgs) {
    return this.getMock<
      NetworkWaitForTransactionArgs,
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (mock) => mock.resolves(undefined),
    })(...args);
  }

  // encodeFunction //

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: OnEncodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock<[EncodeFunctionDataParams], Bytes>({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    }).withArgs(params);
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock<[EncodeFunctionDataParams], Bytes>({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    })(params);
  }

  // decodeFunction //

  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: OnDecodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock<
      [DecodeFunctionDataParams<TAbi, TFunctionName>],
      FunctionReturn<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      key: params.fn,
    }).withArgs(params);
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock<
      [DecodeFunctionDataParams<TAbi, TFunctionName>],
      FunctionReturn<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      // TODO: This should be specific to the abi to ensure the correct return
      // type.
      key: params.fn,
    })(params);
  }

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OnGetEventsParams<TAbi, TEventName>,
  ) {
    return this.getMock<
      [GetEventsParams<TAbi, TEventName>],
      Promise<Event<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params.event,
    }).withArgs(params);
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ) {
    return this.getMock<
      [GetEventsParams<TAbi, TEventName>],
      Promise<Event<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params.event,
    })(params);
  }

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: OnReadParams<TAbi, TFunctionName>) {
    return this.getMock<
      [ReadParams<TAbi, TFunctionName>],
      FunctionReturn<TAbi, TFunctionName>
    >({
      method: "read",
      key: params.fn,
    }).withArgs(params as Partial<ReadParams<TAbi, TFunctionName>>);
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>) {
    return this.getMock<
      [ReadParams<TAbi, TFunctionName>],
      FunctionReturn<TAbi, TFunctionName>
    >({
      method: "read",
      key: params.fn,
    })(params);
  }

  // simulateWrite //

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: OnWriteParams<TAbi, TFunctionName>) {
    return this.getMock<
      [WriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: params.fn,
    }).withArgs(params as Partial<WriteParams<TAbi, TFunctionName>>);
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    return this.getMock<
      [WriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: params.fn,
    })(params);
  }

  // write //

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: OnWriteParams<TAbi, TFunctionName>) {
    return this.getMock<
      [WriteParams<TAbi, TFunctionName>],
      Promise<TransactionHash>
    >({
      method: "write",
      key: params.fn,
      create: (mock) => mock.resolves("0x0"),
    }).withArgs(params as Partial<WriteParams<TAbi, TFunctionName>>);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    return this.getMock<
      [WriteParams<TAbi, TFunctionName>],
      Promise<TransactionHash>
    >({
      method: "write",
      key: params.fn,
      create: (mock) => mock.resolves("0x0"),
    })(params);
  }

  // getSignerAddress //

  onGetSignerAddress() {
    return this.getMock<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    });
  }

  async getSignerAddress() {
    return this.getMock<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    })();
  }
}

export type OnGetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = OptionalKeys<GetEventsParams<TAbi, TEventName>, "address">;

export type OnReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<ReadParams<TAbi, TFunctionName>, "args" | "address">;

export type OnWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">;

export type OnEncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<EncodeFunctionDataParams<TAbi, TFunctionName>, "args">;

export type OnDecodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<DecodeFunctionDataParams<TAbi, TFunctionName>, "data">;

export class NotImplementedError extends Error {
  constructor({ method, mockKey }: { method: string; mockKey: string }) {
    super(
      `Called ${method} on a MockAdapter without a return value. No mock found with key "${mockKey}". Stub the return value first:
    adapter.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
