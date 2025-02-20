import type { Address, Hash, HexString } from "src/adapter/types/Abi";
import type { Block, BlockIdentifier, BlockTag } from "src/adapter/types/Block";
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
  getBlock(params?: GetBlockParams): Promise<Block | undefined>;

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

export type GetBlockParams = OneOf<
  | {
      blockHash?: HexString;
    }
  | {
      blockNumber?: bigint;
    }
  | {
      blockTag?: BlockTag;
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
