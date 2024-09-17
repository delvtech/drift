import { ALICE } from "src/base/testing/accounts";
import {
  NetworkStub,
  transactionToReceipt,
} from "src/network/stubs/NetworkStub";
import { describe, expect, it } from "vitest";
import type { Transaction } from "../types/Transaction";

describe("NetworkStub", () => {
  it("stubs getBalance", async () => {
    const network = new NetworkStub();

    network.stubGetBalance({
      args: [ALICE],
      value: 100n,
    });

    const balance = await network.getBalance(ALICE);

    expect(balance).toEqual(100n);
  });

  it("stubs getBlock", async () => {
    const network = new NetworkStub();

    const block = {
      blockNumber: 1n,
      timestamp: 1000n,
    };
    network.stubGetBlock({
      args: [{ blockNumber: 1n }],
      value: block,
    });

    const blockResponse = await network.getBlock({ blockNumber: 1n });

    expect(blockResponse).toEqual(block);
  });

  it("stubs getChainId", async () => {
    const network = new NetworkStub();

    network.stubGetChainId(42069);

    const chainId = await network.getChainId();

    expect(chainId).toEqual(42069);
  });

  it("stubs getTransaction", async () => {
    const network = new NetworkStub();

    const txHash = "0x123abc";
    const tx: Transaction = {
      gas: 100n,
      gasPrice: 100n,
      input: "0x456def",
      nonce: 0,
      type: "0x0",
      value: 0n,
    };

    network.stubGetTransaction({
      args: [txHash],
      value: tx,
    });

    const transaction = await network.getTransaction(txHash);

    expect(transaction).toEqual(tx);
  });

  it("waits for stubbed transactions", async () => {
    const network = new NetworkStub();

    const txHash = "0x123abc";
    const stubbedTx = {
      gas: 100n,
      gasPrice: 100n,
      input: "0x456def",
      nonce: 0,
      type: "0x0",
      value: 0n,
    } as const;

    const waitPromise = network.waitForTransaction(txHash);

    await new Promise((resolve) => {
      setTimeout(() => {
        network.stubGetTransaction({
          args: [txHash],
          value: stubbedTx,
        });
        resolve(undefined);
      }, 1000);
    });

    const tx = await waitPromise;

    expect(tx).toEqual(transactionToReceipt(stubbedTx));
  });

  it("reaches timeout when waiting for transactions that are never stubbed", async () => {
    const network = new NetworkStub();

    const waitPromise = await network.waitForTransaction("0x123abc", {
      timeout: 1000,
    });

    expect(waitPromise).toBe(undefined);
  });
});
