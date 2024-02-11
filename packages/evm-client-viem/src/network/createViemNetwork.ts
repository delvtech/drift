import { Network } from "@delvtech/evm-client";
import { PublicClient, TransactionLegacy, rpcTransactionType } from "viem";

export function createNetwork(publicClient: PublicClient): Network {
  return {
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
  };
}
