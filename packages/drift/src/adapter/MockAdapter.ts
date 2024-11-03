import type { Abi } from "abitype";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  AdapterDecodeFunctionDataParams,
  AdapterEncodeFunctionDataParams,
  AdapterGetEventsParams,
  AdapterReadParams,
  AdapterWriteParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
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
import { StubStore } from "src/utils/testing/StubStore";
import type { OptionalKeys } from "src/utils/types";

export class MockAdapter implements ReadWriteAdapter {
  stubs = new StubStore<ReadWriteAdapter>();

  reset = () => this.stubs.reset();

  // getChainId //

  onGetChainId() {
    return this.stubs.get<[], number>({
      method: "getChainId",
    });
  }

  async getChainId() {
    return this.stubs.get<[], number>({
      method: "getChainId",
    })();
  }

  // getBlock //

  onGetBlock(params?: Partial<NetworkGetBlockParams>) {
    return this.stubs
      .get<[NetworkGetBlockParams?], Promise<Block | undefined>>({
        method: "getBlock",
      })
      .withArgs(params);
  }

  async getBlock(params?: NetworkGetBlockParams) {
    return this.stubs.get<[NetworkGetBlockParams?], Promise<Block | undefined>>(
      {
        method: "getBlock",
      },
    )(params);
  }

  // getBalance //

  onGetBalance(params?: Partial<NetworkGetBalanceParams>) {
    let stub = this.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
    });
    if (params) {
      stub = stub.withArgs(params);
    }
    return stub;
  }

  async getBalance(params: NetworkGetBalanceParams) {
    return this.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
    })(params);
  }

  // getTransaction //

  onGetTransaction(params?: Partial<NetworkGetTransactionParams>) {
    let stub = this.stubs.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (stub) => stub.resolves(undefined),
    });
    if (params) {
      stub = stub.withArgs(params);
    }
    return stub;
  }

  async getTransaction(params: NetworkGetTransactionParams) {
    return this.stubs.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      create: (stub) => stub.resolves(undefined),
    })(params);
  }

  // waitForTransaction //

  onWaitForTransaction(params?: Partial<NetworkWaitForTransactionParams>) {
    let stub = this.stubs.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (stub) => stub.resolves(undefined),
    });
    if (params) {
      stub = stub.withArgs(params);
    }
    return stub;
  }

  async waitForTransaction(params: NetworkWaitForTransactionParams) {
    return this.stubs.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      create: (stub) => stub.resolves(undefined),
    })(params);
  }

  // encodeFunction //

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<
      AdapterEncodeFunctionDataParams<TAbi, TFunctionName>,
      "args"
    >,
  ) {
    return this.stubs
      .get<[AdapterEncodeFunctionDataParams<TAbi, TFunctionName>], Bytes>({
        method: "encodeFunctionData",
      })
      .withArgs(
        params as Partial<AdapterEncodeFunctionDataParams<TAbi, TFunctionName>>,
      );
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>) {
    return this.stubs.get<
      [AdapterEncodeFunctionDataParams<TAbi, TFunctionName>],
      Bytes
    >({
      method: "encodeFunctionData",
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
    return this.stubs
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
    return this.stubs.get<
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
    return this.stubs
      .get<
        [AdapterGetEventsParams<TAbi, TEventName>],
        Promise<ContractEvent<TAbi, TEventName>[]>
      >({
        method: "getEvents",
        key: params.event,
      })
      .withArgs(params);
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: AdapterGetEventsParams<TAbi, TEventName>,
  ) {
    return this.stubs.get<
      [AdapterGetEventsParams<TAbi, TEventName>],
      Promise<ContractEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params.event,
    })(params);
  }

  // read //

  // FIXME: Partial args in `on` methods is not working as expected. Currently,
  // you must stub the method with all expected args.
  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
    abi,
    address,
    fn,
    args,
    block,
  }: OptionalKeys<AdapterReadParams<TAbi, TFunctionName>, "args" | "address">) {
    return this.stubs
      .get<
        [AdapterReadParams<TAbi, TFunctionName>],
        Promise<FunctionReturn<TAbi, TFunctionName>>
      >({
        method: "read",
        key: fn,
      })
      .withArgs({
        abi,
        address,
        fn,
        args,
        block,
      } as Partial<AdapterReadParams<TAbi, TFunctionName>>);
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: AdapterReadParams<TAbi, TFunctionName>) {
    return this.stubs.get<
      [AdapterReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: fn,
    })({
      abi,
      address: address,
      fn: fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      block: block,
    });
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
    return this.stubs
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
    return this.stubs.get<
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
    return this.stubs
      .get<[AdapterWriteParams<TAbi, TFunctionName>], Promise<Hash>>({
        method: "write",
        key: params.fn,
      })
      .withArgs(params as Partial<AdapterWriteParams<TAbi, TFunctionName>>);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const writePromise = Promise.resolve(
      this.stubs.get<[AdapterWriteParams<TAbi, TFunctionName>], Promise<Hash>>({
        method: "write",
        key: params.fn,
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
    return this.stubs.get<[], Address>({
      method: "getSignerAddress",
    });
  }

  async getSignerAddress() {
    return this.stubs.get<[], Address>({
      method: "getSignerAddress",
    })();
  }
}
