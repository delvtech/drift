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
  blockHash: `0x${string}`;
  blockNumber: bigint;
  from: `0x${string}`;
  /**
   * Address of the receiver or `null` in a contract creation transaction.
   */
  to: `0x${string}` | null;
  /**
   * The sum of gas used by this transaction and all preceding transactions in
   * the same block.
   */
  cumulativeGasUsed: bigint;
  /**
   * The amount of gas used for this specific transaction alone.
   */
  gasUsed: bigint;
  // TODO:
  // logs: Log[];
  logsBloom: `0x${string}`;
  transactionHash: `0x${string}`;
  transactionIndex: number;

  status: 'success' | 'reverted';

  /**
   * The actual value per gas deducted from the sender's account. Before
   * EIP-1559, this is equal to the transaction's gas price. After, it is equal
   * to baseFeePerGas + min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas).
   */
  effectiveGasPrice: bigint;
}
