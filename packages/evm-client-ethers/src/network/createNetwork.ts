import type { Network } from "@delvtech/evm-client";
import type { Provider } from "ethers";

export function createNetwork(provider: Provider): Network {
  return {
    async getBalance(account, options = {}) {
      const { blockHash, blockNumber, blockTag } = options;

      return provider.getBalance(
        account,
        blockHash || blockNumber || blockTag || "latest",
      );
    },

    async getBlock(options = {}) {
      const { blockHash, blockNumber, blockTag } = options;

      const block = await provider.getBlock(
        blockHash || blockNumber || blockTag || "latest",
      );

      if (!block) {
        return;
      }

      const { number, timestamp } = block;

      return {
        blockNumber: BigInt(number),
        timestamp: BigInt(timestamp),
      };
    },

    async getChainId() {
      const network = await provider.getNetwork();
      return Number(network.chainId);
    },

    async getTransaction(hash) {
      const transaction = await provider.getTransaction(hash);

      if (!transaction) {
        return;
      }

      const {
        blockHash,
        blockNumber,
        from,
        gasLimit,
        gasPrice,
        data,
        nonce,
        to,
        index,
        type,
        value,
        chainId,
      } = transaction;

      return {
        blockHash: blockHash ? (blockHash as `0x${string}`) : undefined,
        blockNumber: blockNumber ? BigInt(blockNumber) : undefined,
        from: from as `0x${string}`,
        gas: BigInt(gasLimit),
        gasPrice: BigInt(gasPrice),
        input: data as `0x${string}`,
        nonce,
        to: typeof to === "string" ? (to as `0x${string}`) : to,
        value: BigInt(value),
        type: type.toString(16) as `0x${number}`,
        chainId: Number(chainId),
        hash,
        transactionIndex: index,
      };
    },

    async waitForTransaction(hash, options) {
      const transaction = await provider.waitForTransaction(
        hash,
        undefined,
        options?.timeout,
      );

      if (!transaction) {
        return;
      }

      // status is either 0 (reverted) or 1 (success)
      const status = !transaction.status ? "reverted" : "success";

      return {
        blockHash: transaction.blockHash as `0x${string}`,
        blockNumber: BigInt(transaction.blockNumber),
        from: transaction.from as `0x${string}`,
        to: transaction.to as `0x${string}` | null,
        cumulativeGasUsed: BigInt(transaction.cumulativeGasUsed),
        gasUsed: BigInt(transaction.gasUsed),
        logsBloom: transaction.logsBloom as `0x${string}`,
        transactionHash: transaction.hash as `0x${string}`,
        transactionIndex: transaction.index,
        effectiveGasPrice: BigInt(transaction.gasPrice),
        status,
      };
    },
  };
}
