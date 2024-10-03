import type { Abi } from "abitype";
import { type SinonStub, stub as createStub } from "sinon";
import type { Event, EventName } from "src/adapter/contract/types/event";
import type {
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type {
  NetworkGetBalanceArgs,
  NetworkGetBlockArgs,
  NetworkGetTransactionArgs,
  NetworkWaitForTransactionArgs,
} from "src/adapter/network/types/NetworkAdapter";
import type {
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  WriteParams,
} from "src/adapter/types";
import type { Address, Bytes, TransactionHash } from "src/types";
import type { OptionalKeys } from "src/utils/types";

// TODO: Allow configuration of error throwing/default return value behavior
export class MockAdapter implements ReadWriteAdapter {
  // stubs //

  protected stubs = new Map<string, SinonStub>();

  protected getStub<TInsert extends boolean | (() => SinonStub)>({
    key,
    create,
  }: {
    key: string;
    create?: TInsert;
  }): TInsert extends false | undefined ? SinonStub | undefined : SinonStub {
    let stub = this.stubs.get(key);
    if (!stub && create) {
      stub = typeof create === "function" ? create() : createStub();
      this.stubs.set(key, stub);
    }
    return stub as any;
  }

  reset() {
    this.stubs.clear();
  }

  // getBalance //

  protected get getBalanceStub() {
    return this.getStub({
      key: "getBalance",
      create: () => createStub().resolves(0n),
    });
  }

  getBalance(...args: NetworkGetBalanceArgs) {
    return this.getBalanceStub(...args);
  }

  onGetBalance(...args: Partial<NetworkGetBalanceArgs>) {
    return this.getBalanceStub.withArgs(...args);
  }

  // getBlock //

  protected get getBlockStub() {
    return this.getStub({
      key: "getBlock",
      create: () =>
        createStub().resolves({
          blockNumber: 0n,
          timestamp: 0n,
        }),
    });
  }

  getBlock(...args: NetworkGetBlockArgs) {
    return this.getBlockStub(...args);
  }

  onGetBlock(...args: Partial<NetworkGetBlockArgs>) {
    return this.getBlockStub.withArgs(...args);
  }

  // getChainId //

  protected get getChainIdStub() {
    return this.getStub({
      key: "getChainId",
      create: () => createStub().resolves(0),
    });
  }

  getChainId() {
    return this.getChainIdStub();
  }

  onGetChainId() {
    return this.getChainIdStub;
  }

  // getTransaction //

  protected get getTransactionStub() {
    return this.getStub({
      key: "getTransaction",
      create: () => createStub().resolves(undefined),
    });
  }

  getTransaction(...args: NetworkGetTransactionArgs) {
    return this.getTransactionStub(...args);
  }

  onGetTransaction(...args: Partial<NetworkGetTransactionArgs>) {
    return this.getTransactionStub.withArgs(...args);
  }

  // waitForTransaction //

  protected get waitForTransactionStub() {
    return this.getStub({
      key: "waitForTransaction",
      create: () => createStub().resolves(undefined),
    });
  }

  waitForTransaction(...args: NetworkWaitForTransactionArgs) {
    return this.waitForTransactionStub(...args);
  }

  onWaitForTransaction(...args: Partial<NetworkWaitForTransactionArgs>) {
    return this.waitForTransactionStub.withArgs(...args);
  }

  // encodeFunction //

  protected get encodeFunctionDataStub() {
    return this.getStub({
      key: "encodeFunctionData",
      create: () => createStub().returns("0x0"),
    });
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
    return this.encodeFunctionDataStub(params);
  }

  onEncodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataStubParams<TAbi, TFunctionName>) {
    return this.encodeFunctionDataStub.withArgs(params);
  }

  // decodeFunction //

  // TODO: This should be specific to the abi to ensure the correct return type.
  protected decodeFunctionDataStubKey({
    fn,
  }: Partial<DecodeFunctionDataParams>) {
    return `decodeFunctionData:${fn}`;
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName> {
    const stub = this.getStub({
      key: this.decodeFunctionDataStubKey(params),
    });
    if (!stub) {
      throw new NotImplementedError({
        name: params.fn || params.data,
        method: "decodeFunctionData",
        stubMethod: "onDecodeFunctionData",
      });
    }
    return stub(params);
  }

  // TODO: Does calling `onDecodeFunctionData` without calling any methods on
  // it, e.g. `returns`, break the error behavior?
  onDecodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: DecodeFunctionDataStubParams<TAbi, TFunctionName>) {
    return this.getStub({
      key: this.decodeFunctionDataStubKey(params),
      create: true,
    }).withArgs(params);
  }

  // getEvents //

  protected getEventsStubKey({
    address,
    event,
  }: Partial<GetEventsParams<any>>): string {
    return `getEvents:${address}:${event}`;
  }

  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<Event<TAbi, TEventName>[]> {
    const stub = this.stubs.get(this.getEventsStubKey(params));
    if (!stub) {
      return Promise.reject(
        new NotImplementedError({
          name: params.event,
          method: "getEvents",
          stubMethod: "onGetEvents",
        }),
      );
    }
    return Promise.resolve(stub(params));
  }

  onGetEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ) {
    return this.getStub<
      [GetEventsParams<TAbi, TEventName>],
      Promise<Event<TAbi, TEventName>[]>
    >({
      key: this.getEventsStubKey(params),
      args: [params],
    });
  }

  // read //

  protected readStubKey({ address, fn }: ReadStubParams) {
    return `read:${address}:${fn}`;
  }

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const stub = this.stubs.get(this.readStubKey(params));
    if (!stub) {
      return Promise.reject(
        new NotImplementedError({
          name: params.fn,
          method: "read",
          stubMethod: "onRead",
        }),
      );
    }
    return Promise.resolve(stub(params));
  }

  onRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadStubParams<TAbi, TFunctionName>) {
    return this.getStub<
      [ReadStubParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      key: this.readStubKey(params),
      args: [params],
    });
  }

  // simulateWrite //

  protected simulateWriteStubKey({ address, fn }: WriteStubParams) {
    return `simulateWrite:${address}:${fn}`;
  }

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: WriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const stub = this.stubs.get(this.simulateWriteStubKey(params));
    if (!stub) {
      return Promise.reject(
        new NotImplementedError({
          name: params.fn,
          method: "simulateWrite",
          stubMethod: "onSimulateWrite",
        }),
      );
    }
    return Promise.resolve(stub(params));
  }

  onSimulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteStubParams<TAbi, TFunctionName>) {
    return this.getStub<
      [WriteStubParams<TAbi, TFunctionName>],
      Promise<FunctionReturn<TAbi, TFunctionName>>
    >({
      key: this.simulateWriteStubKey(params),
      args: [params],
    });
  }

  // write //

  protected get writeStub() {
    return this.getStub<[WriteStubParams], Bytes>({
      key: "write",
    }).returns("0x0");
  }

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<TransactionHash> {
    return Promise.resolve(this.writeStub(params));
  }

  onWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteStubParams<TAbi, TFunctionName>) {
    return this.writeStub.withArgs(params);
  }

  // getSignerAddress //

  protected get getSignerAddressStub() {
    const key = "getSignerAddress";
    let stub = this.stubs.get(key);
    if (!stub) {
      stub = createStub().resolves("0xMockSigner");
      this.stubs.set(key, stub);
    }
  }

  onGetSignerAddress() {
    return this.getSignerAddressStub;
  }

  getSignerAddress(): Promise<Address> {
    return Promise.resolve(this.getSignerAddressStub());
  }
}

// TODO: Make address optional and create a key from the abi entry and fn name.
export type ReadStubParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<ReadParams<TAbi, TFunctionName>, "args">;

export type WriteStubParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<WriteParams<TAbi, TFunctionName>, "args" | "abi">;

export type EncodeFunctionDataStubParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<EncodeFunctionDataParams<TAbi, TFunctionName>, "args">;

export type DecodeFunctionDataStubParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OptionalKeys<DecodeFunctionDataParams<TAbi, TFunctionName>, "data" | "abi">;

class NotImplementedError extends Error {
  constructor({
    method,
    stubMethod,
    name,
  }: { method: string; stubMethod: string; name?: string }) {
    // TODO: This error message is not accurate.
    super(
      `Called ${method}${name ? ` for "${name}"` : ""} on a MockAdapter without a return value. The function must be stubbed first:\n\tadapter.${stubMethod}("${name}").resolves(value)`,
    );
    this.name = "NotImplementedError";
  }
}
