import { AbiEncoder } from "src/adapter/AbiEncoder";
import type {
  Abi,
  Address,
  Bytes,
  Hash,
  HexString,
} from "src/adapter/types/Abi";
import type {
  CallParams,
  DeployParams,
  EncodeDeployDataParams,
  EncodedCallParams,
  FunctionCallParams,
  GetEventsParams,
  GetWalletCapabilitiesParams,
  MulticallOptions,
  MulticallParams,
  MulticallReturn,
  ReadParams,
  ReadWriteAdapter,
  SendCallsOptions,
  SendCallsParams,
  SendCallsReturn,
  SendTransactionParams,
  SimulateWriteParams,
  WalletCallOptions,
  WalletCallsStatus,
  WalletCapabilities,
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
import { convert } from "src/utils/convert";
import { stringifyKey } from "src/utils/stringifyKey";
import { MissingStubError, StubStore } from "src/utils/testing/StubStore";
import type {
  Extended,
  FunctionKey,
  NarrowTo,
  OneOf,
  Replace,
} from "src/utils/types";

export class MockAdapter extends AbiEncoder implements ReadWriteAdapter {
  stubs = new StubStore<ReadWriteAdapter>();

  reset(method?: FunctionKey<ReadWriteAdapter>) {
    return this.stubs.reset(method);
  }

  protected createKey(params?: unknown) {
    if (!params) return undefined;
    return stringifyKey(
      // Remove ABIs
      convert(
        params,
        (v): v is Extended<{ abi: Abi }> =>
          v && typeof v === "object" && "abi" in v,
        ({ abi, ...rest }) => rest,
      ),
    );
  }

  // getChainId //

  onGetChainId() {
    return this.stubs.get<[], Promise<number>>({
      method: "getChainId",
    });
  }

  async getChainId() {
    return this.onGetChainId()();
  }

  // getBlockNumber //

  onGetBlockNumber() {
    return this.stubs.get<[], Promise<bigint>>({
      method: "getBlockNumber",
    });
  }

  async getBlockNumber() {
    return this.onGetBlockNumber()();
  }

  // getBlock //

  onGetBlock<T extends BlockIdentifier | undefined = undefined>(block?: T) {
    return this.stubs.get<[block?: T], Promise<GetBlockReturn<T>>>({
      method: "getBlock",
      key: this.createKey(block),
    });
  }

  async getBlock<T extends BlockIdentifier | undefined = undefined>(block?: T) {
    return this.stubs.get<[block?: T], Promise<GetBlockReturn<T>>>({
      method: "getBlock",
      key: this.createKey(block),
      matchPartial: true,
    })(block);
  }

  // getBalance //

  onGetBalance(params?: Partial<GetBalanceParams>) {
    return this.stubs.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: this.createKey(params),
    });
  }

  async getBalance(params: GetBalanceParams) {
    return this.stubs.get<[GetBalanceParams], Promise<bigint>>({
      method: "getBalance",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // getTransaction //

  onGetTransaction(params?: Partial<GetTransactionParams>) {
    return this.stubs.get<
      [GetTransactionParams],
      Promise<Transaction | undefined>
    >({
      method: "getTransaction",
      key: this.createKey(params),
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
      key: this.createKey(params),
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

  // sendRawTransaction //

  onSendRawTransaction(transaction?: Bytes) {
    return this.stubs.get<[Bytes], Promise<Hash>>({
      method: "sendRawTransaction",
      key: this.createKey(transaction),
    });
  }

  async sendRawTransaction(transaction: Bytes) {
    return this.stubs.get<[Bytes], Promise<Hash>>({
      method: "sendRawTransaction",
      key: this.createKey(transaction),
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

  // call //

  onCall(params?: Partial<CallParams>) {
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

  // read //

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params?: OnReadParams<TAbi, TFunctionName>) {
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
  >(params?: OnSimulateWriteParams<TAbi, TFunctionName>) {
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

  // multicall //

  onMulticall<
    TAbis extends { abi: Abi }[],
    TFns extends {
      [K in keyof TAbis]: { fn: FunctionName<TAbis[K]["abi"]> };
    },
    TAllowFailure extends boolean = true,
  >(params?: OnMulticallParams<TAbis, TFns, TAllowFailure>) {
    return this.stubs.get<
      [MulticallParams<TAbis, TAllowFailure>],
      Promise<MulticallReturn<TAbis, TAllowFailure>>
    >({
      method: "multicall",
      key: this.createKey(params),
    });
  }

  async multicall<
    TCalls extends { abi: Abi }[],
    TAllowFailure extends boolean = true,
  >(params: MulticallParams<TCalls, TAllowFailure>) {
    try {
      return this.stubs.get<
        [MulticallParams<TCalls, TAllowFailure>],
        Promise<MulticallReturn<TCalls, TAllowFailure>>
      >({
        method: "multicall",
        key: this.createKey(params),
        matchPartial: true,
      })(params);
    } catch (error) {
      if (!(error instanceof MissingStubError)) throw error;

      // If the multicall hasn't been stubbed, check the read and
      // simulateWrite stubs for each individual call.
      const { calls, ...options } = params;
      const results: Promise<unknown>[] = [];

      for (const call of calls) {
        // Check for a read stub
        const readParams: ReadParams = { ...call, block: options.block };
        if (
          this.stubs.has({
            method: "read",
            key: this.createKey(readParams),
            matchPartial: true,
          })
        ) {
          results.push(this.read(readParams));
          continue;
        }

        // Check for a simulateWrite stub
        const simulateWriteParams: SimulateWriteParams = {
          ...call,
          ...options,
        };
        if (
          this.stubs.has({
            method: "simulateWrite",
            key: this.createKey(simulateWriteParams),
            matchPartial: true,
          })
        ) {
          results.push(this.simulateWrite(simulateWriteParams));
          continue;
        }

        // Otherwise, handle the MissingStubError
        if (options.allowFailure === false) throw error;
        results.push(Promise.resolve(error));
      }

      return Promise.all(
        results.map(async (result) => {
          const value = await result;
          if (options.allowFailure === false) return value;
          if (value instanceof Error) return { success: false, error: value };
          return { success: true, value };
        }),
      ) as Promise<MulticallReturn<TCalls, TAllowFailure>>;
    }
  }

  // getSignerAddress //

  onGetSignerAddress() {
    return this.stubs.get<[], Promise<Address>>({
      method: "getSignerAddress",
    });
  }

  async getSignerAddress() {
    return this.stubs.get<[], Promise<Address>>({
      method: "getSignerAddress",
    })();
  }

  // getWalletCapabilities //

  onGetWalletCapabilities<const TChainIds extends number[] = []>(
    params?: GetWalletCapabilitiesParams<TChainIds>,
  ) {
    return this.stubs.get<
      [GetWalletCapabilitiesParams<TChainIds>?],
      Promise<WalletCapabilities<TChainIds>>
    >({
      method: "getWalletCapabilities",
      key: this.createKey(params),
    });
  }

  async getWalletCapabilities<const TChainIds extends number[] = []>(
    params?: GetWalletCapabilitiesParams<TChainIds>,
  ) {
    return this.stubs.get<
      [GetWalletCapabilitiesParams<TChainIds>?],
      Promise<WalletCapabilities<TChainIds>>
    >({
      method: "getWalletCapabilities",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }

  // getCallsStatus //

  onGetCallsStatus<TId extends HexString>(batchId?: TId) {
    return this.stubs.get<[batchId: TId], Promise<WalletCallsStatus<TId>>>({
      method: "getCallsStatus",
      key: this.createKey(batchId),
    });
  }

  async getCallsStatus<TId extends HexString>(batchId: TId) {
    return this.stubs.get<[batchId: TId], Promise<WalletCallsStatus<TId>>>({
      method: "getCallsStatus",
      key: this.createKey(batchId),
      matchPartial: true,
    })(batchId);
  }

  // showCallsStatus //

  onShowCallsStatus(batchId?: HexString) {
    return this.stubs.get<[batchId: HexString], Promise<void>>({
      method: "showCallsStatus",
      key: this.createKey(batchId),
    });
  }

  async showCallsStatus(batchId: HexString) {
    return this.stubs.get<[batchId: HexString], Promise<void>>({
      method: "showCallsStatus",
      key: this.createKey(batchId),
      matchPartial: true,
      create: (stub) => stub.resolves(),
    })(batchId);
  }

  // sendTransaction //

  onSendTransaction(params?: Partial<SendTransactionParams>) {
    return this.stubs.get<[SendTransactionParams], Promise<Hash>>({
      method: "sendTransaction",
      key: this.createKey(params),
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

  // deploy //

  onDeploy<TAbi extends Abi>(params?: OnDeployParams<TAbi>) {
    return this.stubs.get<[DeployParams<TAbi>], Promise<Hash>>({
      method: "deploy",
      key: this.createKey(params),
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

  // write //

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params?: OnWriteParams<TAbi, TFunctionName>) {
    return this.stubs.get<[WriteParams<TAbi, TFunctionName>], Promise<Hash>>({
      method: "write",
      key: this.createKey(params),
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

  // sendCalls //

  onSendCalls<const TCalls extends readonly unknown[] = any[]>(
    params?: OnSendCallsParams<TCalls>,
  ) {
    return this.stubs.get<[SendCallsParams<TCalls>], Promise<SendCallsReturn>>({
      method: "sendCalls",
      key: this.createKey(params),
    });
  }

  async sendCalls<const TCalls extends readonly unknown[] = any[]>(
    params: SendCallsParams<TCalls>,
  ) {
    return this.stubs.get<[SendCallsParams<TCalls>], Promise<SendCallsReturn>>({
      method: "sendCalls",
      key: this.createKey(params),
      matchPartial: true,
    })(params);
  }
}

export type OnReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> = Replace<
  Partial<ReadParams<TAbi, TFunctionName>>,
  {
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>;
  }
>;

export type OnMulticallCalls<
  TAbis extends { abi: Abi }[] = { abi: Abi }[],
  TFns extends {
    [K in keyof TAbis]: { fn: FunctionName<TAbis[K]["abi"]> };
  } = {
    [K in keyof TAbis]: { fn: FunctionName<TAbis[K]["abi"]> };
  },
> = {
  [K in keyof TAbis]: TAbis[K] & TFns[K] extends {
    abi?: infer TAbi extends TAbis[K]["abi"];
    fn?: infer TFunctionName extends TFns[K]["fn"];
  }
    ? Replace<
        Partial<FunctionCallParams<TAbi, TFunctionName>>,
        {
          args?: Partial<FunctionArgs<TAbi, TFunctionName>>;
          fn?: TFns[K] extends { fn: infer TFunctionName }
            ? string extends TFunctionName
              ? never // <- Avoid widening to `string`
              : TFunctionName
            : never;
        }
      >
    : TAbis[K] & TFns[K];
};

export interface OnMulticallParams<
  TAbis extends { abi: Abi }[] = { abi: Abi }[],
  TFns extends {
    [K in keyof TAbis]: { fn: FunctionName<TAbis[K]["abi"]> };
  } = {
    [K in keyof TAbis]: { fn: FunctionName<TAbis[K]["abi"]> };
  },
  TAllowFailure extends boolean = boolean,
> extends MulticallOptions<TAllowFailure> {
  calls?: OnMulticallCalls<TAbis, TFns>;
}

export type OnSimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = Replace<
  Partial<SimulateWriteParams<TAbi, TFunctionName>>,
  {
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>;
  }
>;

export type OnWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = Replace<
  Partial<WriteParams<TAbi, TFunctionName>>,
  {
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>;
  }
>;

export type OnDeployParams<TAbi extends Abi = Abi> = Replace<
  Partial<DeployParams<TAbi>>,
  {
    args?: Partial<ConstructorArgs<TAbi>>;
  }
>;

export type StubWalletCallParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OneOf<
  | Replace<
      Partial<FunctionCallParams<TAbi, TFunctionName>>,
      {
        args?: Partial<FunctionArgs<TAbi, TFunctionName>>;
      }
    >
  | Replace<
      Partial<EncodeDeployDataParams<TAbi>>,
      {
        args?: Partial<ConstructorArgs<TAbi>>;
      }
    >
  | Partial<EncodedCallParams>
> &
  WalletCallOptions;

export interface OnSendCallsParams<
  TCalls extends readonly unknown[] = unknown[],
> extends SendCallsOptions {
  calls: {
    [K in keyof TCalls]: NarrowTo<
      { abi: Abi },
      TCalls[K]
    >["abi"] extends infer TAbi extends Abi
      ? StubWalletCallParams<
          TAbi,
          NarrowTo<{ fn: FunctionName<TAbi> }, TCalls[K]>["fn"]
        > extends infer TParams
        ? NarrowTo<TParams, Replace<TParams, TCalls[K]>>
        : never
      : never;
  };
}
