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
import { createSerializableKey } from "src/utils/createSerializableKey";
import { StubStore } from "src/utils/testing/StubStore";
import type { AnyObject, FunctionKey, OptionalKeys } from "src/utils/types";

export class MockAdapter implements ReadWriteAdapter {
  stubs = new StubStore<ReadWriteAdapter>();

  reset = (method?: FunctionKey<ReadWriteAdapter>) => this.stubs.reset(method);

  // Remove the abi from the key
  protected createKey({ abi, ...params }: AnyObject) {
    return createSerializableKey(params);
  }

  // getChainId //

  onGetChainId = () => {
    return this.stubs.get<[], Promise<number>>({
      method: "getChainId",
    });
  };

  getChainId = async () => {
    return this.stubs.get<[], Promise<number>>({
      method: "getChainId",
    })();
  };

  // getBlockNumber //

  onGetBlockNumber = () => {
    return this.stubs.get<[], Promise<bigint>>({
      method: "getBlockNumber",
    });
  };

  getBlockNumber = async () => {
    return this.stubs.get<[], Promise<bigint>>({
      method: "getBlockNumber",
    })();
  };

  // getBlock //

  onGetBlock = (params?: Partial<NetworkGetBlockParams>) => {
    return this.stubs.get<[NetworkGetBlockParams?], Promise<Block | undefined>>(
      {
        method: "getBlock",
        key: params ? this.createKey(params) : undefined,
      },
    );
  };

  getBlock = async (params?: NetworkGetBlockParams) => {
    return this.stubs.get<[NetworkGetBlockParams?], Promise<Block | undefined>>(
      {
        method: "getBlock",
        key: params ? this.createKey(params) : undefined,
        matchPartial: true,
      },
    )(params);
  };

  // getBalance //

  onGetBalance = (params?: Partial<NetworkGetBalanceParams>) => {
    const stub = this.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: params ? this.createKey(params) : undefined,
    });
    return stub;
  };

  getBalance = async (params: NetworkGetBalanceParams) => {
    return this.stubs.get<[NetworkGetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: this.createKey(params),
      matchPartial: true,
    })(params as NetworkGetBalanceParams);
  };

  // getTransaction //

  onGetTransaction = (params?: Partial<NetworkGetTransactionParams>) => {
    return this.stubs.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      key: params ? this.createKey(params) : undefined,
      create: (stub) => stub.resolves(undefined),
    });
  };

  getTransaction = async (params: NetworkGetTransactionParams) => {
    return this.stubs.get<
      [NetworkGetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      key: this.createKey(params),
      matchPartial: true,
      create: (stub) => stub.resolves(undefined),
    })(params);
  };

  // waitForTransaction //

  onWaitForTransaction = (
    params?: Partial<NetworkWaitForTransactionParams>,
  ) => {
    return this.stubs.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      key: params ? this.createKey(params) : undefined,
      create: (stub) => stub.resolves(undefined),
    });
  };

  waitForTransaction = async (params: NetworkWaitForTransactionParams) => {
    return this.stubs.get<
      [NetworkWaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      key: this.createKey(params),
      matchPartial: true,
      create: (stub) => stub.resolves(undefined),
    })(params);
  };

  // encodeFunction //

  onEncodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params?: OptionalKeys<
      AdapterEncodeFunctionDataParams<TAbi, TFunctionName>,
      "args"
    >,
  ) => {
    return this.stubs.get<
      [AdapterEncodeFunctionDataParams<TAbi, TFunctionName>],
      Bytes
    >({
      method: "encodeFunctionData",
      key: params ? this.createKey(params) : undefined,
    });
  };

  encodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>,
  ) => {
    return this.stubs.get<
      [AdapterEncodeFunctionDataParams<TAbi, TFunctionName>],
      Bytes
    >({
      method: "encodeFunctionData",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  };

  // decodeFunction //

  onDecodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: OptionalKeys<
      AdapterDecodeFunctionDataParams<TAbi, TFunctionName>,
      "data"
    >,
  ) => {
    return this.stubs.get<
      [AdapterDecodeFunctionDataParams<TAbi, TFunctionName>],
      DecodedFunctionData<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      key: this.createKey(params),
    });
  };

  decodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: Partial<AdapterDecodeFunctionDataParams<TAbi, TFunctionName>>,
  ) => {
    return this.stubs.get<
      [AdapterDecodeFunctionDataParams<TAbi, TFunctionName>],
      DecodedFunctionData<TAbi, TFunctionName>
    >({
      method: "decodeFunctionData",
      key: this.createKey(params),
      matchPartial: true,
    })(params as AdapterDecodeFunctionDataParams<TAbi, TFunctionName>);
  };

  // getEvents //

  onGetEvents = <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: OptionalKeys<AdapterGetEventsParams<TAbi, TEventName>, "address">,
  ) => {
    return this.stubs.get<
      [AdapterGetEventsParams<TAbi, TEventName>],
      Promise<ContractEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: this.createKey(params),
    });
  };

  getEvents = async <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: AdapterGetEventsParams<TAbi, TEventName>,
  ) => {
    return this.stubs.get<
      [AdapterGetEventsParams<TAbi, TEventName>],
      Promise<ContractEvent<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  };

  // read //

  onRead = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: OptionalKeys<
      AdapterReadParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) => {
    return this.stubs.get<
      [AdapterReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: this.createKey(params),
    });
  };

  read = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: AdapterReadParams<TAbi, TFunctionName>,
  ) => {
    return this.stubs.get<
      [AdapterReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  };

  // simulateWrite //

  onSimulateWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) => {
    return this.stubs.get<
      [AdapterWriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: this.createKey(params),
    });
  };

  simulateWrite = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    return this.stubs.get<
      [AdapterWriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  };

  // write //

  onWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params?: OptionalKeys<
      AdapterWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) => {
    return this.stubs.get<
      [AdapterWriteParams<TAbi, TFunctionName>],
      Promise<Hash>
    >({
      method: "write",
      key: params ? this.createKey(params) : undefined,
    });
  };

  write = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    console.log("THIS", this);
    const writePromise = Promise.resolve(
      this.stubs.get<[AdapterWriteParams<TAbi, TFunctionName>], Promise<Hash>>({
        method: "write",
        key: this.createKey(params),
        matchPartial: true,
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

  onGetSignerAddress = () => {
    return this.stubs.get<[], Address>({
      method: "getSignerAddress",
    });
  };

  getSignerAddress = async () => {
    return this.stubs.get<[], Address>({
      method: "getSignerAddress",
    })();
  };
}
