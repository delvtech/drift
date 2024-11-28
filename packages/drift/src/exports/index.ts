// adapter //

export type {
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
  FunctionArgsParam,
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  SimulateWriteParams,
  WriteParams,
  OnMinedParam,
  ReadAdapter,
  ReadWriteAdapter,
  WriteAdapter,
} from "src/adapter/types/Adapter";
export type {
  BlockBase,
  Block,
  BlockTag,
  MinedBlock,
  MinedBlockProps,
} from "src/adapter/types/Block";
export type {
  ContractWriteOptions,
  ContractGetEventsOptions,
  ContractReadOptions,
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
  Network,
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
export type {
  MinedTransaction,
  Transaction,
  TransactionInfo,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

export {
  OxAdapter,
  type OxAdapterConfig,
} from "src/adapter/OxAdapter";

export { arrayToObject } from "src/adapter/utils/arrayToObject";
export { objectToArray } from "src/adapter/utils/objectToArray";

// cache //

export {
  LruSimpleCache,
  type LruSimpleCacheConfig,
} from "src/cache/LruSimpleCache";
export type { SimpleCache } from "src/cache/types";
export {
  ClientCache,
  ClientCacheError,
  type ClientCacheConfig,
} from "src/cache/ClientCache";

// clients //

export {
  BaseClient,
  ClientError,
  ReadonlyError,
  type ClientAdapterOptions,
  type ClientOptions,
  type ClientConfig,
  type ReadClient,
  type ReadWriteClient,
} from "src/client/BaseClient";

export {
  Contract,
  type ContractEncodeFunctionDataArgs,
  type ContractGetEventsArgs,
  type ContractConfig,
  type ContractReadArgs,
  type ContractWriteArgs,
  type ReadContract,
  type ReadWriteContract,
  type ContractClientOptions,
  type ContractOptions,
  type ContractSimulateWriteArgs,
} from "src/client/contract/Contract";

export { Drift } from "src/client/drift/Drift";

// error //

export { DriftError, type DriftErrorOptions } from "src/error/DriftError";

// utils //

export { type Converted, convertType } from "src/utils/convertType";
export {
  createSerializableKey,
  type SerializableKey,
} from "src/utils/createSerializableKey";
export { extendInstance } from "src/utils/extendInstance";
export { getRandomHex } from "src/utils/getRandomHex";
export type {
  AnyFunction,
  AnyObject,
  DeepPartial,
  EmptyObject,
  FunctionKey,
  MaybePromise,
  MergeKeys,
  OneOf,
  OptionalKeys,
  Pretty,
  ReplaceProps,
  RequiredKeys,
  UnionToIntersection,
} from "src/utils/types";

// ...rest //

export { ZERO_ADDRESS } from "src/constants";
