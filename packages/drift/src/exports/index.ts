// Adapter //

export { deploy } from "src/adapter/methods/deploy";
export { multicall } from "src/adapter/methods/multicall";
export { read } from "src/adapter/methods/read";
export { simulateWrite } from "src/adapter/methods/simulateWrite";
export { write } from "src/adapter/methods/write";
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
  DeployParams,
  EncodeDeployDataParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  GetEventsOptions,
  GetEventsParams,
  MinedRangeBlock,
  MulticallCallResult,
  MulticallOptions,
  MulticallParams,
  MulticallReturn,
  RangeBlock,
  ReadAdapter,
  ReadOptions,
  ReadParams,
  ReadWriteAdapter,
  SendTransactionParams,
  SimulateWriteOptions,
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
  GetBlockReturn,
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
  BaseReadAdapter,
  BaseReadWriteAdapter,
  type BaseAdapterOptions,
} from "src/adapter/BaseAdapter";

export {
  DefaultAdapter,
  DefaultReadAdapter,
  type DefaultAdapterOptions,
} from "src/adapter/DefaultAdapter";

export { arrayToSimplified } from "src/adapter/utils/arrayToSimplified";
export { arrayToObject } from "src/adapter/utils/arrayToObject";
export { prepareParams } from "src/adapter/utils/prepareParams";
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
export type { Store } from "src/store/Store";

export { getOrSet } from "src/store/utils/getOrSet";
export { deleteMatches } from "src/store/utils/deleteMatches";

// Client //

export {
  createClient,
  type Client,
  type ClientOptions,
  type GetBlockOptions,
  type GetBlockWithOptionsReturn,
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
  type ContractBaseOptions,
  type ContractEncodeDeployDataArgs,
  type ContractEncodeFunctionDataArgs,
  type ContractMulticallParams,
  type ContractMulticallReturn,
  type ContractOptions,
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

// Artifacts //

export { IERC20 as erc20 } from "src/artifacts/IERC20";
export { IERC721 as erc721 } from "src/artifacts/IERC721";
export { IERC1155 as erc1155 } from "src/artifacts/IERC1155";
export { IMulticall3 as multicall3 } from "src/artifacts/IMulticall3";

// DriftError //

export { DriftError, type DriftErrorOptions } from "src/error/DriftError";

// Utils //

export { type Converted, convert } from "src/utils/convert";
export { stringifyKey } from "src/utils/stringifyKey";
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
