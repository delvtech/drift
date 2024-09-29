import { type SinonStub, stub } from "sinon";
import type { Block } from "src/network/types/Block";
import type {
  Network,
  NetworkGetBalanceArgs,
  NetworkGetBlockArgs,
  NetworkGetTransactionArgs,
  NetworkWaitForTransactionArgs,
} from "src/network/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/network/types/Transaction";

/**
 * A mock implementation of a `Network` designed to facilitate unit
 * testing.
 */
export class NetworkStub implements Network {
  protected getBalanceStub:
    | SinonStub<[NetworkGetBalanceArgs?], Promise<bigint>>
    | undefined;
  protected getBlockStub:
    | SinonStub<[NetworkGetBlockArgs?], Promise<Block | undefined>>
    | undefined;
  protected getChainIdStub: SinonStub<[], Promise<number>> | undefined;
  protected getTransactionStub:
    | SinonStub<[NetworkGetTransactionArgs?], Promise<Transaction | undefined>>
    | undefined;

  stubGetBalance({
    args,
    value,
  }: {
    args?: NetworkGetBalanceArgs | undefined;
    value: bigint;
  }): void {
    if (!this.getBalanceStub) {
      this.getBalanceStub = stub();
    }

    // Account for dynamic args if provided
    if (args) {
      this.getBalanceStub.withArgs(args).resolves(value);
      return;
    }

    this.getBalanceStub.resolves(value);
  }

  stubGetBlock({
    args,
    value,
  }: {
    args?: NetworkGetBlockArgs | undefined;
    value: Block | undefined;
  }): void {
    if (!this.getBlockStub) {
      this.getBlockStub = stub();
    }

    // Account for dynamic args if provided
    if (args) {
      this.getBlockStub.withArgs(args).resolves(value);
      return;
    }

    this.getBlockStub.resolves(value);
  }

  stubGetChainId(id: number): void {
    if (!this.getChainIdStub) {
      this.getChainIdStub = stub();
    }

    this.getChainIdStub.resolves(id);
  }

  stubGetTransaction({
    args,
    value,
  }: {
    args?: NetworkGetTransactionArgs;
    value: Transaction | undefined;
  }): void {
    if (!this.getTransactionStub) {
      this.getTransactionStub = stub();
    }

    // Account for dynamic args if provided
    if (args) {
      this.getTransactionStub.withArgs(args).resolves(value);
      return;
    }

    this.getTransactionStub.resolves(value);
  }

  getBalance(...args: NetworkGetBalanceArgs): Promise<bigint> {
    if (!this.getBalanceStub) {
      throw new Error(
        "The getBalance function must be stubbed first:\n\tcontract.stubGetBalance()",
      );
    }
    return this.getBalanceStub(args);
  }

  getBlock(...args: NetworkGetBlockArgs): Promise<Block | undefined> {
    if (!this.getBlockStub) {
      throw new Error(
        "The getBlock function must be stubbed first:\n\tcontract.stubGetBlock()",
      );
    }
    return this.getBlockStub(args);
  }

  getChainId(): Promise<number> {
    if (!this.getChainIdStub) {
      throw new Error(
        "The getChainId function must be stubbed first:\n\tcontract.stubGetChainId()",
      );
    }
    return this.getChainIdStub();
  }

  getTransaction(
    ...args: NetworkGetTransactionArgs
  ): Promise<Transaction | undefined> {
    if (!this.getTransactionStub) {
      throw new Error(
        "The getTransaction function must be stubbed first:\n\tcontract.stubGetTransaction()",
      );
    }
    return this.getTransactionStub(args);
  }

  async waitForTransaction(
    ...[hash, { timeout = 60_000 } = {}]: NetworkWaitForTransactionArgs
  ): Promise<TransactionReceipt | undefined> {
    // biome-ignore lint/suspicious/noAsyncPromiseExecutor: special case for testing
    return new Promise(async (resolve) => {
      let transaction: Transaction | undefined;

      transaction = await this.getTransactionStub?.([hash]).catch();

      if (transaction) {
        return resolve(transactionToReceipt(transaction));
      }

      // Poll for the transaction until it's found or the timeout is reached
      let waitedTime = 0;
      const interval = setInterval(async () => {
        waitedTime += 1000;
        transaction = await this.getTransactionStub?.([hash]).catch();
        if (transaction || waitedTime >= timeout) {
          clearInterval(interval);
          resolve(transactionToReceipt(transaction));
        }
      }, 1000);
    });
  }
}

export function transactionToReceipt(
  transaction: Transaction | undefined,
): TransactionReceipt | undefined {
  return transaction
    ? {
        blockHash: transaction.blockHash!,
        blockNumber: transaction.blockNumber!,
        from: transaction.from!,
        to: transaction.to!,
        transactionIndex: transaction.transactionIndex!,
        cumulativeGasUsed: 0n,
        effectiveGasPrice: 0n,
        transactionHash: transaction.hash!,
        gasUsed: 0n,
        logsBloom: "0x",
        status: "success",
      }
    : undefined;
}
