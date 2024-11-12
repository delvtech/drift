import type { Address, Bytes, Hash, HexString } from "src/adapter/types/Abi";

// https://github.com/ethereum/execution-apis/blob/e3d2745289bd2bb61dc8593069871be4be441952/src/schemas/transaction.yaml#L329
export interface TransactionInfo {
  blockHash?: Hash;
  blockNumber?: bigint;
  from?: Address;
  hash?: Hash;
  transactionIndex?: number;
}

/** Legacy + EIP-1559 compatible transaction */
// https://github.com/ethereum/execution-apis/blob/e8727564bb74a1ebcd22a933b7b57eb7b71a11c3/src/schemas/transaction.yaml#L78
// https://github.com/ethereum/execution-apis/blob/e8727564bb74a1ebcd22a933b7b57eb7b71a11c3/src/schemas/transaction.yaml#L184
export interface Transaction extends TransactionInfo {
  type: HexString;
  nonce: number;
  gas: bigint;
  value: bigint;
  input: Bytes;
  gasPrice?: bigint;
  chainId?: number;
  to?: Address | null;
}

export type MinedTransaction = Transaction & Required<TransactionInfo>;

// https://github.com/ethereum/execution-apis/blob/e3d2745289bd2bb61dc8593069871be4be441952/src/schemas/receipt.yaml#L37
export interface TransactionReceipt {
  blockHash: Hash;
  blockNumber: bigint;
  from: Address;
  /**
   * Address of the receiver or `null` in a contract creation transaction.
   */
  to: Address | null;
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
  logsBloom: Bytes;
  transactionHash: Hash;
  transactionIndex: number;

  status: "success" | "reverted";

  /**
   * The actual value per gas deducted from the sender's account. Before
   * EIP-1559, this is equal to the transaction's gas price. After, it is equal
   * to baseFeePerGas + min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas).
   */
  effectiveGasPrice: bigint;
}
