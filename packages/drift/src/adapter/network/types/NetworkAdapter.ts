import type { Block, BlockTag } from "src/adapter/network/types/Block";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/network/types/Transaction";
import type { Address, HexString, TransactionHash } from "src/types";

// https://ethereum.github.io/execution-apis/api-documentation/

/**
 * An interface representing data the SDK needs to get from the network.
 */
export interface NetworkAdapter {
  /**
   * Get the balance of native currency for an account.
   */
  getBalance(...args: NetworkGetBalanceArgs): Promise<bigint>;

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock(...args: NetworkGetBlockArgs): Promise<Block | undefined>;

  /**
   * Get the chain ID of the network.
   */
  getChainId(): Promise<number>;

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction(
    ...args: NetworkGetTransactionArgs
  ): Promise<Transaction | undefined>;

  /**
   * Wait for a transaction to be mined.
   */
  waitForTransaction(
    ...args: NetworkWaitForTransactionArgs
  ): Promise<TransactionReceipt | undefined>;
}

export type NetworkGetBlockOptions =
  | {
      blockHash?: HexString;
      blockNumber?: never;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      blockNumber?: bigint;
      blockTag?: never;
    }
  | {
      blockHash?: never;
      blockNumber?: never;
      blockTag?: BlockTag;
    };

export type NetworkGetBalanceArgs = [
  address: Address,
  block?: NetworkGetBlockOptions,
];

export type NetworkGetBlockArgs = [options?: NetworkGetBlockOptions];

export type NetworkGetTransactionArgs = [hash: TransactionHash];

export type NetworkWaitForTransactionArgs = [
  hash: TransactionHash,
  options?: {
    /**
     * The number of milliseconds to wait for the transaction until rejecting
     * the promise.
     */
    timeout?: number;
  },
];
