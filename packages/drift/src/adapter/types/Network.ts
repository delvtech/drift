import type { Address, Hash, HexString } from "src/adapter/types/Abi";
import type { Block, BlockTag } from "src/adapter/types/Block";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

// https://ethereum.github.io/execution-apis/api-documentation/

/**
 * An interface representing data the SDK needs to get from the network.
 */
export interface Network {
  /**
   * Get the chain ID of the network.
   */
  getChainId(): Promise<number>;

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock(params?: NetworkGetBlockParams): Promise<Block | undefined>;

  /**
   * Get the balance of native currency for an account.
   */
  getBalance(params: NetworkGetBalanceParams): Promise<bigint>;

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction(
    params: NetworkGetTransactionParams,
  ): Promise<Transaction | undefined>;

  /**
   * Wait for a transaction to be mined.
   */
  waitForTransaction(
    params: NetworkWaitForTransactionParams,
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

export type NetworkGetBalanceParams = {
  address: Address;
} & NetworkGetBlockOptions;

export type NetworkGetBlockParams = NetworkGetBlockOptions;

export interface NetworkGetTransactionParams {
  hash: Hash;
}

export interface NetworkWaitForTransactionParams
  extends NetworkGetTransactionParams {
  /**
   * The number of milliseconds to wait for the transaction until rejecting
   * the promise.
   */
  timeout?: number;
}
