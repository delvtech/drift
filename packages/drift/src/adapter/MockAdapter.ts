import type { Abi } from "abitype";
import type {
  AdapterDecodeFunctionDataParams,
  AdapterEncodeFunctionDataParams,
  AdapterGetEventsParams,
  AdapterReadParams,
  AdapterWriteParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  NetworkGetBalanceParams,
  NetworkGetBlockParams,
  NetworkGetTransactionParams,
  NetworkWaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import type { Address, Bytes, TransactionHash } from "src/types";
import { MockStore } from "src/utils/MockStore";
import type { OptionalKeys } from "src/utils/types";

// TODO: Allow configuration of error throwing/default return value behavior
export class MockAdapter implements ReadWriteAdapter {
  mocks: MockStore<ReadWriteAdapter>;

  constructor(store = new MockStore<ReadWriteAdapter>()) {
    this.mocks = store;
  }

  reset = () => this.mocks.reset();

  // getChainId //

  onGetChainId() {
    return this.mocks.get<[], number>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    });
  }

  async getChainId() {
    return this.mocks.get<[], number>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    })();
  }

  // getBlock //

  onGetBlock(params?: Partial<NetworkGetBlockParams>) {
    return this.mocks
      .get<[NetworkGetBlockParams?], Promise<Block | undefined>>({
        method: "getBlock",
        create: (mock) =>
          mock.resolves({
            blockNumber: 0n,
            timestamp: 0n,
          }),
      })
      .withArgs(params);
  }

  async getBlock(params?: NetworkGetBlockParams) {
    return this.mocks.get<[NetworkGetBlockParams?], Promise<Block | undefined>>(
      {
        method: "getBlock",
        create: (mock) =>
          mock.resolves({
            blockNumber: 0n,
            timestamp: 0n,
          }),
      },
    )(params);
  }

  // getBalance //

  onGetBalance(params?: Partial<NetworkGetBalanceParams>) {
    let mock = this.mocks.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    });
    if (params) {
      mock = mock.withArgs(params);
    }
    return mock;
  }

  async getBalance(params: NetworkGetBalanceParams) {
    return this.mocks.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    })(params);
  }

  // getTransaction //

  onGetTransaction(params?: Partial<NetworkGetTransactionParams>) {
    let mock = this.mocks.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (mock) => mock.resolves(undefined),
    });
    if (params) {
      mock = mock.withArgs(params);
    }
    return mock;
  }

  async getTransaction(params: NetworkGetTransactionParams) {
    return this.mocks.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (mock) => mock.resolves(undefined),
    })(params);
  }

  // waitForTransaction //

  onWaitForTransaction(params?: Partial<NetworkWaitForTransactionParams>) {
    let mock = this.mocks.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (mock) => mock.resolves(undefined),
    });
    if (params) {
      mock = mock.withArgs(params);
    }
    return mock;
  }

  async waitForTransaction(params: NetworkWaitForTransactionParams) {
    return this.mocks.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (mock) => mock.resolves(undefined),
    })(params);
  }

  // encodeFunction //

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: Partial<AdapterEncodeFunctionDataParams<TAbi, TFunctionName>>) {
    return this.mocks
      .get<[AdapterEncodeFunctionDataParams], Bytes>({
        method: "encodeFunctionData",
        create: (mock) => mock.returns("0x0"),
      })
      .withArgs(params);
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.mocks.get<[AdapterEncodeFunctionDataParams], Bytes>({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    })(params);
  }

  // decodeFunction //

  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<
      AdapterDecodeFunctionDataParams<TAbi, TFunctionName>,
      "data"
    >,
  ) {
    return this.mocks
      .get<
        [AdapterDecodeFunctionDataParams<TAbi, TFunctionName>],
        DecodedFunctionData<TAbi, TFunctionName>
      >({
        method: "decodeFunctionData",
        key: params.fn,
      })
      .withArgs(params);
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: Partial<AdapterDecodeFunctionDataParams<TAbi, TFunctionName>>) {
    return this.mocks.get<
      [AdapterDecodeFunctionDataParams<TAbi, TFunctionName>],
      DecodedFunctionData<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      // TODO: This should be specific to the abi to ensure the correct return
      // type.
      key: params.fn,
    })(params as AdapterDecodeFunctionDataParams<TAbi, TFunctionName>);
  }

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OptionalKeys<AdapterGetEventsParams<TAbi, TEventName>, "address">,
  ) {
    return this.mocks
      .get<
        [AdapterGetEventsParams<TAbi, TEventName>],
        Promise<ContactEvent<TAbi, TEventName>[]>
      >({
        method: "getEvents",
        key: params.event,
      })
      .withArgs(params);
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: AdapterGetEventsParams<TAbi, TEventName>,
  ) {
    return this.mocks.get<
      [AdapterGetEventsParams<TAbi, TEventName>],
      Promise<ContactEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params.event,
    })(params);
  }

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: OptionalKeys<
      AdapterReadParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) {
    return this.mocks
      .get<
        [AdapterReadParams<TAbi, TFunctionName>],
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "read",
        key: params.fn,
      })
      .withArgs(params as Partial<AdapterReadParams<TAbi, TFunctionName>>);
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: AdapterReadParams<TAbi, TFunctionName>) {
    return this.mocks.get<
      [AdapterReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: params.fn,
    })(params);
  }

  // simulateWrite //

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) {
    return this.mocks
      .get<
        [AdapterWriteParams<TAbi, TFunctionName>],
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "simulateWrite",
        key: params.fn,
      })
      .withArgs(params as Partial<AdapterWriteParams<TAbi, TFunctionName>>);
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    return this.mocks.get<
      [AdapterWriteParams<TAbi, TFunctionName>],
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
  >(
    params: OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) {
    return this.mocks
      .get<[AdapterWriteParams<TAbi, TFunctionName>], Promise<TransactionHash>>(
        {
          method: "write",
          key: params.fn,
          create: (mock) => mock.resolves("0x0"),
        },
      )
      .withArgs(params as Partial<AdapterWriteParams<TAbi, TFunctionName>>);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const writePromise = Promise.resolve(
      this.mocks.get<
        [AdapterWriteParams<TAbi, TFunctionName>],
        Promise<TransactionHash>
      >({
        method: "write",
        key: params.fn,
        create: (mock) => mock.resolves("0x0"),
      })(params),
    );

    // TODO: unit test
    if (params.onMined) {
      writePromise.then((hash) => {
        this.waitForTransaction({ hash }).then(params.onMined);
        return hash;
      });
    }

    return writePromise;
  }

  // getSignerAddress //

  onGetSignerAddress() {
    return this.mocks.get<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    });
  }

  async getSignerAddress() {
    return this.mocks.get<[], Address>({
      method: "getSignerAddress",
      create: (mock) => mock.resolves("0xMockSigner"),
    })();
  }
}

export type AdapterOnWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<AdapterWriteParams<TAbi, TFunctionName>, "args" | "address">;

export class NotImplementedError extends Error {
  constructor({ method, mockKey }: { method: string; mockKey: string }) {
    super(
      `Called ${method} on a MockAdapter without a return value. No mock found with key "${mockKey}". Stub the return value first:
    adapter.on${method.replace(/^./, (c) => c.toUpperCase())}(...args).resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
