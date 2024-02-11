import { Block, BlockTag } from 'src/network/types/Block';
import { Transaction } from 'src/network/types/Transaction';

// https://ethereum.github.io/execution-apis/api-documentation/

/**
 * An interface representing data the SDK needs to get from the network.
 */
export interface Network {
  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock(...args: NetworkGetBlockArgs): Promise<Block | undefined>;

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction(
    ...args: NetworkGetTransactionArgs
  ): Promise<Transaction | undefined>;
}

export type NetworkGetBlockArgs = [
  options?:
    | {
        blockHash?: `0x${string}`;
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
        /**
         * @default 'latest'
         */
        blockTag?: BlockTag;
      },
];

export type NetworkGetTransactionArgs = [hash: `0x${string}`];
