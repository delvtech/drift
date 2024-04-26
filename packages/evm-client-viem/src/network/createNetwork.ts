import { Network } from '@delvtech/evm-client';
import {
  GetBalanceParameters,
  PublicClient,
  TransactionLegacy,
  rpcTransactionType,
} from 'viem';

export function createNetwork(publicClient: PublicClient): Network {
  return {
    async getBalance(account, options) {
      const { blockHash, blockNumber, blockTag } = options ?? {};

      const parameters: Partial<GetBalanceParameters> = {
        address: account,
      };

      if (blockNumber) {
        parameters.blockNumber = blockNumber;
      } else if (blockTag) {
        parameters.blockTag = blockHash;
      } else if (blockHash) {
        const block = await publicClient.getBlock({ blockHash });
        parameters.blockNumber = block.number;
      }

      return publicClient.getBalance(parameters as GetBalanceParameters);
    },

    async getBlock(args) {
      const block = await publicClient.getBlock(args);

      if (!block) {
        return undefined;
      }

      return { blockNumber: block.number, timestamp: block.timestamp };
    },

    async getTransaction(hash) {
      const {
        blockHash,
        blockNumber,
        from,
        gas,
        gasPrice,
        input,
        nonce,
        to,
        transactionIndex,
        type,
        value,
        chainId,
      } = (await publicClient.getTransaction({
        hash,
      })) as TransactionLegacy;

      return {
        gas,
        gasPrice,
        input,
        nonce,
        type: rpcTransactionType[type],
        value,
        blockHash: blockHash ?? undefined,
        blockNumber: blockNumber ?? undefined,
        from,
        chainId,
        hash,
        to,
        transactionIndex: transactionIndex ?? undefined,
      };
    },

    waitForTransaction(hash, options) {
      return publicClient.waitForTransactionReceipt({
        hash,
        timeout: options?.timeout,
      });
    },
  };
}
