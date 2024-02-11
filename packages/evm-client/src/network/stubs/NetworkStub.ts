import { SinonStub, stub } from "sinon";
import { Block } from "src/network/types/Block";
import {
  Network,
  NetworkGetBlockArgs,
  NetworkGetTransactionArgs,
} from "src/network/types/Network";
import { Transaction } from "src/network/types/Transaction";

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
}
