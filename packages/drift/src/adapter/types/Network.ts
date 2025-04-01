import type { Address, Hash } from "src/adapter/types/Abi";
import type { Block, BlockIdentifier, BlockTag } from "src/adapter/types/Block";
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
   * Get the current block number.
   */
  getBlockNumber(): Promise<bigint>;

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock<T extends BlockIdentifier | undefined = undefined>(
    block?: T,
  ): Promise<GetBlockReturnType<T>>;

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

export interface GetTransactionParams {
  hash: Hash;
}

/**
 * The awaited return type of a {@linkcode Network.getBlock} call considering
 * the provided {@linkcode BlockIdentifier}.
 */
export type GetBlockReturnType<
  T extends BlockIdentifier | undefined = undefined,
> = T extends BlockTag | undefined ? Block<T> : Block<T> | undefined;

export interface WaitForTransactionParams extends GetTransactionParams {
  /**
   * The number of milliseconds to wait for the transaction until rejecting
   * the promise.
   */
  timeout?: number;
}
