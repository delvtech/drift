import type { Address, Bytes, Hash } from "src/adapter/types/Abi";

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L1
export interface BlockBase {
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

export interface MinedBlockProps {
  /** `undefined` if pending */
  hash?: Hash;
  /** `undefined` if pending */
  logsBloom?: Hash;
  /** `undefined` if pending */
  nonce?: bigint;
  /** `undefined` if pending */
  number?: bigint;
}

export interface Block extends BlockBase, MinedBlockProps {}

export interface MinedBlock extends BlockBase, Required<MinedBlockProps> {}

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L114
export type BlockTag = "latest" | "earliest" | "pending" | "safe" | "finalized";
