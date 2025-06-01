import { AbiEncoder } from "src/adapter/AbiEncoder";
import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  CallParams,
  DeployParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SendTransactionParams,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { BlockIdentifier } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  ConstructorArgs,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockReturn,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { stringifyKey } from "src/utils/stringifyKey";
import { StubStore } from "src/utils/testing/StubStore";
import type { AnyObject, FunctionKey, Replace } from "src/utils/types";

export class MockAdapter extends AbiEncoder implements ReadWriteAdapter {
  stubs = new StubStore<ReadWriteAdapter>();

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.stubs.reset(method);
  }

  // Remove the abi from the key
  protected createKey({ abi, ...params }: AnyObject) {
    return stringifyKey(params);
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

  onGetBlock<T extends BlockIdentifier | undefined = undefined>(block?: T) {
    return this.stubs.get<[block?: T], Promise<GetBlockReturn<T>>>({
      method: "getBlock",
      key: block === undefined ? undefined : this.createKey({ block }),
    });
  }

  async getBlock<T extends BlockIdentifier | undefined = undefined>(block?: T) {
    return this.stubs.get<[block?: T], Promise<GetBlockReturn<T>>>({
      method: "getBlock",
      key: block === undefined ? undefined : this.createKey({ block }),
      matchPartial: true,
    })(block);
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

  onCall(params?: Partial<CallParams>) {
    return this.stubs.get<[CallParams], Promise<Bytes>>({
      method: "call",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async call(params: CallParams) {
    return this.stubs.get<[CallParams], Promise<Bytes>>({
      method: "call",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // sendRawTransaction //

  onSendRawTransaction(transaction?: Bytes) {
    return this.stubs.get<[Bytes], Promise<Hash>>({
      method: "sendRawTransaction",
      key:
        transaction === undefined ? undefined : this.createKey({ transaction }),
    });
  }

  async sendRawTransaction(transaction: Bytes) {
    return this.stubs.get<[Bytes], Promise<Hash>>({
      method: "sendRawTransaction",
      key:
        transaction === undefined ? undefined : this.createKey({ transaction }),
      matchPartial: true,
    })(transaction);
  }

  // getEvents //

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params?: Partial<GetEventsParams<TAbi, TEventName>>,
  ) {
    return this.stubs.get<
      [GetEventsParams<TAbi, TEventName>],
      Promise<EventLog<TAbi, TEventName>[]>
    >({
      method: "getEvents",
      key: params ? this.createKey(params) : undefined,
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
  >(
    params?: Replace<
      Partial<ReadParams<TAbi, TFunctionName>>,
      { args?: Partial<FunctionArgs<TAbi, TFunctionName>> }
    >,
  ) {
    return this.stubs.get<
      [ReadParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "read",
      key: params ? this.createKey(params) : undefined,
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
    params?: Replace<
      Partial<SimulateWriteParams<TAbi, TFunctionName>>,
      { args?: Partial<FunctionArgs<TAbi, TFunctionName>> }
    >,
  ) {
    return this.stubs.get<
      [SimulateWriteParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      method: "simulateWrite",
      key: params ? this.createKey(params) : undefined,
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
  >(
    params?: Replace<
      Partial<WriteParams<TAbi, TFunctionName>>,
      { args?: Partial<FunctionArgs<TAbi, TFunctionName>> }
    >,
  ) {
    return this.stubs.get<[WriteParams<TAbi, TFunctionName>], Promise<Hash>>({
      method: "write",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const hash = await this.stubs.get<
      [WriteParams<TAbi, TFunctionName>],
      Promise<Hash>
    >({
      method: "write",
      key: this.createKey(params),
      matchPartial: true,
    })(params);

    if (params.onMined) {
      this.waitForTransaction({ hash }).then(params.onMined);
    }

    return hash;
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

  // deploy //

  onDeploy<TAbi extends Abi>(
    params?: Replace<
      Partial<DeployParams<TAbi>>,
      { args?: Partial<ConstructorArgs<TAbi>> }
    >,
  ) {
    return this.stubs.get<[DeployParams<TAbi>], Promise<Hash>>({
      method: "deploy",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async deploy<TAbi extends Abi>(params: DeployParams<TAbi>) {
    const hash = await Promise.resolve(
      this.stubs.get<[DeployParams<TAbi>], Promise<Hash>>({
        method: "deploy",
        key: this.createKey(params),
        matchPartial: true,
      })(params),
    );

    if (params.onMined) {
      this.waitForTransaction({ hash }).then(params.onMined);
    }

    return hash;
  }

  // sendTransaction //

  onSendTransaction(params?: Partial<SendTransactionParams>) {
    return this.stubs.get<[SendTransactionParams], Promise<Hash>>({
      method: "sendTransaction",
      key: params ? this.createKey(params) : undefined,
    });
  }

  async sendTransaction(params: SendTransactionParams) {
    const hash = await this.stubs.get<[SendTransactionParams], Promise<Hash>>({
      method: "sendTransaction",
      key: this.createKey(params),
      matchPartial: true,
    })(params);

    if (params.onMined) {
      this.waitForTransaction({ hash }).then(params.onMined);
    }

    return hash;
  }
}
