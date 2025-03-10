// adapter //

export type {
  Abi,
  AbiArrayType,
  AbiEntry,
  AbiEntryName,
  AbiFriendlyType,
  AbiObjectType,
  AbiParameters,
  AbiParametersToObject,
  Address,
  BaseTypes,
  Bytes,
  Hash,
  HexString,
  NamedAbiParameter,
} from "src/adapter/types/Abi";
export type {
  Adapter,
  CallParams,
  DecodeFunctionDataParams,
  DecodeFunctionReturnParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  FunctionArgsParam,
  GetEventsParams,
  OnMinedParam,
  ReadAdapter,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteAdapter,
  WriteParams,
} from "src/adapter/types/Adapter";
export type {
  BaseBlockProps,
  Block,
  BlockIdentifier,
  BlockOverrides,
  BlockStatus,
  BlockTag,
  MinedBlockIdentifier,
  MinedBlockProps,
} from "src/adapter/types/Block";
export type {
  ContractCallOptions,
  ContractGetEventsOptions,
  ContractParams,
  ContractReadOptions,
  ContractWriteOptions,
  MinedRangeBlock,
  RangeBlock,
} from "src/adapter/types/Contract";
export type {
  EventLog,
  EventArgs,
  EventFilter,
  EventName,
} from "src/adapter/types/Event";
export type {
  ConstructorArgs,
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
export type {
  GetBalanceParams,
  GetBlockReturnType,
  GetTransactionParams,
  Network,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
export type {
  MinedTransaction,
  Transaction,
  TransactionInfo,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

export { AbiEncoder } from "src/adapter/AbiEncoder";

export { OxAdapter, type OxAdapterConfig } from "src/adapter/OxAdapter";

export { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
export { arrayToObject } from "src/adapter/utils/arrayToObject";
export { prepareParamsArray } from "src/adapter/utils/prepareParamsArray";
export { decodeFunctionData } from "src/adapter/utils/decodeFunctionData";
export { decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
export {
  encodeFunctionData,
  prepareFunctionData,
} from "src/adapter/utils/encodeFunctionData";
export { encodeFunctionReturn } from "src/adapter/utils/encodeFunctionReturn";
export { encodeBytecodeCallData } from "src/adapter/utils/encodeBytecodeCallData";

// store //

export {
  LruStore,
  type LruStoreConfig,
} from "src/store/LruStore";
export type { Store } from "src/store/types";
export type { getOrSet } from "src/store/utils";

// client //

export {
  createClient,
  type Client,
  type ClientAdapterOptions,
  type ClientConfigType,
  type ClientOptions,
  type ClientConfig,
  type ReadClient,
  type ReadWriteClient,
} from "src/client/Client";

export { type Drift, type DriftConfig, createDrift } from "src/client/Drift";

export {
  createContract,
  ReadContract,
  ReadWriteContract,
  type Contract,
  type ContractConfig,
  type ContractClientOptions,
  type ContractEncodeFunctionDataArgs,
  type ContractReadArgs,
  type ContractSimulateWriteArgs,
  type ContractWriteArgs,
} from "src/client/contract/Contract";

export {
  ClientCache,
  type ClientCacheConfig,
} from "src/client/cache/ClientCache";

export {
  MethodInterceptor,
  type MethodHooks,
} from "src/client/hooks/MethodInterceptor";

export type {
  HookHandler,
  HookName,
  HookPayload,
  HookRegistry,
} from "src/client/hooks/HookRegistry";

export { BlockNotFoundError } from "src/client/errors";

// error //

export { DriftError, type DriftErrorOptions } from "src/error/DriftError";

// utils //

export { type Converted, convertType } from "src/utils/convertType";
export { stringifyKey } from "src/utils/stringifyKey";
export { getRandomHex } from "src/utils/testing/getRandomHex";
export { isHexString } from "src/utils/isHexString";
export type {
  AnyFunction,
  AnyObject,
  EmptyObject,
  Eval,
  Extended,
  FunctionKey,
  MaybeAwaited,
  MaybePromise,
  OneOf,
  PartialBy,
  Replace,
  RequiredBy,
  UnionKey,
} from "src/utils/types";

// ...rest //

export { ZERO_ADDRESS } from "src/constants";
