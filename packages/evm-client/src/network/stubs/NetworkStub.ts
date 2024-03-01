import { SinonStub, stub } from 'sinon';
import { Block } from 'src/network/types/Block';
import {
  Network,
  NetworkGetBlockArgs,
  NetworkGetTransactionArgs,
  NetworkWaitForTransactionArgs,
} from 'src/network/types/Network';
import { Transaction, TransactionReceipt } from 'src/network/types/Transaction';

/**
 * A mock implementation of a `Network` designed to facilitate unit
 * testing.
 */
export class NetworkStub implements Network {
  protected getBlockStub:
    | SinonStub<[NetworkGetBlockArgs?], Promise<Block | undefined>>
    | undefined;
  protected getTransactionStub:
    | SinonStub<[NetworkGetTransactionArgs?], Promise<Transaction | undefined>>
    | undefined;

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

  getBlock(...args: NetworkGetBlockArgs): Promise<Block | undefined> {
    if (!this.getBlockStub) {
      throw new Error(
        `The getBlock function must be stubbed first:\n\tcontract.stubGetBlock()`,
      );
    }
    return this.getBlockStub(args);
  }

  getTransaction(
    ...args: NetworkGetTransactionArgs
  ): Promise<Transaction | undefined> {
    if (!this.getTransactionStub) {
      throw new Error(
        `The getTransaction function must be stubbed first:\n\tcontract.stubGetTransaction()`,
      );
    }
    return this.getTransactionStub(args);
  }

  async waitForTransaction(
    ...[hash, { timeout = 60_000 } = {}]: NetworkWaitForTransactionArgs
  ): Promise<TransactionReceipt | undefined> {
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
        transactionIndex: transaction.transactionIndex!,
        type: transaction.type,
        cumulativeGasUsed: 0n,
        effectiveGasPrice: 0n,
        transactionHash: transaction.hash!,
        gasUsed: 0n,
        logsBloom: '0x',
      }
    : undefined;
}
