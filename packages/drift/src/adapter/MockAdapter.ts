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

  protected getMock({
    method,
    key,
    create,
  }: {
    method: keyof ReadWriteAdapter;
    key?: SimpleCacheKey;
    create?: () => SinonStub;
  }): SinonStub {
    let mockKey = method;
    if (key) {
      mockKey += `:${stringify(key)}`;
    }
    let mock = this.mocks.get(mockKey);
    if (!mock) {
      mock = create
        ? create()
        : // Throws an error by default if no explicit return value is set.
          sinonStub().throws(
            new NotImplementedError({
              method,
              mockKey,
            }),
          );
      this.mocks.set(mockKey, mock);
    }
    return mock;
  }

  reset() {
    this.mocks.clear();
  }

  // getBalance //

  onGetBalance(...args: Partial<NetworkGetBalanceArgs>) {
    return this.getMock({
      method: "getBalance",
      create: () => sinonStub().resolves(0n),
    }).withArgs(...args);
  }

  getBalance(...args: NetworkGetBalanceArgs): Promise<bigint> {
    return this.getMock({
      method: "getBalance",
      create: () => sinonStub().resolves(0n),
    })(...args);
  }

  // getBlock //

  onGetBlock(...args: Partial<NetworkGetBlockArgs>) {
    return this.getMock({
      method: "getBlock",
      create: () =>
        sinonStub().resolves({
          blockNumber: 0n,
          timestamp: 0n,
        }),
    }).withArgs(...args);
  }

  async getBlock(...args: NetworkGetBlockArgs): Promise<Block | undefined> {
    return this.getMock({
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
    return this.getMock({
      method: "getChainId",
      create: () => sinonStub().resolves(96024),
    });
  }

  async getChainId(): Promise<number> {
    return this.getMock({
      method: "getChainId",
      create: () => sinonStub().resolves(96024),
    })();
  }

  // getTransaction //

  onGetTransaction(...args: Partial<NetworkGetTransactionArgs>) {
    return this.getMock({
      method: "getTransaction",
      create: () => sinonStub().resolves(undefined),
    }).withArgs(...args);
  }

  async getTransaction(
    ...args: NetworkGetTransactionArgs
  ): Promise<Transaction | undefined> {
    return this.getMock({
      method: "getTransaction",
      create: () => sinonStub().resolves(undefined),
    })(...args);
  }

  // waitForTransaction //

  onWaitForTransaction(...args: Partial<NetworkWaitForTransactionArgs>) {
    return this.getMock({
      method: "waitForTransaction",
      create: () => sinonStub().resolves(undefined),
    }).withArgs(...args);
  }

  async waitForTransaction(
    ...args: NetworkWaitForTransactionArgs
  ): Promise<TransactionReceipt | undefined> {
    return this.getMock({
      method: "waitForTransaction",
      create: () => sinonStub().resolves(undefined),
    })(...args);
  }

  // encodeFunction //

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: OnEncodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock({
      method: "encodeFunctionData",
      create: () => sinonStub().returns("0x0"),
    }).withArgs(params);
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
    return this.getMock({
      method: "encodeFunctionData",
      create: () => sinonStub().returns("0x0"),
    })(params);
  }

  // decodeFunction //

  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: OnDecodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.getMock({
      method: "decodeFunctionData",
      key: params.fn,
    }).withArgs(params);
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName> {
    // TODO: This should be specific to the abi to ensure the correct return type.
    return this.getMock({
      method: "decodeFunctionData",
      key: params.fn,
    })(params);
  }

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ) {
    return this.getMock({
      method: "getEvents",
      key: params.event,
    }).withArgs(params);
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<Event<TAbi, TEventName>[]> {
    return this.getMock({
      method: "getEvents",
      key: params.event,
    })(params);
  }

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: OnReadParams<TAbi, TFunctionName>) {
    return this.getMock({
      method: "read",
      key: params.fn,
    }).withArgs(params);
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.getMock({
      method: "read",
      key: params.fn,
    })(params);
  }

  // simulateWrite //

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: OnWriteParams<TAbi, TFunctionName>) {
    return this.getMock({
      method: "simulateWrite",
      key: params.fn,
    }).withArgs(params);
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: WriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.getMock({
      method: "simulateWrite",
      key: params.fn,
    })(params);
  }

  // write //

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: OnWriteParams<TAbi, TFunctionName>) {
    return this.getMock({
      method: "write",
      key: params.fn,
      create: () => sinonStub().resolves("0x0"),
    }).withArgs(params);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<TransactionHash> {
    return this.getMock({
      method: "write",
      key: params.fn,
      create: () => sinonStub().resolves("0x0"),
    })(params);
  }

  // getSignerAddress //

  onGetSignerAddress() {
    return this.getMock({
      method: "getSignerAddress",
      create: () => sinonStub().resolves("0xMockSigner"),
    });
  }

  async getSignerAddress(): Promise<Address> {
    return this.getMock({
      method: "getSignerAddress",
      create: () => sinonStub().resolves("0xMockSigner"),
    })();
  }
}

// TODO: Make address optional and create a key from the abi entry and fn name.
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

class NotImplementedError extends Error {
  constructor({ method, mockKey }: { method: string; mockKey: string }) {
    super(
      `Called ${method} on a MockAdapter without a return value. No mock found with key "${mockKey}". Stub the return value first:
    adapter.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
