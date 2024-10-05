import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import type { Block } from "src/adapter/types/Block";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
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
  type GetChainIdParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadParams,
  type WaitForTransactionParams,
  type WriteParams,
} from "src/client/Drift/Drift";
import type { Address, Bytes, TransactionHash } from "src/types";
import { MockStore } from "src/utils/testing/MockStore";
import type { OptionalKeys } from "src/utils/types";

export class MockDrift extends Drift<MockAdapter> {
  mocks = new MockStore<Drift<MockAdapter>>();

  constructor() {
    super(new MockAdapter());
  }

  reset = () => this.mocks.reset();

  contract = <TAbi extends Abi, TCache extends ClientCache = ClientCache>(
    params: MockContractParams<TAbi>,
  ): MockContract<TAbi, TCache> => new MockContract(params);

  // getChainId //

  // FIXME: Partial args in `on` methods is not working as expected. Currently,
  // you must stub the method with all expected args.
  onGetChainId(params?: Partial<GetChainIdParams>) {
    let mock = this.mocks.get<[GetChainIdParams?], Promise<number>>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    });
    if (params) {
      mock = mock.withArgs(params);
    }
    return mock;
  }

  getChainId = async (params?: GetChainIdParams) => {
    return this.mocks.get<[GetChainIdParams?], Promise<number>>({
      method: "getChainId",
      create: (mock) => mock.resolves(96024),
    })(params);
  };

  // getBlock //

  onGetBlock(params?: Partial<GetBlockParams>) {
    return this.mocks
      .get<[GetBlockParams?], Promise<Block | undefined>>({
        method: "getBlock",
        create: (mock) =>
          mock.resolves({
            blockNumber: 0n,
            timestamp: 0n,
          }),
      })
      .withArgs(params);
  }

  getBlock = async (params?: GetBlockParams) => {
    return this.mocks.get<[GetBlockParams?], Promise<Block | undefined>>({
      method: "getBlock",
      create: (mock) =>
        mock.resolves({
          blockNumber: 0n,
          timestamp: 0n,
        }),
    })(params);
  };

  // getBalance //

  onGetBalance(params?: Partial<GetBalanceParams>) {
    let mock = this.mocks.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    });
    if (params) {
      mock = mock.withArgs(params);
    }
    return mock;
  }

  getBalance = async (params: GetBalanceParams) => {
    return this.mocks.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      create: (mock) => mock.resolves(0n),
    })(params);
  };

  // getTransaction //

  onGetTransaction(params?: Partial<GetTransactionParams>) {
    let mock = this.mocks.get<
      [GetTransactionParams],
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

  getTransaction = async (params: GetTransactionParams) => {
    return this.mocks.get<
      [GetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (mock) => mock.resolves(undefined),
    })(params);
  };

  // waitForTransaction //

  onWaitForTransaction(params?: Partial<WaitForTransactionParams>) {
    let mock = this.mocks.get<
      [WaitForTransactionParams],
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

  waitForTransaction = async (params: WaitForTransactionParams) => {
    return this.mocks.get<
      [WaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (mock) => mock.resolves(undefined),
    })(params);
  };

  // encodeFunction //

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<EncodeFunctionDataParams<TAbi, TFunctionName>, "args">,
  ) {
    return this.mocks
      .get<[EncodeFunctionDataParams], Bytes>({
        method: "encodeFunctionData",
        create: (mock) => mock.returns("0x0"),
      })
      .withArgs(params);
  }

  encodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: EncodeFunctionDataParams<TAbi, TFunctionName>,
  ) => {
    return this.mocks.get<[EncodeFunctionDataParams], Bytes>({
      method: "encodeFunctionData",
      create: (mock) => mock.returns("0x0"),
    })(params);
  };

  // decodeFunction //

  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<DecodeFunctionDataParams<TAbi, TFunctionName>, "data">,
  ) {
    return this.mocks
      .get<
        [DecodeFunctionDataParams<TAbi, TFunctionName>],
        DecodedFunctionData<TAbi, TFunctionName>
      >({
        method: "decodeFunctionData",
        key: params.fn,
      })
      .withArgs(params);
  }

  decodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ) => {
    return this.mocks.get<
      [DecodeFunctionDataParams<TAbi, TFunctionName>],
      DecodedFunctionData<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      // TODO: This should be specific to the abi to ensure the correct return
      // type.
      key: params.fn,
    })(params);
  };

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OptionalKeys<GetEventsParams<TAbi, TEventName>, "address">,
  ) {
    return this.mocks
      .get<
        [GetEventsParams<TAbi, TEventName>],
        Promise<ContactEvent<TAbi, TEventName>[]>
      >({
        method: "getEvents",
        key: params.event,
      })
      .withArgs(params);
  }

  getEvents = async <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ) => {
    return this.mocks.get<
      [GetEventsParams<TAbi, TEventName>],
      Promise<ContactEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params.event,
    })(params);
  };

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: OptionalKeys<ReadParams<TAbi, TFunctionName>, "args" | "address">) {
    return this.mocks
      .get<
        [ReadParams<TAbi, TFunctionName>],
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "read",
        key: params.fn,
      })
      .withArgs(params as Partial<ReadParams<TAbi, TFunctionName>>);
  }

  read = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ) => {
    return this.mocks.get<
      [ReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: params.fn,
    })(params);
  };

  // simulateWrite //

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) {
    return this.mocks
      .get<
        [WriteParams<TAbi, TFunctionName>],
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "simulateWrite",
        key: params.fn,
      })
      .withArgs(params as Partial<WriteParams<TAbi, TFunctionName>>);
  }

  simulateWrite = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: WriteParams<TAbi, TFunctionName>,
  ) => {
    return this.mocks.get<
      [WriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: params.fn,
    })(params);
  };

  // write //

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "address">,
  ) {
    return this.mocks
      .get<[WriteParams<TAbi, TFunctionName>], Promise<TransactionHash>>({
        method: "write",
        key: params.fn,
        create: (mock) => mock.resolves("0x0"),
      })
      .withArgs(params as Partial<WriteParams<TAbi, TFunctionName>>);
  }

  write = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: WriteParams<TAbi, TFunctionName>,
  ) => {
    const writePromise = Promise.resolve(
      this.mocks.get<
        [WriteParams<TAbi, TFunctionName>],
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
}
