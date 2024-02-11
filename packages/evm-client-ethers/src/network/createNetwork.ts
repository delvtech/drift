import { Network } from "@delvtech/evm-client";
import { Provider } from "ethers";

export function createNetwork(provider: Provider): Network {
  return {
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
  };
}
