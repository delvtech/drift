import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type { Eval, Replace } from "src/utils/types";

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L114
export type BlockTag = "latest" | "earliest" | "pending" | "safe" | "finalized";

/**
 * A block number, hash, or tag that can be used to identify a block.
 */
export type BlockIdentifier = bigint | Hash | BlockTag;

/**
 * A block number, hash, or tag that can be used to identify a mined block.
 */
export type MinedBlockIdentifier = Exclude<BlockIdentifier, "pending">;

/**
 * The status of a block. (pending | mined)
 */
export type BlockStatus<T extends BlockIdentifier = BlockIdentifier> =
  T extends "pending"
    ? "pending"
    : "pending" extends T
      ? "mined" | "pending"
      : "mined";

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L1

/**
 * Core block properties
 */
export interface BaseBlockProps {
  extraData?: Bytes;
  gasLimit: bigint;
  gasUsed: bigint;
  miner: Address;
  mixHash: Hash;
  parentHash: Hash;
  receiptsRoot: Hash;
  sha3Uncles: Hash;
  size: bigint;
  stateRoot: Hash;
  timestamp: bigint;
  transactions: Hash[];
  transactionsRoot: Hash;
}

/**
 * Block properties that are conditionally available (undefined if pending)
 */
export interface MinedBlockProps<T extends BlockIdentifier = BlockIdentifier> {
  /** `undefined` if pending */
  hash?: T extends Hash ? T : Hash;
  /** `undefined` if pending */
  logsBloom?: Hash;
  /** `undefined` if pending */
  nonce?: bigint;
  /** `undefined` if pending */
  number?: T extends bigint ? T : bigint;
}

/**
 * Augmentable overrides for the {@linkcode Block} type. Adapter libs can merge
 * into this interface to customize block properties.
 */
export interface BlockOverrides<T extends BlockIdentifier> {}

/**
 * A block in the chain, assumed to be mined unless specified otherwise.
 */
export type Block<T extends BlockIdentifier = MinedBlockIdentifier> = Eval<
  Replace<
    BaseBlockProps &
      ("pending" extends BlockStatus<T>
        ? MinedBlockProps<T>
        : Required<MinedBlockProps<T>>),
    BlockOverrides<T>
  >
>;
