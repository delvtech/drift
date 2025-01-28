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
  BlockBase,
  Block,
  BlockTag,
  MinedBlock,
  MinedBlockProps,
} from "src/adapter/types/Block";
export type {
  ContractParams,
  ContractCallOptions,
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
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

export { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
export { arrayToObject } from "src/adapter/utils/arrayToObject";
export { objectToArray } from "src/adapter/utils/objectToArray";
export { decodeFunctionData } from "src/adapter/utils/decodeFunctionData";
export { decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
export { encodeFunctionData } from "src/adapter/utils/encodeFunctionData";
export { encodeFunctionReturn } from "src/adapter/utils/encodeFunctionReturn";
export { prepareBytecodeCallData } from "src/adapter/utils/prepareBytecodeCallData";

// cache //

export {
  LruSimpleCache,
  type LruSimpleCacheConfig,
} from "src/cache/LruSimpleCache";
export type { SimpleCache } from "src/cache/types";

// client //

export {
  createClient,
  type Client,
  type ClientAdapterOptions,
  type ClientOptions,
  type ClientConfig,
  type ReadClient,
  type ReadWriteClient,
  type AdapterType,
  type CacheType,
} from "src/client/Client";

export { type Drift, createDrift } from "src/client/Drift";

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
  ClientCacheError,
  type ClientCacheConfig,
} from "src/client/cache/ClientCache";

export {
  MethodInterceptor,
  type MethodHooks,
} from "src/client/hooks/MethodInterceptor";

export {
  type HookHandler,
  type HookName,
  type HookPayload,
  type HookRegistry,
} from "src/client/hooks/HookRegistry";

// error //

export { DriftError, type DriftErrorOptions } from "src/error/DriftError";

// utils //

export { type Converted, convertType } from "src/utils/convertType";
export {
  createSerializableKey,
  type SerializableKey,
} from "src/utils/createSerializableKey";
export { extendInstance } from "src/utils/extendInstance";
export { getRandomHex } from "src/utils/testing/getRandomHex";
export type {
  AnyFunction,
  AnyObject,
  DeepPartial,
  EmptyObject,
  FunctionKey,
  MaybeAwaited,
  MaybePromise,
  MergeKeys,
  OneOf,
  OptionalKeys,
  Pretty,
  ReplaceProps,
  RequiredKeys,
  UnionToIntersection,
  Extended,
  AwaitedReturnType,
  Fallback,
} from "src/utils/types";

// ...rest //

export { ZERO_ADDRESS } from "src/constants";
