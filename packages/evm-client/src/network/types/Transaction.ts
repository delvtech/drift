// https://github.com/ethereum/execution-apis/blob/e3d2745289bd2bb61dc8593069871be4be441952/src/schemas/transaction.yaml#L329
export interface TransactionInfo {
  blockHash?: `0x${string}`;
  blockNumber?: bigint;
  from?: `0x${string}`;
  hash?: `0x${string}`;
  transactionIndex?: number;
}

/** Basic legacy compatible transaction */
// https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml#L184
export interface Transaction extends TransactionInfo {
  type: `0x${string}`;
  nonce: number;
  gas: bigint;
  value: bigint;
  input: `0x${string}`;
  gasPrice: bigint;
  chainId?: number;
  to?: `0x${string}` | null;
}

export type MinedTransaction = Transaction & Required<TransactionInfo>;

// https://github.com/ethereum/execution-apis/blob/e3d2745289bd2bb61dc8593069871be4be441952/src/schemas/receipt.yaml#L37
export interface TransactionReceipt {
  type?: `0x${string}`;
  blockHash: `0x${string}`;
  blockNumber: bigint;
  from: `0x${string}`;
  cumulativeGasUsed: bigint;
  gasUsed: bigint;
  // TODO:
  // logs: Log[];
  logsBloom: `0x${string}`;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  effectiveGasPrice: bigint;
}
