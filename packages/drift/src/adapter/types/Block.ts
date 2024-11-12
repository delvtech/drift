import type { Address, Bytes, Hash } from "src/adapter/types/Abi";

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L1
export interface Block {
  extraData?: Bytes;
  gasLimit: bigint;
  gasUsed: bigint;
  hash: Hash;
  logsBloom: Hash;
  miner: Address;
  mixHash: Hash;
  nonce: bigint;
  /** `null` if pending */
  number: bigint | null;
  parentHash: Hash;
  receiptsRoot: Hash;
  sha3Uncles: Hash;
  size: bigint;
  stateRoot: Hash;
  timestamp: bigint;
  transactions: Hash[];
  transactionsRoot: Hash;
}

// https://github.com/ethereum/execution-apis/blob/3ae3d29fc9900e5c48924c238dff7643fdc3680e/src/schemas/block.yaml#L114
export type BlockTag = "latest" | "earliest" | "pending" | "safe" | "finalized";
