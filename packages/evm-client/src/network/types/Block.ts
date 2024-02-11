export interface Block {
  /** `null` if pending */
  blockNumber: bigint | null;
  timestamp: bigint;
}

// ETH JSON-RPC Types
// TODO: Find or build an OS types package (e.g., @types/evm-json-rpc)
// https://github.com/ethereum/execution-apis/tree/main
// https://github.com/ethereum/execution-apis/blob/main/src/schemas/block.yaml#L105
export type BlockTag = 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized';
