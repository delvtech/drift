import type { Address, Hash } from "src/adapter/types/Abi";
import type {
  Block,
  BlockIdentifier,
  BlockTag,
  MinedBlockIdentifier,
} from "src/adapter/types/Block";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import type { OneOf } from "src/utils/types";

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
   * Get the current block number.
   */
  getBlockNumber(): Promise<bigint>;

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock<T extends BlockIdentifier = MinedBlockIdentifier>(
    params?: GetBlockParams<T>,
  ): Promise<Block<T> | undefined>;

  /**
   * Get the balance of native currency for an account.
   */
  getBalance(params: GetBalanceParams): Promise<bigint>;

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined>;

  /**
   * Wait for a transaction to be mined.
   */
  waitForTransaction(
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined>;
}

export interface GetBalanceParams {
  address: Address;
  block?: BlockIdentifier;
}

export type GetBlockParams<T extends BlockIdentifier = BlockIdentifier> = OneOf<
  | {
      blockHash: T extends Hash ? T : never;
    }
  | {
      blockNumber: T extends bigint ? T : never;
    }
  | {
      blockTag: T extends BlockTag ? T : never;
    }
>;

export interface GetTransactionParams {
  hash: Hash;
}

export interface WaitForTransactionParams extends GetTransactionParams {
  /**
   * The number of milliseconds to wait for the transaction until rejecting
   * the promise.
   */
  timeout?: number;
}
