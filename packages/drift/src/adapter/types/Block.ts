import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type { Eval } from "src/utils/types";

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L114
export type BlockTag = "latest" | "earliest" | "pending" | "safe" | "finalized";

/**
 * A block number, hash, or tag that can be used to identify a block.
 */
export type BlockIdentifier = bigint | Hash | BlockTag;

/**
 * A block number, hash, or tag that can be used to identify a mined block.
 */
export type MinedBlockIdentifier = bigint | Hash | Exclude<BlockTag, "pending">;

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
 * A block in the chain, assumed to be mined unless specified otherwise.
 */
export type Block<T extends BlockIdentifier = MinedBlockIdentifier> = Eval<
  BaseBlockProps &
    ("pending" extends BlockStatus<T>
      ? MinedBlockProps<T>
      : Required<MinedBlockProps<T>>)
>;
