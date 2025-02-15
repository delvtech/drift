import { AbiEncoder } from "src/adapter/AbiEncoder";
import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  CallParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { createSerializableKey } from "src/utils/createSerializableKey";
import { StubStore } from "src/utils/testing/StubStore";
import type { AnyObject, FunctionKey, PartialBy } from "src/utils/types";

export class MockAdapter extends AbiEncoder implements ReadWriteAdapter {
  stubs = new StubStore<ReadWriteAdapter>();

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.stubs.reset(method);
  }

  // Remove the abi from the key
  protected createKey({ abi, ...params }: AnyObject) {
    return createSerializableKey(params);
  }

  // getChainId //

  onGetChainId() {
    return this.stubs.get<[], Promise<number>>({
      method: "getChainId",
    });
  }

  async getChainId() {
    return this.stubs.get<[], Promise<number>>({
      method: "getChainId",
    })();
  }

  // getBlockNumber //

  onGetBlockNumber() {
    return this.stubs.get<[], Promise<bigint>>({
      method: "getBlockNumber",
    });
  }

  async getBlockNumber() {
    return this.stubs.get<[], Promise<bigint>>({
      method: "getBlockNumber",
    })();
  }

  // getBlock //

  onGetBlock(params?: Partial<GetBlockParams>) {
    return this.stubs.get<[GetBlockParams?], Promise<Block | undefined>>({
      method: "getBlock",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async getBlock(params?: GetBlockParams) {
    return this.stubs.get<[GetBlockParams?], Promise<Block | undefined>>({
      method: "getBlock",
      key: params ? this.createKey(params) : undefined,
      matchPartial: true,
    })(params);
  }

  // getBalance //

  onGetBalance(params?: Partial<GetBalanceParams>) {
    const stub = this.stubs.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: params ? this.createKey(params) : undefined,
    });
    return stub;
  }

  async getBalance(params: GetBalanceParams) {
    return this.stubs.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: this.createKey(params),
      matchPartial: true,
    })(params as GetBalanceParams);
  }

  // getTransaction //

  onGetTransaction(params?: Partial<GetTransactionParams>) {
    return this.stubs.get<
      [GetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      key: params ? this.createKey(params) : undefined,
      create: (stub) => stub.resolves(undefined),
    });
  }

  async getTransaction(params: GetTransactionParams) {
    return this.stubs.get<
      [GetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      key: this.createKey(params),
      matchPartial: true,
      create: (stub) => stub.resolves(undefined),
    })(params);
  }

  // waitForTransaction //

  onWaitForTransaction(params?: Partial<WaitForTransactionParams>) {
    return this.stubs.get<
      [WaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      key: params ? this.createKey(params) : undefined,
      create: (stub) => stub.resolves(undefined),
    });
  }

  async waitForTransaction(params: WaitForTransactionParams) {
    return this.stubs.get<
      [WaitForTransactionParams],
      Promise<TransactionReceipt | undefined>
    >({
      method: "waitForTransaction",
      key: this.createKey(params),
      matchPartial: true,
      create: (stub) => stub.resolves(undefined),
    })(params);
  }

  // call //

  onCall(params: Partial<CallParams>) {
    return this.stubs.get<[CallParams], Promise<Bytes>>({
      method: "call",
      key: this.createKey(params),
    });
  }

  async call(params: CallParams) {
    return this.stubs.get<[CallParams], Promise<Bytes>>({
      method: "call",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: PartialBy<GetEventsParams<TAbi, TEventName>, "address">,
  ) {
    return this.stubs.get<
      [GetEventsParams<TAbi, TEventName>],
      Promise<EventLog<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: this.createKey(params),
    });
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ) {
    return this.stubs.get<
      [GetEventsParams<TAbi, TEventName>],
      Promise<EventLog<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: PartialBy<ReadParams<TAbi, TFunctionName>, "args" | "address">) {
    return this.stubs.get<
      [ReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: this.createKey(params),
    });
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>) {
    return this.stubs.get<
      [ReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // simulateWrite //

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: PartialBy<
      SimulateWriteParams<TAbi, TFunctionName>,
      "args" | "address"
    >,
  ) {
    return this.stubs.get<
      [SimulateWriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: this.createKey(params),
    });
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: SimulateWriteParams<TAbi, TFunctionName>) {
    return this.stubs.get<
      [SimulateWriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // write //

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params?: PartialBy<WriteParams<TAbi, TFunctionName>, "args" | "address">) {
    return this.stubs.get<[WriteParams<TAbi, TFunctionName>], Promise<Hash>>({
      method: "write",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const writePromise = Promise.resolve(
      this.stubs.get<[WriteParams<TAbi, TFunctionName>], Promise<Hash>>({
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
