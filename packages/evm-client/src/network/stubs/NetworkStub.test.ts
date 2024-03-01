import {
  NetworkStub,
  transactionToReceipt,
} from 'src/network/stubs/NetworkStub';
import { describe, expect, it } from 'vitest';

describe('NetworkStub', () => {
  it('waits for stubbed transactions', async () => {
    const network = new NetworkStub();

    const txHash = '0x123abc';
    const stubbedTx = {
      gas: 100n,
      gasPrice: 100n,
      input: '0x456def',
      nonce: 0,
      type: '0x0',
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

  it('reaches timeout when waiting for transactions that are never stubbed', async () => {
    const network = new NetworkStub();

    const waitPromise = await network.waitForTransaction('0x123abc', {
      timeout: 1000,
    });

    expect(waitPromise).toBe(undefined);
  });
});
