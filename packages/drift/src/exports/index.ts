// Adapter //

export type {
  Abi,
  AbiArrayType,
  AbiEntry,
  AbiEntryName,
  AbiSimplifiedType,
  AbiObjectType,
  AbiParameters,
  AbiParametersToObject,
  Address,
  BaseTypeOverrides,
  Bytes,
  Hash,
  HexString,
  NamedAbiParameter,
} from "src/adapter/types/Abi";
export type {
  Adapter,
  CallOptions,
  CallParams,
  ContractParams,
  DecodeFunctionDataParams,
  DecodeFunctionReturnParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  DeployParams,
  EncodeDeployDataParams,
  GetEventsOptions,
  GetEventsParams,
  MinedRangeBlock,
  RangeBlock,
  ReadAdapter,
  ReadOptions,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteAdapter,
  WriteOptions,
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
  Eip4844Options,
  MinedTransaction,
  Transaction,
  TransactionInfo,
  TransactionOptions,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

export { AbiEncoder } from "src/adapter/AbiEncoder";

export {
  DefaultAdapter,
  type DefaultAdapterOptions,
} from "src/adapter/DefaultAdapter";

export { arrayToSimplified } from "src/adapter/utils/arrayToSimplified";
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

// Store //

export {
  LruStore,
  type LruStoreOptions,
} from "src/store/LruStore";
export type { Store } from "src/store/types";

export { getOrSet } from "src/store/utils/getOrSet";
export { deleteMatches } from "src/store/utils/deleteMatches";

// Client //

export {
  createClient,
  type Client,
  type ClientOptions,
} from "src/client/Client";

export {
  ClientCache,
  type ClientCacheOptions,
} from "src/client/cache/ClientCache";

export {
  createDrift,
  type Drift,
  type DriftOptions,
} from "src/client/Drift";

export {
  createContract,
  ReadContract,
  ReadWriteContract,
  type Contract,
  type ContractOptions,
  type ContractBaseOptions,
  type ContractEncodeDeployDataArgs,
  type ContractEncodeFunctionDataArgs,
  type ContractReadArgs,
  type ContractSimulateWriteArgs,
  type ContractWriteArgs,
} from "src/client/contract/Contract";

export {
  ContractCache,
  type ContractCacheOptions,
} from "src/client/contract/cache/ContractCache";

export {
  MethodInterceptor,
  type MethodHooks,
} from "src/client/hooks/MethodInterceptor";

export type {
  HookHandler,
  HookName,
  HookRegistry,
} from "src/client/hooks/HookRegistry";

export { BlockNotFoundError } from "src/client/errors";

// DriftError //

export { DriftError, type DriftErrorOptions } from "src/error/DriftError";

// Utils //

export { type Converted, convertType } from "src/utils/convertType";
export { stringifyKey } from "src/utils/stringifyKey";
export { getRandomHex } from "src/utils/testing/getRandomHex";
export { isHexString, HEX_REGEX } from "src/utils/isHexString";
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

// ...Rest //

export { ZERO_ADDRESS } from "src/constants";
